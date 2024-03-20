import React, { useEffect, useState } from "react";
import './studentsInClass.scss';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { changeStatus, fetchAttendancesWithPagination } from "../../../services/attendanceService";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import _, { set } from "lodash";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import Scrollbars from "react-custom-scrollbars-2";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff, faUserXmark, faUser, faPeopleRoof } from '@fortawesome/free-solid-svg-icons';


const Attendances = (props) => {

    const { classData } = props.location.state;

    const [timeTableId, setTimeTableId] = useState('');
    const [scheduleId, setScheduleId] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [classId, setClassId] = useState('');
    const [className, setClassName] = useState('');
    const [lessonName, setLessonName] = useState('');
    const [classSize, setClassSize] = useState(0);
    const [subjectName, setSubjectName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');



    useEffect(() => {
        if (classData) {
            setTimeTableId(classData.timeTableId);
            setScheduleId(classData.scheduleId);
            setTeacherId(classData.teacherId);
            setClassName(classData.class);
            setLessonName(classData.lessonName);
            setClassSize(classData.classSize);
            setSubjectName(classData.title);
            setStartTime(new Date(classData.startDate).toLocaleTimeString());
            setEndTime(new Date(classData.endDate).toLocaleTimeString())
            setClassId(classData.classId)
        }
    })
    const [listAttendances, setListAttendances] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");
    const user = useSelector(state => state.user);
    const schoolId = user?.dataRedux?.account?.schoolId || [];
    const username = user?.dataRedux?.account?.username || '';
    const roles = user?.dataRedux?.account?.roles || [];

    const history = useHistory();
    const [isTeacher, setIsTeacher] = useState(false);
    const [isStudent, setIsStudent] = useState(false);

    useEffect(() => {
        if (username && roles) {
            checkUserRole();
        }
    }, [username, roles]);

    const checkUserRole = () => {
        if (roles.includes('ROLE_TEACHER')) {
            setIsTeacher(true);
        }
        if (roles.includes('ROLE_STUDENT')) {
            setIsStudent(true);
        }
    };

    console.log(classId)

    useEffect(() => {
        fetchAttendances();
    }, [currentPage, teacherId, scheduleId, teacherId]);

    const fetchAttendances = async () => {
        let response = await fetchAttendancesWithPagination(currentPage, currentLimit, +timeTableId, +scheduleId, +teacherId, +classId);
        if (response && response.dt && response.ec === 0) {
            setTotalPages(response.dt.totalPages);
            setListAttendances(response.dt.content);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };


    const handleRefresh = async () => {
        window.location.reload()
    };

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneListAttendances = _.cloneDeep(listAttendances);
        cloneListAttendances = _.orderBy(cloneListAttendances, [sortField], [sortBy]);
        setListAttendances(cloneListAttendances);
    };

    const handleSearchStudentId = _.debounce((event) => {
        let term = event.target.value.trim();
        if (term) {
            let cloneListAttendances = _.cloneDeep(listAttendances);
            cloneListAttendances = cloneListAttendances.filter((item) =>
                item.student.id == (term)
            );
            setListAttendances(cloneListAttendances);
        } else {
            fetchAttendances();
        }
    }, 300);

    const togglePresent = async (itemId) => {
        try {
            const statusResponse = await changeStatus(itemId);
            if (statusResponse && statusResponse.ec === 0) {
                fetchAttendances();
                toast.success(statusResponse.em);
            }

        } catch (error) {

        }
    };

    const [presentCount, setPresentCount] = useState(0);
    const checkPresentCount = (attendances) => {
        if (!attendances) return 0;
        return attendances.filter(item => item.present).length;
    };

    useEffect(() => {
        setPresentCount(checkPresentCount(listAttendances));
    }, [listAttendances]);

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
                                            placeholder="Tìm theo mã học sinh...."
                                            onChange={(event) => handleSearchStudentId(event)}
                                        />
                                        <SearchOutlinedIcon />
                                    </div>

                                </div>

                            </div>

                            <div className="manage-students-container">
                                <div className="student-header row">
                                    <div className="title mt-3">
                                        <h3>Điểm danh học sinh lớp: {className} </h3>
                                        <h5> MÔN: {subjectName}</h5>
                                        <h5>{lessonName}: ({startTime}-{endTime})</h5>
                                    </div>
                                    <div className="actions my-3">
                                        <div className="header-left col-6">
                                            <button
                                                className="btn btn-success refresh"
                                                onClick={handleRefresh}
                                            >
                                                <i className="fa fa-refresh"></i>Làm mới
                                            </button>

                                        </div>
                                        <div className="header-right col-6">
                                            <h4>
                                                {classSize}
                                                <FontAwesomeIcon icon={faPeopleRoof} title="Tổng"
                                                    className="mx-3"
                                                />
                                            </h4>
                                            <h5>
                                                <label className="text-primary">{presentCount}
                                                    <FontAwesomeIcon icon={faUser} title="Có"
                                                        className="mx-3"
                                                    />
                                                </label>
                                                <label className="text-danger">{classSize - presentCount < 0 ? 0 : classSize - presentCount}

                                                    <FontAwesomeIcon icon={faUserXmark} title="Vắng"
                                                        className="mx-3"
                                                    />
                                                </label>
                                            </h5>

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
                                                <th>
                                                    <div className="sort-header">
                                                        <span>Mã học sinh</span>
                                                    </div>
                                                </th>
                                                <th scope="col">Họ</th>
                                                <th>
                                                    <div className="sort-header">
                                                        <span>Tên</span>
                                                        <span>
                                                            <i
                                                                className="fa-solid fa-arrow-down-long"
                                                                onClick={() => handleSort("desc", "student.lastName")}
                                                            ></i>
                                                            <i
                                                                className="fa-solid fa-arrow-up-long"
                                                                onClick={() => handleSort("asc", "student.lastName")}
                                                            ></i>
                                                        </span>
                                                    </div>
                                                </th>
                                                <th scope="col">Ngày sinh</th>
                                                <th scope="col">Tiết học</th>
                                                <th scope="col">Ngày học</th>
                                                <th scope="col">Giáo viên giảng dạy</th>
                                                <th scope="col">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listAttendances && listAttendances.length > 0 ? (
                                                <>
                                                    {listAttendances.map((item, index) => {
                                                        console.log(item.present)
                                                        return (
                                                            <tr key={`row-${index}`} >

                                                                <td>{currentPage * currentLimit + index + 1}</td>
                                                                <td>{item.id}</td>
                                                                <td>{item.student.id}</td>
                                                                <td>{item.student.firstName}</td>
                                                                <td>{item.student.lastName}</td>
                                                                <td>{item.student.dateOfBirth}</td>
                                                                <td>{item.schedule.name}</td>
                                                                <td>{item.timeTable.studyDate}</td>
                                                                <td>{item.teacher.firstName} {item.teacher.lastName}</td>
                                                                {
                                                                    isTeacher ?
                                                                        <>
                                                                            <td className="text-center">
                                                                                {item.present ? (
                                                                                    < FontAwesomeIcon icon={faToggleOn} className="toggle-icon on fs-3 text-primary"
                                                                                        role="button"
                                                                                        title="Có mặt"
                                                                                        onClick={() => togglePresent(item.id)}
                                                                                    />
                                                                                ) : (
                                                                                    <FontAwesomeIcon icon={faToggleOff} className="toggle-icon off fs-3 text-danger"
                                                                                        role="button"
                                                                                        title="Vắng"
                                                                                        onClick={() => togglePresent(item.id)}
                                                                                    />
                                                                                )}
                                                                            </td>
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <td className="text-center">
                                                                                {item.present ? (
                                                                                    < FontAwesomeIcon icon={faToggleOn} className="toggle-icon on fs-3 text-primary"
                                                                                        title="Có mặt"
                                                                                    />
                                                                                ) : (
                                                                                    <FontAwesomeIcon icon={faToggleOff} className="toggle-icon off fs-3 text-danger"
                                                                                        title="Vắng"
                                                                                    />
                                                                                )}
                                                                            </td>
                                                                        </>
                                                                }
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
        </>
    );
};

export default Attendances;
