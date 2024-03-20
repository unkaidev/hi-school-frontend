import React, { useEffect, useState } from "react";
import "./modalListSchedules.scss";
import { fetchAllScheduleWithPagination, deleteSchedule } from '../../../services/scheduleService'
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalSchedule from './ModalSchedule';
import ModalDelete from "../../../components/modalDelete/ModalDelete";
import _ from "lodash";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";


const ModalListSchedules = (props) => {
    const [listSchedules, setListSchedules] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModel] = useState({});
    const [isShowModalSchedule, setIsShowModalSchedule] = useState(false);
    const [actionModalSchedule, setActionModalSchedule] = useState("CREATE");
    const [dataModalSchedule, setDataModalSchedule] = useState({});
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");

    const user = useSelector(state => state.user);
    const schoolId = user?.dataRedux?.account?.schoolId || [];

    useEffect(() => {
        fetchSchedules();
    }, [currentPage]);

    const fetchSchedules = async () => {
        let response = await fetchAllScheduleWithPagination(currentPage, currentLimit, schoolId);
        if (response && response.dt && response.ec === 0) {
            setTotalPages(response.dt.totalPages);
            setListSchedules(response.dt.content);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };

    const handleDeleteSchedule = async (schedule) => {
        setDataModel(schedule);
        setIsShowModalDelete(true);
    };

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModel({});
    };

    const onHideModalSchedule = async () => {
        setIsShowModalSchedule(false);
        setDataModalSchedule({});
        await fetchSchedules();
    };

    const confirmDeleteSchedule = async () => {
        let response = await deleteSchedule(dataModal);
        if (response && response.ec === 0) {
            toast.success(response.em);
            await fetchSchedules();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.em);
        }
    };

    const handleEditSchedule = (schedule) => {
        setActionModalSchedule("UPDATE");
        const startTimeFormatted = formatTime(schedule.startTime);
        const endTimeFormatted = formatTime(schedule.endTime);
        const scheduleWithFormattedTime = { ...schedule, startTime: startTimeFormatted, endTime: endTimeFormatted };
        setDataModalSchedule(scheduleWithFormattedTime);
        setIsShowModalSchedule(true);
    };


    const handleRefresh = async () => {
        await fetchSchedules();
    };

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneListSchedules = _.cloneDeep(listSchedules);
        cloneListSchedules = _.orderBy(cloneListSchedules, [sortField], [sortBy]);
        setListSchedules(cloneListSchedules);
    };

    const handleSearch = _.debounce((event) => {
        let term = event.target.value.toLowerCase();
        if (term) {
            let cloneListSchedules = _.cloneDeep(listSchedules);
            cloneListSchedules = cloneListSchedules.filter((item) =>
                item.name.toLowerCase().includes(term)
            );
            setListSchedules(cloneListSchedules);
        } else {
            fetchSchedules();
        }
    }, 300);

    const formatTime = (timeArray) => {
        const hours = timeArray[0].toString().padStart(2, '0');
        const minutes = timeArray[1].toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <>
            <div className="home">
                <Sidebar />
                <div className="homeContainer">
                    <Navbar />
                    <div className="container">
                        <div className="col-12 col-sm-4 my-3">
                            <div className="row">
                                <div className="search col-7">
                                    <input
                                        placeholder="Tìm theo tên...."
                                        onChange={(event) => handleSearch(event)}
                                    />
                                    <SearchOutlinedIcon />
                                </div>
                            </div>
                        </div>

                        <div className="manage-schedules-container">
                            <div className="schedule-header row">
                                <div className="title mt-3">
                                    <h3>Quản lý thời gian biểu</h3>
                                </div>
                                <div className="actions my-3">
                                    <div className="header-left col-6">
                                        <button
                                            className="btn btn-success refresh"
                                            onClick={handleRefresh}
                                        >
                                            <i className="fa fa-refresh"></i>Làm mới
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                setIsShowModalSchedule(true);
                                                setActionModalSchedule("CREATE");
                                            }}
                                        >
                                            <i className="fa fa-plus-circle"></i>Thêm mới
                                        </button>
                                    </div>

                                    <div className="header-right col-6 ">
                                    </div>
                                </div>
                            </div>
                            <div className="schedule-body">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">STT</th>
                                            <th>
                                                <div className="sort-header">
                                                    <span>ID</span>
                                                    <span>
                                                        <i
                                                            className="fa-solid fa-arrow-down-long"
                                                            onClick={() => handleSort("desc", "id")}
                                                        ></i>
                                                        <i
                                                            className="fa-solid fa-arrow-up-long"
                                                            onClick={() => handleSort("asc", "id")}
                                                        ></i>
                                                    </span>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="sort-header">
                                                    <span>Tên</span>
                                                    <span>
                                                        <i
                                                            className="fa-solid fa-arrow-down-long"
                                                            onClick={() => handleSort("desc", "name")}
                                                        ></i>
                                                        <i
                                                            className="fa-solid fa-arrow-up-long"
                                                            onClick={() => handleSort("asc", "name")}
                                                        ></i>
                                                    </span>
                                                </div>
                                            </th>
                                            <th scope="col">Kỳ học</th>
                                            <th scope="col">Năm học</th>
                                            <th scope="col">Bắt đầu</th>
                                            <th scope="col">Kết thúc</th>
                                            <th scope="col">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listSchedules && listSchedules.length > 0 ? (
                                            <>
                                                {listSchedules.map((item, index) => {
                                                    return (
                                                        <tr key={`row-${index}`}>
                                                            <td>{currentPage * currentLimit + index + 1}</td>
                                                            <td>{item.id}</td>
                                                            <td>{item.name}</td>
                                                            <td>
                                                                {item.semester && (
                                                                    <>
                                                                        {item.semester.name}
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {item.semester && (
                                                                    <>
                                                                        {item.semester.schoolYear.name}
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>{formatTime(item.startTime)}</td>
                                                            <td>{formatTime(item.endTime)}</td>

                                                            <td>
                                                                <span
                                                                    title="Sửa"
                                                                    className="edit"
                                                                    onClick={() => {
                                                                        handleEditSchedule(item);
                                                                    }}
                                                                >
                                                                    <i className="fa fa-pencil"></i>
                                                                </span>
                                                                <span
                                                                    title="Xóa"
                                                                    className="delete"
                                                                    onClick={() => {
                                                                        handleDeleteSchedule(item);
                                                                    }}
                                                                >
                                                                    <i className="fa fa-trash-can"></i>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            <>
                                                <tr>
                                                    <td>Not found Schedule</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 0 && (
                                <div className="schedule-footer">
                                    <ReactPaginate
                                        nextLabel="next >"
                                        onPageChange={handlePageClick}
                                        pageRangeDisplayed={3}
                                        marginPagesDisplayed={2}
                                        pageCount={totalPages}
                                        previousLabel="< previous"
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link"
                                        previousClassName="page-item"
                                        previousLinkClassName="page-link"
                                        nextClassName="page-item"
                                        nextLinkClassName="page-link"
                                        breakLabel="..."
                                        breakClassName="page-item"
                                        breakLinkClassName="page-link"
                                        containerClassName="pagination"
                                        activeClassName="active"
                                        renderOnZeroPageCount={null}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ModalDelete
                show={isShowModalDelete}
                handleClose={handleClose}
                confirmDelete={confirmDeleteSchedule}
                dataModal={dataModal}
                title={"Thời gian biểu"}
            />
            <ModalSchedule
                show={isShowModalSchedule}
                onHide={onHideModalSchedule}
                action={actionModalSchedule}
                dataModalSchedule={dataModalSchedule}
                schoolId={schoolId}
            />
        </>
    );
};

export default ModalListSchedules;
