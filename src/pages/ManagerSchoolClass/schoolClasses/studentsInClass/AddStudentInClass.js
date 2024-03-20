import React, { useEffect, useState } from "react";
import './studentsInClass.scss';
import { fetchAllStudentNotInClassWithPagination, addStudentFromClass, addManyStudentsFromClass } from '../../../../services/studentServices'
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import _ from "lodash";
import Navbar from "../../../../components/navbar/Navbar";
import Sidebar from "../../../../components/sidebar/Sidebar";
import Scrollbars from "react-custom-scrollbars-2";
import { useSelector } from "react-redux";
import ModalAdd from "./ModalAdd";
import { useHistory } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const Students = (props) => {

    const { schoolClassId, className, yearName, selectedGrade, selectedGradeLabel } = props.location.state;

    const [listStudents, setListStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [isShowModalAdd, setIsShowModalAdd] = useState(false);
    const [dataModal, setDataModel] = useState({});
    const [isShowModalStudentInClass, setIsShowModalStudentInClass] = useState(false);
    const [actionModalStudentInClass, setActionModalStudentInClass] = useState("CREATE");
    const [dataModalStudentInClass, setDataModalStudentInClass] = useState({});
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");
    // const user = useSelector(state => state.user);
    // const schoolId = user?.dataRedux?.account?.schoolId || [];
    const [gender, setGender] = useState('')
    const history = useHistory();


    useEffect(() => {
        fetchStudents();
    }, [currentPage]);

    const fetchStudents = async () => {
        let response = await fetchAllStudentNotInClassWithPagination(currentPage, currentLimit, schoolClassId);
        if (response && response.dt && response.ec === 0) {
            setTotalPages(response.dt.totalPages);
            setListStudents(response.dt.content);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };

    const handleAddStudent = async (student) => {
        setDataModel(student);
        setIsShowModalAdd(true);
    };

    const handleClose = () => {
        setIsShowModalAdd(false);
        setDataModel({});
    };

    const onHideModalStudentInClass = async () => {
        setIsShowModalStudentInClass(false);
        setDataModalStudentInClass({});
        await fetchStudents();
    };

    const confirmAddStudent = async () => {
        let response = await addStudentFromClass(schoolClassId, dataModal);
        if (response && response.ec === 0) {
            toast.success(response.em);
            await fetchStudents();
            setIsShowModalAdd(false);
        } else {
            toast.error(response.em);
        }
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

    const handleSearchName = _.debounce((event) => {
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
    const handleSearchDOB = _.debounce((event) => {
        let term = event.target.value.toLowerCase();
        if (term) {
            let cloneListStudents = _.cloneDeep(listStudents);
            cloneListStudents = cloneListStudents.filter((item) =>
                item.dateOfBirth.toLowerCase().includes(term)
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

    const handleBack = () => {
        history.push({
            pathname: "/list-students-in-class",
            state: {
                schoolClassId: schoolClassId, className: className, yearName: yearName,
                selectedGrade: selectedGrade, selectedGradeLabel: selectedGradeLabel
            }
        });
    };

    const isSelected = (studentId) => {
        return selectedStudents.includes(studentId);
    };
    const [selectedStudents, setSelectedStudents] = useState([]);

    const handleCheckboxChange = (studentId) => {
        const isStudentSelected = selectedStudents.includes(studentId);
        if (isStudentSelected) {
            setSelectedStudents(selectedStudents.filter(id => id !== studentId));
        } else {
            setSelectedStudents([...selectedStudents, studentId]);
        }
    };
    const handleToggleSelectAll = () => {
        if (selectedStudents.length === 0) {
            const allStudentIds = listStudents.map(student => student.id);
            setSelectedStudents(allStudentIds);
        } else {
            setSelectedStudents([]);
        }
    };

    const handleAddManyStudents = (students) => {
        setDataModel(students);
        setIsShowModalAdd(true);
    };

    const confirmAddManyStudents = async () => {
        try {
            const selectedStudentIds = listStudents.filter(student => isSelected(student.id)).map(student => student.id);

            const response = await addManyStudentsFromClass(schoolClassId, selectedStudentIds);
            if (response && response.ec === 0) {
                toast.success(response.em);
                await fetchStudents();
                setSelectedStudents([]);
                setIsShowModalAdd(false);
            } else {
                toast.error(response.em);
            }

        } catch (error) {
            console.error('Lỗi khi thêm nhiều học sinh vào lớp học:', error);
        }
    };

    return (
        <>
            <div className="home">
                <Sidebar />
                <div className="homeContainer">
                    <Navbar />

                    <Scrollbars autoHide style={{ height: scrollHeight, width: 'auto' }}>
                        <div className="container">
                            <div className="col-12 col-sm-4 my-3">
                                <div className="search col-7">
                                    <input
                                        placeholder="Tìm theo tên...."
                                        onChange={(event) => handleSearchName(event)}
                                    />
                                    <SearchOutlinedIcon />
                                </div>

                                <div className="search col-7">
                                    <input
                                        placeholder="Tìm theo ngày sinh...."
                                        onChange={(event) => handleSearchDOB(event)}
                                    />
                                    <SearchOutlinedIcon />
                                </div>
                            </div>

                            <div className="manage-students-container">
                                <div className="student-header row">
                                    <div className="title mt-3">
                                        <h3>Danh sách học sinh chưa có lớp</h3>
                                    </div>
                                    <div className="actions my-3">
                                        <div className="header-left col-6">
                                            <button
                                                className="btn btn-success refresh"
                                                onClick={handleRefresh}
                                            >
                                                <i className="fa fa-refresh"></i>Làm mới
                                            </button>

                                            {selectedStudents.length >= 2 && (
                                                <button
                                                    className="btn btn-primary refresh"
                                                    onClick={() => handleAddManyStudents(selectedStudents)}>
                                                    <i className="fa fa-plus"></i>Thêm nhiều
                                                </button>
                                            )}

                                            <div className="mt-3">
                                                <p>
                                                    Số học sinh đã chọn: {(selectedStudents.length) ? (selectedStudents.length) : 0}
                                                </p>
                                                Tổng số học sinh: {(listStudents.length) ? (listStudents.length) : 0}
                                            </div>
                                        </div>
                                        <div className="header-right col-6 ">
                                            <button
                                                className="btn btn-warning refresh"
                                                onClick={handleBack}
                                            >
                                                <i className="fa fa-arrow-left"></i>Quay lại lớp học
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="student-body">
                                    <table className="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">
                                                    {listStudents.length > 0 && (
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedStudents.length === listStudents.length}
                                                            onChange={handleToggleSelectAll}
                                                        />
                                                    )}
                                                </th>
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
                                                            <tr key={`row-${index}`} className={isSelected(item.id) ? "table-active" : ""}>
                                                                <td>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isSelected(item.id)}
                                                                        onChange={() => handleCheckboxChange(item.id)}
                                                                    />
                                                                </td>
                                                                <td>{currentPage * currentLimit + index + 1}</td>
                                                                <td>{item.id}</td>
                                                                <td>{item.firstName}</td>
                                                                <td>{item.lastName}</td>
                                                                <td>{item.dateOfBirth}</td>
                                                                <td>{item.user?.gender}</td>
                                                                <td>{item.nationality}</td>
                                                                <td>{item.ethnicity}</td>
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
                                                                        title="Thêm"
                                                                        className="add"
                                                                        onClick={() => {
                                                                            handleAddStudent(item);
                                                                        }}
                                                                    >
                                                                        <i className="fa fa-plus-circle"></i>
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
            <ModalAdd
                show={isShowModalAdd}
                handleClose={handleClose}
                confirmAdd={confirmAddStudent}
                confirmAddManyStudents={confirmAddManyStudents}
                dataModal={dataModal}
                title={"Học sinh"}
            />
        </>
    );
};

export default Students;
