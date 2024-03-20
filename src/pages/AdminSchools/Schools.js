import React, { useEffect, useState } from "react";
import "./schools.scss";
import { fetchAllSchool, deleteSchool } from '../../services/schoolServices'
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalSchool from './ModalSchool';
import ModalDelete from "../../components/modalDelete/ModalDelete";
import _ from "lodash";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const Schools = (props) => {
    const [listSchools, setListSchools] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModel] = useState({});
    const [isShowModalSchool, setIsShowModalSchool] = useState(false);
    const [actionModalSchool, setActionModalSchool] = useState("CREATE");
    const [dataModalSchool, setDataModalSchool] = useState({});
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");

    useEffect(() => {
        fetchSchools();
    }, [currentPage]);

    const fetchSchools = async () => {
        let response = await fetchAllSchool(currentPage, currentLimit);
        if (response && response.dt && response.ec === 0) {
            setTotalPages(response.dt.totalPages);
            setListSchools(response.dt.content);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };

    const handleDeleteSchool = async (school) => {
        setDataModel(school);
        setIsShowModalDelete(true);
    };

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModel({});
    };

    const onHideModalSchool = async () => {
        setIsShowModalSchool(false);
        setDataModalSchool({});
        await fetchSchools();
    };

    const confirmDeleteSchool = async () => {
        let response = await deleteSchool(dataModal);
        if (response && response.ec === 0) {
            toast.success(response.em);
            await fetchSchools();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.em);
        }
    };

    const handleEditSchool = (school) => {
        setActionModalSchool("UPDATE");
        setDataModalSchool(school);
        setIsShowModalSchool(true);
    };

    const handleRefresh = async () => {
        await fetchSchools();
    };

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneListSchools = _.cloneDeep(listSchools);
        cloneListSchools = _.orderBy(cloneListSchools, [sortField], [sortBy]);
        setListSchools(cloneListSchools);
    };

    const handleSearch = _.debounce((event) => {
        let term = event.target.value.toLowerCase();
        if (term) {
            let cloneListSchools = _.cloneDeep(listSchools);
            cloneListSchools = cloneListSchools.filter((item) =>
                item.name.toLowerCase().includes(term)
            );
            setListSchools(cloneListSchools);
        } else {
            fetchSchools();
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

                        <div className="manage-schools-container">
                            <div className="school-header row">
                                <div className="title mt-3">
                                    <h3>Quản lý trường học</h3>
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
                                                setIsShowModalSchool(true);
                                                setActionModalSchool("CREATE");
                                            }}
                                        >
                                            <i className="fa fa-plus-circle"></i>Thêm mới
                                        </button>
                                    </div>

                                    <div className="header-right col-6 ">
                                    </div>
                                </div>
                            </div>
                            <div className="school-body">
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
                                            <th scope="col">Địa chỉ</th>
                                            <th scope="col">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listSchools && listSchools.length > 0 ? (
                                            <>
                                                {listSchools.map((item, index) => {
                                                    return (
                                                        <tr key={`row-${index}`}>
                                                            <td>{currentPage * currentLimit + index + 1}</td>
                                                            <td>{item.id}</td>
                                                            <td>{item.name}</td>
                                                            <td>
                                                                {item.address && (
                                                                    <>
                                                                        {item.address.other && item.address.other !== "" ? item.address.other : "Unnamed road"
                                                                        }, {item.address.wardCommune}, {item.address.district}, {item.address.province}, {item.address.city}
                                                                    </>
                                                                )}
                                                            </td>                                                            <td>
                                                                <span
                                                                    title="Sửa"
                                                                    className="edit"
                                                                    onClick={() => {
                                                                        handleEditSchool(item);
                                                                    }}
                                                                >
                                                                    <i className="fa fa-pencil"></i>
                                                                </span>
                                                                <span
                                                                    title="Xóa"
                                                                    className="delete"
                                                                    onClick={() => {
                                                                        handleDeleteSchool(item);
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
                                                    <td>Not found School</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 0 && (
                                <div className="school-footer">
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
                confirmDelete={confirmDeleteSchool}
                dataModal={dataModal}
                title={"Trường học"}
            />
            <ModalSchool
                show={isShowModalSchool}
                onHide={onHideModalSchool}
                action={actionModalSchool}
                dataModalSchool={dataModalSchool}
            />
        </>
    );
};

export default Schools;
