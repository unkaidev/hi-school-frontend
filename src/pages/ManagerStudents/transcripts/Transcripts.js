import React, { useEffect, useState } from "react";
import "./transcripts.scss";
import { fetchAllTranscriptFromTermAndClass, fetchAllTranscriptFromTermAndClassForStudent, deleteTranscript, deleteManyTimeDate } from '../../../services/transcriptService'
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalTranscript from "./ModalTranscript";
import _, { forEach, set } from "lodash";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { getAllYearWithSchoolId } from "../../../services/yearService";
import { getAllSemesterWithYearId } from "../../../services/semesterService";
import { getAllSchoolClassWithYearId, getAllSchoolClassWithSemesterIdForHeadTeacher, getAllSchoolClassWithSemesterIdForTeacher, getAllSchoolClassWithSemesterIdForStudent } from "../../../services/schoolClassService";
import { fetchATeacherWithClassId } from "../../../services/teacherServices";
import Select from 'react-select';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";




const Transcripts = (props) => {
    const [listTranscripts, setTranscripts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(30);
    const [totalPages, setTotalPages] = useState(0);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModel] = useState({});
    const [isShowModalTranscript, setIsShowModalTranscript] = useState(false);
    const [actionModalTranscript, setActionModalTranscript] = useState("CREATE");
    const [dataModalTranscript, setDataModalTranscript] = useState({});
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");
    const [selectedTerm, setSelectedTerm] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const [selectedTeacher, setSelectedTeacher] = useState({});


    const [years, setYears] = useState([]);
    const [selectedYearLabel, setSelectedYearLabel] = useState('Chọn năm học');

    const [terms, setTerms] = useState([]);
    const [selectedTermLabel, setSelectedTermLabel] = useState('Chọn kỳ học');

    const [classes, setClasses] = useState([]);
    const [selectedClassLabel, setSelectedClassLabel] = useState('Chọn lớp học');

    const [isHeadTeacher, setIsHeadTeacher] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);
    const [isStudent, setIsStudent] = useState(false);




    const user = useSelector(state => state.user);
    const schoolId = user?.dataRedux?.account?.schoolId || [];
    const username = user?.dataRedux?.account?.username || [];
    const roles = user?.dataRedux?.account?.roles || [];


    useEffect(() => {
        if (user) {
            checkUserRole();
        }
    }, [user]);

    const checkUserRole = () => {
        console.log(username)
        console.log(roles)
        if (username && roles && roles.includes('ROLE_HEADTEACHER')) {
            setIsHeadTeacher(true);
            // fetchTranscripts();
        }
        else if (username && roles && roles.includes('ROLE_TEACHER') && !roles.includes('ROLE_TEACHER')) {
            setIsTeacher(true);
            // fetchTranscripts();
        }
        else if (username && roles && roles.includes('ROLE_USER')) {
            setIsStudent(true);
            // fetchTranscripts();
        }
    };


    const history = useHistory();

    useEffect(() => {
        if (props.location.state) {
            const { selectedYearBack, selectedTermBack, selectedClassBack, yearNameBack, termNameBack, classNameBack, selectedTeacherBack, isStudent } = props.location.state;
            setSelectedYear(selectedYearBack);
            setSelectedYearLabel(yearNameBack);
            setSelectedTerm(selectedTermBack);
            setSelectedTermLabel(termNameBack);
            setSelectedClass(selectedClassBack);
            setSelectedClassLabel(classNameBack);
            setSelectedTeacher(selectedTeacherBack)

            console.log(selectedClass, selectedYear, selectedTerm)

            const fetchTranscripts = async () => {
                try {
                    let response;
                    if (isStudent) {
                        response = await fetchAllTranscriptFromTermAndClassForStudent(currentPage, currentLimit, selectedTermBack, username);
                    } else {
                        response = await fetchAllTranscriptFromTermAndClass(currentPage, currentLimit, selectedTermBack, selectedClassBack);

                    }
                    if (response && response.dt && response.ec === 0) {
                        setTotalPages(response.dt.totalPages);
                        setTranscripts(response.dt.content);
                    }
                } catch (error) {
                    console.error('Error sending request:', error);
                    toast.error('Failed to send request');
                }
            };
            fetchTranscripts();

        }
    }, [props.location.state]);


    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModel({});
    };

    const onHideModalTranscript = async () => {
        setIsShowModalTranscript(false);
        setDataModalTranscript({});
        await fetchTranscripts();
    };

    const handleEditTranscript = (transcript) => {
        setActionModalTranscript("UPDATE");
        setDataModalTranscript(transcript);
        setIsShowModalTranscript(true);
    };

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneTranscripts = _.cloneDeep(listTranscripts);
        cloneTranscripts = _.orderBy(cloneTranscripts, [sortField], [sortBy]);
        setTranscripts(cloneTranscripts);
    };
    const handleLastNameSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneTranscripts = _.cloneDeep(listTranscripts);
        cloneTranscripts = _.orderBy(cloneTranscripts, [item => item.student && item.student.lastName], [sortBy]);
        setTranscripts(cloneTranscripts);
    };


    const handleSearch = _.debounce((event) => {
        let term = event.target.value.toLowerCase();
        if (term) {
            let cloneTranscripts = _.cloneDeep(listTranscripts);
            cloneTranscripts = cloneTranscripts.filter((item) =>
                item.student.lastName.toLowerCase().includes(term)
            );
            setTranscripts(cloneTranscripts);
        } else {
            fetchTranscripts();
        }
    }, 300);


    const fetchYearData = async () => {
        try {
            const yearResponse = await getAllYearWithSchoolId(schoolId);
            if (yearResponse && yearResponse.dt) {
                setYears(yearResponse.dt.map(year => ({ id: year.id, name: year.name })));
            }
        } catch (error) {
            console.error('Error fetching year data:', error);
            toast.error('Failed to fetch year data');
        }
    };

    const fetchTermData = async () => {
        try {
            const termResponse = await getAllSemesterWithYearId(selectedYear);
            if (termResponse && termResponse.dt) {
                setTerms(termResponse.dt.map(term => ({ id: term.id, name: term.name })));
            }
        } catch (error) {
            console.error('Error fetching term data:', error);
            toast.error('Failed to fetch term data');
        }
    };


    const fetchTeacherData = async () => {
        try {
            const teacherResponse = await fetchATeacherWithClassId(selectedClass);
            console.log(teacherResponse.dt)
            if (teacherResponse && teacherResponse.dt) {
                const teacher = teacherResponse.dt;
                setSelectedTeacher({
                    id: teacher.id,
                    firstName: teacher.firstName,
                    lastName: teacher.lastName
                });
            }
        } catch (error) {
            console.error('Error fetching teacher data:', error);
            toast.error('Failed to fetch teacher data');
        }
    };

    const handleStateChange = (selectedOption) => {
        history.replace({
            pathname: props.location.pathname,
            state: null
        });
    };

    const handleRefresh = () => {
        handleStateChange();
        window.location.reload();
    };

    useEffect(() => {
        fetchYearData();
        checkUserRole();
    }, []);

    const handleYearChange = (selectedOption) => {
        handleStateChange();
        setSelectedYear(selectedOption.value);
        setSelectedYearLabel(selectedOption.label);
        setSelectedTermLabel('Chọn kỳ học');
        setTerms([]);
        setSelectedTerm('');
        setSelectedClassLabel('Chọn lớp học');
        setClasses([]);
        setSelectedClass('');
        setTranscripts([]);
    };
    useEffect(() => {
        if (selectedYear) {
            fetchTermData();
        }
    }, [selectedYear]);


    const handleTermChange = (selectedOption) => {
        handleStateChange();
        setSelectedTerm(selectedOption.value);
        setSelectedTermLabel(selectedOption.label);
        setSelectedClassLabel('Chọn lớp học');
        setSelectedClass('');
        setTranscripts([]);
    };
    console.log(selectedTerm)
    useEffect(() => {
        if (selectedTerm) {
            fetchClassData();
        }
    }, [selectedTerm]);

    const handleClassChange = (selectedOption) => {
        handleStateChange();
        setSelectedClass(selectedOption.value);
        setSelectedClassLabel(selectedOption.label);
    };
    const fetchClassData = async () => {
        try {
            console.log(username, selectedClass, selectedTerm, selectedYear)
            let classResponse;
            if (isStudent) {
                classResponse = await getAllSchoolClassWithSemesterIdForStudent(username, selectedTerm);
            }
            else if (!isHeadTeacher && isTeacher) {
                classResponse = await getAllSchoolClassWithSemesterIdForTeacher(username, selectedTerm);
            }
            else if (isHeadTeacher) {
                classResponse = await getAllSchoolClassWithSemesterIdForHeadTeacher(username, selectedTerm);
            }

            else {
                classResponse = await getAllSchoolClassWithYearId(selectedYear);
            }
            if (classResponse && classResponse.dt) {
                console.log(classResponse)
                setClasses(classResponse.dt.map(cls => ({
                    id: cls.id, name: cls.name
                })));
            }
        } catch (error) {
            console.error('Error fetching class data:', error);
        }
    };




    const fetchTranscripts = async () => {
        try {
            let response
            if (isStudent) {
                response = await fetchAllTranscriptFromTermAndClassForStudent(currentPage, currentLimit, selectedTerm, username);

            } else {
                response = await fetchAllTranscriptFromTermAndClass(currentPage, currentLimit, selectedTerm, selectedClass);
            }
            if (response && response.dt && response.ec === 0) {
                setTotalPages(response.dt.totalPages);
                setTranscripts(response.dt.content);
            }
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };


    const handleSendClick = () => {
        fetchTranscripts();
        fetchTeacherData();
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
                        <div className="manage-transcripts-container">
                            <div className="transcript-header row">
                                <div className="title mt-3">
                                    <h3>Danh sách học bạ</h3>
                                </div>
                                <div className="actions my-3">
                                    <div className="header-left col-4">
                                        <button
                                            className="btn btn-success refresh"
                                            onClick={handleRefresh}
                                        >
                                            <i className="fa fa-refresh"></i>Làm mới
                                        </button>

                                    </div>

                                    <div className="header-right col-8 ">
                                        <div className="row">
                                            <div className="col">
                                                <Select
                                                    value={{ value: selectedYear, label: selectedYearLabel }}
                                                    onChange={handleYearChange}
                                                    options={[{ value: '', label: 'Chọn năm học' }, ...years.map(year => ({ value: year.id, label: year.name }))]}
                                                    placeholder="Chọn năm học"
                                                />
                                            </div>
                                            <div className="col">
                                                <Select
                                                    value={{ value: selectedTerm, label: selectedTermLabel }}
                                                    onChange={handleTermChange}
                                                    options={[{ value: '', label: 'Chọn kỳ học' }, ...terms.map(term => ({ value: term.id, label: term.name }))]}
                                                    placeholder="Chọn kỳ học"
                                                />
                                            </div>
                                            <div className="col">
                                                <Select
                                                    value={{ value: selectedClass, label: selectedClassLabel }}
                                                    onChange={handleClassChange}
                                                    options={[{ value: '', label: 'Chọn lớp học' }, ...classes.map(cls => ({ value: cls.id, label: cls.name }))]}
                                                    placeholder="Chọn lớp học"
                                                />
                                            </div>
                                            <div className="col-1">
                                                {(selectedYear && selectedTerm && selectedClass) && (
                                                    <button
                                                        className="btn btn-primary refresh"

                                                        onClick={handleSendClick}>
                                                        <i className="fa fa-download"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="transcript-body">
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
                                                            onClick={() => handleLastNameSort("desc", "lastName")}
                                                        ></i>
                                                        <i
                                                            className="fa-solid fa-arrow-up-long"
                                                            onClick={() => handleLastNameSort("asc", "lastName")}
                                                        ></i>
                                                    </span>
                                                </div>
                                            </th>
                                            <th scope="col">Năm học</th>
                                            <th scope="col">Danh sách điểm</th>
                                            <th scope="col">Tên giáo viên chủ nhiệm</th>
                                            <th scope="col">Đánh giá năm học</th>
                                            {isHeadTeacher ?
                                                <>
                                                    <th scope="col">Hành động</th>
                                                </>
                                                :
                                                <></>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listTranscripts && listTranscripts.length > 0 ? (
                                            <>
                                                {listTranscripts.map((item, index) => {
                                                    return (
                                                        <tr key={`row-${index}`} >
                                                            <td>{currentPage * currentLimit + index + 1}</td>
                                                            <td>{item.id}</td>
                                                            <td>
                                                                {item.student && (
                                                                    <>
                                                                        {item.student.firstName}
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {item.student && (
                                                                    <>
                                                                        {item.student.lastName}
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {selectedYearLabel}
                                                            </td>
                                                            <td>
                                                                <Link
                                                                    to={{
                                                                        pathname: '/list-scores',
                                                                        state: {
                                                                            semesterId: +selectedTerm,
                                                                            studentId: +item.student.id,
                                                                            studentName: `${item.student.firstName}  ${item.student.lastName}`,
                                                                            className: selectedClassLabel,
                                                                            yearName: selectedYearLabel,
                                                                            termName: selectedTermLabel,
                                                                            selectedYear: selectedYear,
                                                                            selectedTerm: selectedTerm,
                                                                            selectedClass: selectedClass,
                                                                            selectedTeacher: selectedTeacher,
                                                                            isHeadTeacher: isHeadTeacher,
                                                                            isTeacher: isTeacher,
                                                                            isStudent: isStudent,
                                                                        }
                                                                    }}
                                                                    title="Xem"
                                                                    className="view"
                                                                >
                                                                    <i className="fa fa-eye"></i>
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                {selectedTeacher && (
                                                                    <>
                                                                        {selectedTeacher.firstName} {selectedTeacher.lastName}
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>{item.yearEvaluation ?
                                                                item.yearEvaluation
                                                                :
                                                                <span className="fw-light fst-italic">
                                                                    "Chưa có đánh giá"
                                                                </span>
                                                            }</td>
                                                            {
                                                                isHeadTeacher ?
                                                                    <>
                                                                        <td>

                                                                            <span span
                                                                                title="Sửa"
                                                                                className="edit"
                                                                                onClick={() => {
                                                                                    handleEditTranscript(item);
                                                                                }}
                                                                            >
                                                                                <i className="fa fa-pencil"></i>
                                                                            </span>
                                                                        </td>

                                                                    </>
                                                                    :
                                                                    <></>
                                                            }


                                                        </tr>
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            <>
                                                <tr>
                                                    <td>Not found Transcript</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 0 && (
                                <div className="transcript-footer">
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
            </div >

            <ModalTranscript
                show={isShowModalTranscript}
                onHide={onHideModalTranscript}
                action={actionModalTranscript}
                dataModalTranscript={dataModalTranscript}
                schoolId={schoolId}
                yearId={selectedYear}
                semesterId={selectedTerm}
                classId={selectedClass}
                selectedYearLabel={selectedYearLabel}
                selectedTermLabel={selectedTermLabel}
                selectedTeacher={selectedTeacher}
            />
        </>
    );
};

export default Transcripts;
