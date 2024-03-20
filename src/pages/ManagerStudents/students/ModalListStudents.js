import React, { useEffect, useState } from "react";
import "./modalListStudents.scss";
import { fetchAllStudentWithPagination, deleteStudent } from '../../../services/studentServices'
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalStudent from './ModalStudent';
import ModalDelete from "../../../components/modalDelete/ModalDelete";
import _ from "lodash";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import Scrollbars from "react-custom-scrollbars-2";
import { useSelector } from "react-redux";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const Students = (props) => {
    const [listStudents, setListStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModel] = useState({});
    const [isShowModalStudent, setIsShowModalStudent] = useState(false);
    const [actionModalStudent, setActionModalStudent] = useState("CREATE");
    const [dataModalStudent, setDataModalStudent] = useState({});
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");
    const user = useSelector(state => state.user);
    const schoolId = user?.dataRedux?.account?.schoolId || [];
    const [gender, setGender] = useState('')

    useEffect(() => {
        fetchStudents();
    }, [currentPage]);

    const fetchStudents = async () => {
        let response = await fetchAllStudentWithPagination(currentPage, currentLimit, schoolId);
        if (response && response.dt && response.ec === 0) {
            setTotalPages(response.dt.totalPages);
            setListStudents(response.dt.content);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };

    const handleDeleteStudent = async (student) => {
        setDataModel(student);
        setIsShowModalDelete(true);
    };

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModel({});
    };

    const onHideModalStudent = async () => {
        setIsShowModalStudent(false);
        setDataModalStudent({});
        await fetchStudents();
    };

    const confirmDeleteStudent = async () => {
        let response = await deleteStudent(dataModal);
        if (response && response.ec === 0) {
            toast.success(response.em);
            await fetchStudents();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.em);
        }
    };

    const handleEditStudent = (student) => {
        setActionModalStudent("UPDATE");
        setDataModalStudent(student);
        setIsShowModalStudent(true);
    };

    const handleRefresh = async () => {
        window.location.reload()
    };

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneListStudents = _.cloneDeep(listStudents);
        cloneListStudents = _.orderBy(cloneListStudents, [sortField], [sortBy]);
        setListStudents(cloneListStudents);
    };

    const handleSearch = _.debounce((event) => {
        let term = event.target.value.toLowerCase();
        if (term) {
            let cloneListStudents = _.cloneDeep(listStudents);
            cloneListStudents = cloneListStudents.filter((item) =>
                item.lastName.toLowerCase().includes(term)
            );
            setListStudents(cloneListStudents);
        } else {
            fetchStudents();
        }
    }, 300);

    const [scrollHeight, setScrollHeight] = useState(0);

    useEffect(() => {
        let windowHeight = window.innerHeight;
        setScrollHeight(windowHeight);
    }, [])



    return (
        <>
            <div className="home">
                <Sidebar />
                <div className="homeContainer">
                    <Navbar />

                    <Scrollbars autoHide style={{ height: scrollHeight, width: 'auto' }}>
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

                            <div className="manage-students-container">
                                <div className="student-header row">
                                    <div className="title mt-3">
                                        <h3>Quản lý học sinh</h3>
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
                                                    setIsShowModalStudent(true);
                                                    setActionModalStudent("CREATE");
                                                }}
                                            >
                                                <i className="fa fa-plus-circle"></i>Thêm mới
                                            </button>
                                        </div>

                                        <div className="header-right col-6 ">
                                        </div>
                                    </div>
                                </div>
                                <div className="student-body">
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
                                                <th scope="col">Họ</th>
                                                <th>
                                                    <div className="sort-header">
                                                        <span>Tên</span>
                                                        <span>
                                                            <i
                                                                className="fa-solid fa-arrow-down-long"
                                                                onClick={() => handleSort("desc", "lastName")}
                                                            ></i>
                                                            <i
                                                                className="fa-solid fa-arrow-up-long"
                                                                onClick={() => handleSort("asc", "lastName")}
                                                            ></i>
                                                        </span>
                                                    </div>
                                                </th>
                                                <th scope="col">Ngày sinh</th>
                                                <th scope="col">Giới tính</th>
                                                <th scope="col">Quốc tịch</th>
                                                <th scope="col">Dân tộc</th>
                                                <th scope="col">Số thẻ căn cước </th>
                                                <th scope="col">Ngày cấp </th>
                                                <th scope="col">Nơi cấp</th>
                                                <th scope="col">Địa chỉ thường trú</th>
                                                <th scope="col">Địa chỉ liên lạc</th>
                                                <th scope="col">Tên phụ huynh</th>
                                                <th scope="col">Tên tài khoản</th>
                                                <th scope="col">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listStudents && listStudents.length > 0 ? (
                                                <>
                                                    {listStudents.map((item, index) => {
                                                        return (
                                                            <tr key={`row-${index}`}>
                                                                <td>{currentPage * currentLimit + index + 1}</td>
                                                                <td>{item.id}</td>
                                                                <td>{item.firstName}</td>
                                                                <td>{item.lastName}</td>
                                                                <td>{item.dateOfBirth}</td>
                                                                <td>{item.user?.gender}</td>
                                                                <td>{item.nationality}</td>
                                                                <td>{item.ethnicity}</td>
                                                                <td>{item.citizenId}</td>
                                                                <td>{item.issuedDate}</td>
                                                                <td>{item.issuedPlace.name}</td>
                                                                <td>
                                                                    {item.permanentAddress && (
                                                                        <>
                                                                            {item.permanentAddress.other !== null ? item.permanentAddress.other : "Unnamed road"
                                                                            }, {item.permanentAddress.wardCommune}, {item.permanentAddress.district}, {item.permanentAddress.province}, {item.permanentAddress.city}
                                                                        </>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {item.contactAddress && (
                                                                        <>
                                                                            {item.contactAddress.other !== null ? item.contactAddress.other : "Unnamed road"
                                                                            }, {item.contactAddress.wardCommune}, {item.contactAddress.district}, {item.contactAddress.province}, {item.contactAddress.city}
                                                                        </>
                                                                    )}
                                                                </td>
                                                                <td>{item.parent?.firstName} {item.parent?.lastName}</td>
                                                                <td>{item.user?.username}</td>
                                                                <td>
                                                                    <span
                                                                        title="Sửa"
                                                                        className="edit"
                                                                        onClick={() => {
                                                                            handleEditStudent(item);
                                                                            setGender(item.user?.gender)
                                                                        }}
                                                                    >
                                                                        <i className="fa fa-pencil"></i>
                                                                    </span>
                                                                    <span
                                                                        title="Xóa"
                                                                        className="delete"
                                                                        onClick={() => {
                                                                            handleDeleteStudent(item);
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
                                                        <td>Not found Student</td>
                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 0 && (
                                    <div className="student-footer">
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
                    </Scrollbars>


                </div>
            </div>
            <ModalDelete
                show={isShowModalDelete}
                handleClose={handleClose}
                confirmDelete={confirmDeleteStudent}
                dataModal={dataModal}
                title={"Học sinh"}
            />
            <ModalStudent
                show={isShowModalStudent}
                onHide={onHideModalStudent}
                action={actionModalStudent}
                dataModalStudent={dataModalStudent}
                schoolId={schoolId}
                gender={gender}
            />
        </>
    );
};

export default Students;
