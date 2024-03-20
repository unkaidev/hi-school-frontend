import React, { useEffect, useState } from "react";
import "./modalListYears.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { fetchAllYearWithPagination, deleteYear } from '../../../services/yearService'
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalYear from './ModalYear';
import ModalDelete from "../../../components/modalDelete/ModalDelete";
import _ from "lodash";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";


const ModalListYears = (props) => {
    const [listYears, setListYears] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModel] = useState({});
    const [isShowModalYear, setIsShowModalYear] = useState(false);
    const [actionModalYear, setActionModalYear] = useState("CREATE");
    const [dataModalYear, setDataModalYear] = useState({});
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");

    const user = useSelector(state => state.user);
    const schoolId = user?.dataRedux?.account?.schoolId || [];

    useEffect(() => {
        fetchYears();
    }, [currentPage]);

    const fetchYears = async () => {
        let response = await fetchAllYearWithPagination(currentPage, currentLimit, schoolId);
        if (response && response.dt && response.ec === 0) {
            setTotalPages(response.dt.totalPages);
            setListYears(response.dt.content);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };

    const handleDeleteYear = async (year) => {
        setDataModel(year);
        setIsShowModalDelete(true);
    };

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModel({});
    };

    const onHideModalYear = async () => {
        setIsShowModalYear(false);
        setDataModalYear({});
        await fetchYears();
    };

    const confirmDeleteYear = async () => {
        let response = await deleteYear(dataModal);
        if (response && response.ec === 0) {
            toast.success(response.em);
            await fetchYears();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.em);
        }
    };

    const handleEditYear = (year) => {
        setActionModalYear("UPDATE");
        setDataModalYear(year);
        setIsShowModalYear(true);
    };

    const handleRefresh = async () => {
        await fetchYears();
    };

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneListYears = _.cloneDeep(listYears);
        cloneListYears = _.orderBy(cloneListYears, [sortField], [sortBy]);
        setListYears(cloneListYears);
    };

    const handleSearch = _.debounce((event) => {
        let term = event.target.value.toLowerCase();
        if (term) {
            let cloneListYears = _.cloneDeep(listYears);
            cloneListYears = cloneListYears.filter((item) =>
                item.name.toLowerCase().includes(term)
            );
            setListYears(cloneListYears);
        } else {
            fetchYears();
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

                        <div className="manage-years-container">
                            <div className="year-header row">
                                <div className="title mt-3">
                                    <h3>Quản lý năm học</h3>
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
                                                setIsShowModalYear(true);
                                                setActionModalYear("CREATE");
                                            }}
                                        >
                                            <i className="fa fa-plus-circle"></i>Thêm mới
                                        </button>
                                    </div>

                                    <div className="header-right col-6 ">
                                    </div>
                                </div>
                            </div>
                            <div className="year-body">
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
                                            <th scope="col">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listYears && listYears.length > 0 ? (
                                            <>
                                                {listYears.map((item, index) => {
                                                    return (
                                                        <tr key={`row-${index}`}>
                                                            <td>{currentPage * currentLimit + index + 1}</td>
                                                            <td>{item.id}</td>
                                                            <td>{item.name}</td>
                                                            <td>
                                                                <span
                                                                    title="Sửa"
                                                                    className="edit"
                                                                    onClick={() => {
                                                                        handleEditYear(item);
                                                                    }}
                                                                >
                                                                    <i className="fa fa-pencil"></i>
                                                                </span>
                                                                <span
                                                                    title="Xóa"
                                                                    className="delete"
                                                                    onClick={() => {
                                                                        handleDeleteYear(item);
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
                                                    <td>Not found Year</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 0 && (
                                <div className="year-footer">
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
                confirmDelete={confirmDeleteYear}
                dataModal={dataModal}
                title={"Năm học"}
            />
            <ModalYear
                show={isShowModalYear}
                onHide={onHideModalYear}
                action={actionModalYear}
                dataModalYear={dataModalYear}
                schoolId={schoolId}
            />
        </>
    );
};

export default ModalListYears;
