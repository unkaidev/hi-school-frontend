import React, { useEffect, useState } from "react";
import "./modalListSemesters.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { fetchAllSemesterWithPagination, deleteSemester } from '../../../services/semesterService'
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalSemester from './ModalSemester';
import ModalDelete from "../../../components/modalDelete/ModalDelete";
import _ from "lodash";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";

const ModalListSemesters = (props) => {
    const [listSemesters, setListSemesters] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModel] = useState({});
    const [isShowModalSemester, setIsShowModalSemester] = useState(false);
    const [actionModalSemester, setActionModalSemester] = useState("CREATE");
    const [dataModalSemester, setDataModalSemester] = useState({});
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");
    const user = useSelector(state => state.user);
    const schoolId = user?.dataRedux?.account?.schoolId || [];

    useEffect(() => {
        fetchSemesters();
    }, [currentPage]);

    const fetchSemesters = async () => {
        let response = await fetchAllSemesterWithPagination(currentPage, currentLimit, schoolId);
        if (response && response.dt && response.ec === 0) {
            setTotalPages(response.dt.totalPages);
            setListSemesters(response.dt.content);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };

    const handleDeleteSemester = async (semester) => {
        setDataModel(semester);
        setIsShowModalDelete(true);
    };

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModel({});
    };

    const onHideModalSemester = async () => {
        setIsShowModalSemester(false);
        setDataModalSemester({});
        await fetchSemesters();
    };

    const confirmDeleteSemester = async () => {
        let response = await deleteSemester(dataModal);
        if (response && response.ec === 0) {
            toast.success(response.em);
            await fetchSemesters();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.em);
        }
    };

    const handleEditSemester = (semester) => {
        setActionModalSemester("UPDATE");
        setDataModalSemester(semester);
        setIsShowModalSemester(true);
    };

    const handleRefresh = async () => {
        await fetchSemesters();
    };

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneListSemesters = _.cloneDeep(listSemesters);
        cloneListSemesters = _.orderBy(cloneListSemesters, [sortField], [sortBy]);
        setListSemesters(cloneListSemesters);
    };

    const handleSearch = _.debounce((event) => {
        let term = event.target.value.toLowerCase();
        if (term) {
            let cloneListSemesters = _.cloneDeep(listSemesters);
            cloneListSemesters = cloneListSemesters.filter((item) =>
                item.name.toLowerCase().includes(term)
            );
            setListSemesters(cloneListSemesters);
        } else {
            fetchSemesters();
        }
    }, 300);

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

                        <div className="manage-semesters-container">
                            <div className="semester-header row">
                                <div className="title mt-3">
                                    <h3>Quản lý kỳ học</h3>
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
                                                setIsShowModalSemester(true);
                                                setActionModalSemester("CREATE");
                                            }}
                                        >
                                            <i className="fa fa-plus-circle"></i>Thêm mới
                                        </button>
                                    </div>

                                    <div className="header-right col-6 ">
                                    </div>
                                </div>
                            </div>
                            <div className="semester-body">
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
                                            <th scope="col">Thời gian học</th>
                                            <th scope="col">Năm học</th>
                                            <th scope="col">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listSemesters && listSemesters.length > 0 ? (
                                            <>
                                                {listSemesters.map((item, index) => {
                                                    return (
                                                        <tr key={`row-${index}`}>
                                                            <td>{currentPage * currentLimit + index + 1}</td>
                                                            <td>{item.id}</td>
                                                            <td>{item.name}</td>
                                                            <td>{item.study_period}</td>
                                                            <td>
                                                                {item.schoolYear && (
                                                                    <>
                                                                        {item.schoolYear.name}
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <span
                                                                    title="Sửa"
                                                                    className="edit"
                                                                    onClick={() => {
                                                                        handleEditSemester(item);
                                                                    }}
                                                                >
                                                                    <i className="fa fa-pencil"></i>
                                                                </span>
                                                                <span
                                                                    title="Xóa"
                                                                    className="delete"
                                                                    onClick={() => {
                                                                        handleDeleteSemester(item);
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
                                                    <td>Not found Semester</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 0 && (
                                <div className="semester-footer">
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
                confirmDelete={confirmDeleteSemester}
                dataModal={dataModal}
                title={"Kỳ học"}
            />
            <ModalSemester
                show={isShowModalSemester}
                onHide={onHideModalSemester}
                action={actionModalSemester}
                dataModalSemester={dataModalSemester}
                schoolId={schoolId}
            />
        </>
    );
};

export default ModalListSemesters;
