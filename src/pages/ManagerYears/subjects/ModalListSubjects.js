import React, { useEffect, useState } from "react";
import "./modalListSubjects.scss";
import { fetchAllSubjectWithPagination, deleteSubject } from '../../../services/subjectService'
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalSubject from './ModalSubject';
import ModalDelete from "../../../components/modalDelete/ModalDelete";
import _ from "lodash";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const ModalListSubjects = (props) => {
    const [listSubjects, setListSubjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModel] = useState({});
    const [isShowModalSubject, setIsShowModalSubject] = useState(false);
    const [actionModalSubject, setActionModalSubject] = useState("CREATE");
    const [dataModalSubject, setDataModalSubject] = useState({});
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");
    const user = useSelector(state => state.user);
    const schoolId = user?.dataRedux?.account?.schoolId || [];

    useEffect(() => {
        fetchSubjects();
    }, [currentPage]);

    const fetchSubjects = async () => {
        let response = await fetchAllSubjectWithPagination(currentPage, currentLimit, schoolId);
        if (response && response.dt && response.ec === 0) {
            setTotalPages(response.dt.totalPages);
            setListSubjects(response.dt.content);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };

    const handleDeleteSubject = async (subject) => {
        setDataModel(subject);
        setIsShowModalDelete(true);
    };

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModel({});
    };

    const onHideModalSubject = async () => {
        setIsShowModalSubject(false);
        setDataModalSubject({});
        await fetchSubjects();
    };

    const confirmDeleteSubject = async () => {
        let response = await deleteSubject(dataModal);
        if (response && response.ec === 0) {
            toast.success(response.em);
            await fetchSubjects();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.em);
        }
    };

    const handleEditSubject = (subject) => {
        setActionModalSubject("UPDATE");
        setDataModalSubject(subject);
        setIsShowModalSubject(true);
    };

    const handleRefresh = async () => {
        await fetchSubjects();
    };

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneListSubjects = _.cloneDeep(listSubjects);
        cloneListSubjects = _.orderBy(cloneListSubjects, [sortField], [sortBy]);
        setListSubjects(cloneListSubjects);
    };

    const handleSearch = _.debounce((event) => {
        let term = event.target.value.toLowerCase();
        if (term) {
            let cloneListSubjects = _.cloneDeep(listSubjects);
            cloneListSubjects = cloneListSubjects.filter((item) =>
                item.name.toLowerCase().includes(term)
            );
            setListSubjects(cloneListSubjects);
        } else {
            fetchSubjects();
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

                        <div className="manage-subjects-container">
                            <div className="subject-header row">
                                <div className="title mt-3">
                                    <h3>Quản lý môn học</h3>
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
                                                setIsShowModalSubject(true);
                                                setActionModalSubject("CREATE");
                                            }}
                                        >
                                            <i className="fa fa-plus-circle"></i>Thêm mới
                                        </button>
                                    </div>

                                    <div className="header-right col-6 ">
                                    </div>
                                </div>
                            </div>
                            <div className="subject-body">
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
                                            <th scope="col">Khối học</th>
                                            <th scope="col">Kỳ học</th>
                                            <th scope="col">Năm học</th>
                                            <th scope="col">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listSubjects && listSubjects.length > 0 ? (
                                            <>
                                                {listSubjects.map((item, index) => {
                                                    return (
                                                        <tr key={`row-${index}`}>
                                                            <td>{currentPage * currentLimit + index + 1}</td>
                                                            <td>{item.id}</td>
                                                            <td>{item.name}</td>
                                                            <td>{item.grade}</td>
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
                                                            <td>
                                                                <span
                                                                    title="Sửa"
                                                                    className="edit"
                                                                    onClick={() => {
                                                                        handleEditSubject(item);
                                                                    }}
                                                                >
                                                                    <i className="fa fa-pencil"></i>
                                                                </span>
                                                                <span
                                                                    title="Xóa"
                                                                    className="delete"
                                                                    onClick={() => {
                                                                        handleDeleteSubject(item);
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
                                                    <td>Not found Subject</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 0 && (
                                <div className="subject-footer">
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
                confirmDelete={confirmDeleteSubject}
                dataModal={dataModal}
                title={"Môn học"}
            />
            <ModalSubject
                show={isShowModalSubject}
                onHide={onHideModalSubject}
                action={actionModalSubject}
                dataModalSubject={dataModalSubject}
                schoolId={schoolId}
            />
        </>
    );
};

export default ModalListSubjects;
