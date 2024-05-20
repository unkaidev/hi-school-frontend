import React, { useEffect, useState } from "react";
import "./statistic.scss";
import { countStudentsInClass, getAllWithYearIdAndGradeForStudent } from '../../services/schoolClassService'
import { getAllWithYearIdAndGradeForHeadTeacher, getAllByYearAndGrade, getASchoolClass } from "../../services/schoolClassService";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import Select from 'react-select';
import _ from "lodash";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { getAllGrade } from "../../services/schoolClassService";
import { getAllYearWithSchoolId } from "../../services/yearService";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Featured from '../../components/featured/Featured'
import { countAllStudentsInSchoolByYearAndGrade } from "../../services/schoolServices";
import { countAllEvaluationInClass } from "../../services/scoreService";

const Statistic = (props) => {
    const [listSchoolClasses, setListSchoolClasses] = useState([]);
    const [studentsByYearAndGrade, SetStudentByYearAndGrade] = useState(0);
    const [studentsInClass, SetStudentsInClass] = useState(0);
    const [excellent, setExcellent] = useState(0);
    const [good, setGood] = useState(0);
    const [average, setAverage] = useState(0);
    const [belowAverage, setBelowAverage] = useState(0);



    const [isHeadTeacher, setIsHeadTeacher] = useState(false);
    const [isStudent, setIsStudent] = useState(false);


    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedClass, setSelectedClass] = useState("");

    const [years, setYears] = useState([]);
    const [selectedYearLabel, setSelectedYearLabel] = useState('Chọn năm học');

    const [grades, setGrades] = useState([]);
    const [selectedGradeLabel, setSelectedGradeLabel] = useState('Chọn khối học');

    const [classes, setClasses] = useState([]);
    const [selectedClassLabel, setSelectedClassLabel] = useState('Chọn lớp học');

    const user = useSelector(state => state.user);
    const schoolId = user?.dataRedux?.account?.schoolId || [];
    const username = user?.dataRedux?.account?.username || [];
    const roles = user?.dataRedux?.account?.roles || [];

    const [isShow, setIsShow] = useState(false)


    const history = useHistory();


    useEffect(() => {
        if (user) {
            checkUserRole();
        }
    }, [user]);

    const checkUserRole = () => {
        console.log(username)
        console.log(roles)
        if (user && roles.includes('ROLE_HEADTEACHER')) {
            setIsHeadTeacher(true);
            fetchSchoolClasses();
        }
        else if (user && roles.includes('ROLE_USER')) {
            setIsStudent(true);
        }

    };

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

    const fetchGradeData = async () => {
        try {
            const gradeResponse = await getAllGrade();
            if (gradeResponse) {
                const gradesWithIdsAndNames = gradeResponse.map((grade, index) => ({
                    id: index + 1,
                    name: grade
                }));

                setGrades(gradesWithIdsAndNames);
            }
        } catch (error) {
            console.error('Error fetching term data:', error);
            toast.error('Failed to fetch term data');
        }
    };
    const fetchStudentByYearAndGrade = async () => {
        try {
            const stdResponse = await countAllStudentsInSchoolByYearAndGrade(schoolId, selectedYear, selectedGrade);
            console.log(stdResponse.dt)
            if (stdResponse) {
                SetStudentByYearAndGrade(stdResponse.dt);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const fetchClassData = async () => {
        try {
            let classResponse;
            if (isStudent) {
                classResponse = await getAllWithYearIdAndGradeForStudent(username, selectedYear, selectedGrade);
            }
            else if (isHeadTeacher) {
                classResponse = await getAllWithYearIdAndGradeForHeadTeacher(username, selectedYear, selectedGrade);
            }
            else {
                classResponse = await getAllByYearAndGrade(selectedYear, selectedGrade);
            }
            if (classResponse && classResponse.dt) {
                setClasses(classResponse.dt.map(cls => ({
                    id: cls.id, name: cls.name
                })));
            }
        } catch (error) {
            console.error('Error fetching class data:', error);
            toast.error('Failed to fetch class data');
        }
    };


    const handleSearch = _.debounce((event) => {
        let term = event.target.value.toLowerCase();
        if (term) {
            let cloneListSchoolClasses = _.cloneDeep(listSchoolClasses);
            cloneListSchoolClasses = cloneListSchoolClasses.filter((item) =>
                item.name.toLowerCase().includes(term)
            );
            setListSchoolClasses(cloneListSchoolClasses);
        } else {
            fetchSchoolClasses();
        }
    }, 300);

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

    const handleYearChange = (selectedOption) => {
        setIsShow(false)
        handleStateChange();
        setSelectedYear(selectedOption.value);
        setSelectedYearLabel(selectedOption.label);
        setSelectedGradeLabel('Chọn khối học');
        setGrades([]);
        setSelectedGrade('');
        setListSchoolClasses([]);
    };
    const handleGradeChange = (selectedOption) => {
        setIsShow(false)
        handleStateChange();
        setSelectedGrade(selectedOption.label);
        setSelectedGradeLabel(selectedOption.label);
        setSelectedClassLabel('Chọn lớp học');
        setSelectedClass('');
        setListSchoolClasses([]);
    };
    const handleClassChange = (selectedOption) => {
        setIsShow(false)
        handleStateChange();
        setSelectedClass(selectedOption.value);
        setSelectedClassLabel(selectedOption.label);
    };


    useEffect(() => {
        fetchYearData();
    }, []);

    useEffect(() => {
        if (selectedYear) {
            fetchGradeData();
        }
    }, [selectedYear]);
    useEffect(() => {
        if (selectedGrade) {
            fetchStudentByYearAndGrade();
            fetchClassData();
        }
    }, [selectedGrade]);

    const fetchSchoolClasses = async () => {
        try {
            const response = await countStudentsInClass(selectedClass);

            const evaluationRes = await countAllEvaluationInClass(selectedYear, selectedClass);

            console.log(response)
            if (response && response.dt && response.ec === 0) {
                SetStudentsInClass(response.dt);
            }
            if (evaluationRes && evaluationRes.dt && evaluationRes.ec === 0) {
                const { excellent, good, average, below_average } = evaluationRes.dt;
                setExcellent(excellent);
                setGood(good);
                setAverage(average);
                setBelowAverage(below_average);
            }
        } catch (error) {
            console.error('Error sending request:', error);
        }
    };


    const handleSendClick = () => {
        fetchSchoolClasses();
        setIsShow(true)
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

                        <div className="manage-schoolClasses-container">
                            <div className="schoolClass-header row">
                                <div className="title mt-3">
                                    <><h3 className="text-center">Thống kê</h3></>
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

                                    <div className="header-right col-8">
                                        <div className="row">
                                            <div className="col">
                                                <Select
                                                    value={{ value: selectedYear, label: selectedYearLabel }}
                                                    onChange={handleYearChange}
                                                    options={[{ value: '', label: 'Chọn năm học' }, ...years.map(year => ({ value: year.id, label: year.name }))]}
                                                    placeholder="Chọn năm học"
                                                />
                                            </div>
                                            {
                                                selectedYear ?
                                                    <> <div className="col">
                                                        <Select
                                                            value={{ value: selectedGrade, label: selectedGradeLabel }}
                                                            onChange={handleGradeChange}
                                                            options={[{ value: '', label: 'Chọn khối học' }, ...grades.map(grade => ({ value: grade.id, label: grade.name }))]}
                                                            placeholder="Chọn khối học"
                                                        />
                                                    </div></>
                                                    :
                                                    <><div className="col"></div></>
                                            }
                                            {
                                                selectedGrade ?
                                                    <> <div className="col">
                                                        <Select
                                                            value={{ value: selectedClass, label: selectedClassLabel }}
                                                            onChange={handleClassChange}
                                                            options={[{ value: '', label: 'Chọn lớp học' }, ...classes.map(cls => ({ value: cls.id, label: cls.name }))]}
                                                            placeholder="Chọn lớp học"
                                                        />
                                                    </div></>
                                                    :
                                                    <><div className="col"></div></>
                                            }


                                            <div className="col-1">
                                                {(selectedYear && selectedGrade && selectedClass) && (
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
                            <div className="schoolClass-body">
                                <div className="table">
                                    <tbody className="row">
                                        {
                                            isShow ?
                                                <>
                                                    <Featured
                                                        title={`Số học sinh ${selectedClassLabel}`}
                                                        desc={selectedGradeLabel}
                                                        value={studentsInClass}
                                                        amount={studentsByYearAndGrade}
                                                    />
                                                    <Featured
                                                        title={"Học sinh giỏi"}
                                                        desc={selectedClassLabel}
                                                        value={excellent}
                                                        amount={studentsInClass}
                                                    />
                                                    <Featured
                                                        title={"Học sinh khá"}
                                                        desc={selectedClassLabel}
                                                        value={good}
                                                        amount={studentsInClass}
                                                    />
                                                    <Featured
                                                        title={"Học sinh trung bình"}
                                                        desc={selectedClassLabel}
                                                        value={average}
                                                        amount={studentsInClass}
                                                    />
                                                    <Featured
                                                        title={"Học sinh yếu"}
                                                        desc={selectedClassLabel}
                                                        value={belowAverage}
                                                        amount={studentsInClass}
                                                    />
                                                </>
                                                :
                                                <></>
                                        }

                                    </tbody>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Statistic;
