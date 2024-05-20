import React, { useEffect, useState } from "react";
import "./modalListSchoolClasses.scss";
import { fetchAllSchoolClassWithPagination, deleteSchoolClass, getAllSchoolClassForHeadTeacherWithPagination, getAllWithYearIdAndGradeForStudent, getAllSchoolClassWithYearId } from '../../../services/schoolClassService'
import { getAllWithYearIdAndGradeForHeadTeacher, getAllByYearAndGrade, getASchoolClass } from "../../../services/schoolClassService";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalSchoolClass from './ModalSchoolClass';
import ModalDelete from "../../../components/modalDelete/ModalDelete";
import Select from 'react-select';
import _ from "lodash";
import Navbar from "../../../components/navbar/Navbar";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { getAllGrade } from "../../../services/schoolClassService";
import { getAllYearWithSchoolId } from "../../../services/yearService";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const ModalListSchoolClasses = (props) => {
    const [listSchoolClasses, setListSchoolClasses] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(30);
    const [totalPages, setTotalPages] = useState(0);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModel] = useState({});
    const [isShowModalSchoolClass, setIsShowModalSchoolClass] = useState(false);
    const [actionModalSchoolClass, setActionModalSchoolClass] = useState("CREATE");
    const [dataModalSchoolClass, setDataModalSchoolClass] = useState({});
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");

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

    useEffect(() => {
        if (props.location.state) {
            const { schoolClassId, className, yearName, selectedGrade, selectedGradeLabel, selectedYear } = props.location.state;
            setSelectedYear(selectedYear);
            setSelectedYearLabel(yearName);
            setSelectedGrade(selectedGrade);
            setSelectedGradeLabel(selectedGradeLabel);
            setSelectedClass(schoolClassId);
            setSelectedClassLabel(className);

            console.log(selectedClass, selectedYear, selectedGrade)

            const fetchSchoolClasses = async () => {
                try {
                    const response = await getASchoolClass(schoolClassId);
                    console.log(response)
                    if (response && response.dt && response.ec === 0) {
                        setListSchoolClasses([response.dt]);
                    }
                } catch (error) {
                    console.error('Error sending request:', error);
                }
            };
            fetchSchoolClasses();

        }
    }, [props.location.state]);


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



    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };

    const handleDeleteSchoolClass = async (schoolClass) => {
        setDataModel(schoolClass);
        setIsShowModalDelete(true);
    };

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModel({});
    };

    const onHideModalSchoolClass = async () => {
        setIsShowModalSchoolClass(false);
        setDataModalSchoolClass({});
        handleStateChange();
        await fetchSchoolClasses();
    };

    const confirmDeleteSchoolClass = async () => {
        let response = await deleteSchoolClass(dataModal);
        if (response && response.ec === 0) {
            toast.success(response.em);
            await fetchSchoolClasses();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.em);
        }
    };

    const handleEditSchoolClass = (schoolClass) => {
        setActionModalSchoolClass("UPDATE");
        setDataModalSchoolClass(schoolClass);
        setIsShowModalSchoolClass(true);
    };

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneListSchoolClasses = _.cloneDeep(listSchoolClasses);
        cloneListSchoolClasses = _.orderBy(cloneListSchoolClasses, [sortField], [sortBy]);
        setListSchoolClasses(cloneListSchoolClasses);
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
        handleStateChange();
        setSelectedYear(selectedOption.value);
        setSelectedYearLabel(selectedOption.label);
        setSelectedGradeLabel('Chọn khối học');
        setGrades([]);
        setSelectedGrade('');
        setListSchoolClasses([]);
    };
    const handleGradeChange = (selectedOption) => {
        handleStateChange();
        setSelectedGrade(selectedOption.label);
        setSelectedGradeLabel(selectedOption.label);
        setSelectedClassLabel('Chọn lớp học');
        setSelectedClass('');
        setListSchoolClasses([]);
    };
    const handleClassChange = (selectedOption) => {
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
            fetchClassData();
        }
    }, [selectedGrade]);

    const fetchSchoolClasses = async () => {
        try {
            if (selectedGradeLabel == 'Toàn Khối' && !isHeadTeacher && !isStudent) {
                const response = await getAllSchoolClassWithYearId(selectedYear);
                console.log(selectedYear)
                if (response && response.dt && response.ec === 0) {
                    setListSchoolClasses(response.dt);
                }
            }
            else if (selectedClass) {
                const response = await getASchoolClass(selectedClass);
                console.log(response)
                if (response && response.dt && response.ec === 0) {
                    setListSchoolClasses([response.dt]);
                }
            }
            else {
                if (!isHeadTeacher && !isStudent) {
                    const response = await getAllByYearAndGrade(selectedYear, selectedGrade);
                    console.log(response)
                    if (response && response.dt && response.ec === 0) {
                        setListSchoolClasses(response.dt);
                    }
                }

            }

        } catch (error) {
            console.error('Error sending request:', error);
        }
    };
    const handleSendClick = () => {
        fetchSchoolClasses();
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
                                    {
                                        isStudent ?
                                            <><h3 className="text-center">Danh sách lớp học</h3></>
                                            :
                                            <><h3 className="text-center">Quản lý lớp học</h3></>
                                    }

                                </div>
                                <div className="actions my-3">
                                    <div className="header-left col-4">
                                        <button
                                            className="btn btn-success refresh"
                                            onClick={handleRefresh}
                                        >
                                            <i className="fa fa-refresh"></i>Làm mới
                                        </button>
                                        {
                                            isHeadTeacher || isStudent ?
                                                <></>
                                                :
                                                <>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => {
                                                            setIsShowModalSchoolClass(true);
                                                            setActionModalSchoolClass("CREATE");
                                                        }}
                                                    >
                                                        <i className="fa fa-plus-circle"></i>Thêm mới
                                                    </button>
                                                </>
                                        }

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
                                                {(selectedYear && selectedGrade) && (
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
                                            <th scope="col">Năm học</th>
                                            <th scope="col">Tên giáo viên chủ nhiệm</th>
                                            <th scope="col">Danh sách học sinh</th>
                                            {
                                                isHeadTeacher || isStudent ?
                                                    <></>
                                                    :
                                                    <>
                                                        <th scope="col">Hành động</th>
                                                    </>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listSchoolClasses && listSchoolClasses.length > 0 ? (
                                            <>
                                                {listSchoolClasses.map((item, index) => {
                                                    return (
                                                        <tr key={`row-${index}`}>
                                                            <td>{currentPage * currentLimit + index + 1}</td>
                                                            <td>{item.id}</td>
                                                            <td>{item.name}</td>
                                                            <td>{item.grade}</td>
                                                            <td>
                                                                {item.schoolYear && (
                                                                    <>
                                                                        {item.schoolYear.name}
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>{item.teacher?.firstName} {item.teacher?.lastName}</td>
                                                            <td>
                                                                <Link
                                                                    to={{
                                                                        pathname: '/list-students-in-class',
                                                                        state: {
                                                                            schoolClassId: +item.id,
                                                                            className: item.name,
                                                                            yearName: item.schoolYear?.name,
                                                                            isHeadTeacher: isHeadTeacher,
                                                                            selectedGrade: item.grade,
                                                                            selectedGradeLabel: selectedGradeLabel,
                                                                            selectedYear: selectedYear,
                                                                            isStudent: isStudent
                                                                        }
                                                                    }}
                                                                    title="Xem"
                                                                    className="view"
                                                                >
                                                                    <i className="fa fa-eye"></i>
                                                                </Link>
                                                            </td>
                                                            {
                                                                isStudent || isHeadTeacher ?
                                                                    <></>
                                                                    :
                                                                    <>
                                                                        <td>
                                                                            <span
                                                                                title="Sửa"
                                                                                className="edit"
                                                                                onClick={() => {
                                                                                    handleEditSchoolClass(item);
                                                                                }}
                                                                            >
                                                                                <i className="fa fa-pencil"></i>
                                                                            </span>
                                                                            <span
                                                                                title="Xóa"
                                                                                className="delete"
                                                                                onClick={() => {
                                                                                    handleDeleteSchoolClass(item);
                                                                                }}
                                                                            >
                                                                                <i className="fa fa-trash-can"></i>
                                                                            </span>
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
                                                    <td>Not found SchoolClass</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 0 && (
                                <div className="schoolClass-footer">
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
                confirmDelete={confirmDeleteSchoolClass}
                dataModal={dataModal}
                title={"Lớp học"}
            />
            <ModalSchoolClass
                show={isShowModalSchoolClass}
                onHide={onHideModalSchoolClass}
                action={actionModalSchoolClass}
                dataModalSchoolClass={dataModalSchoolClass}
                schoolId={schoolId}
            />
        </>
    );
};

export default ModalListSchoolClasses;
