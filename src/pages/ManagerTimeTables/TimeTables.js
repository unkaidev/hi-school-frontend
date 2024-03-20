import React, { useEffect, useState } from "react";
import "./timeTables.scss";
import { fetchAllTimeTableFromTermAndClass, deleteTimeTable, deleteManyTimeDate } from '../../services/timeTableService'
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalTimeTable from "./ModalTimeTable";
import ModalDelete from '../ManagerTimeTables/ModalDelete'
import _, { set } from "lodash";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";
import { getAllYearWithSchoolId } from "../../services/yearService";
import { getAllSemesterWithYearId } from "../../services/semesterService";
import { getAllSchoolClassWithYearId } from "../../services/schoolClassService";
import Select from 'react-select';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";


const ModalTimeTables = (props) => {
    const [listTimeTables, setTimeTables] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(30);
    const [totalPages, setTotalPages] = useState(0);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModel] = useState({});
    const [isShowModalTimeTable, setIsShowModalTimeTable] = useState(false);
    const [actionModalTimeTable, setActionModalTimeTable] = useState("CREATE");
    const [dataModalTimeTable, setDataModalTimeTable] = useState({});
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");
    const [selectedTerm, setSelectedTerm] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedYear, setSelectedYear] = useState('');

    const [years, setYears] = useState([]);
    const [selectedYearLabel, setSelectedYearLabel] = useState('Chọn năm học');

    const [terms, setTerms] = useState([]);
    const [selectedTermLabel, setSelectedTermLabel] = useState('Chọn kỳ học');

    const [classes, setClasses] = useState([]);
    const [selectedClassLabel, setSelectedClassLabel] = useState('Chọn lớp học');


    const user = useSelector(state => state.user);
    const schoolId = user?.dataRedux?.account?.schoolId || [];


    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };

    const handleDeleteTimeTable = async (timeTable) => {
        setDataModel(timeTable);
        setIsShowModalDelete(true);
    };

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModel({});
    };

    const onHideModalTimeTable = async () => {
        setIsShowModalTimeTable(false);
        setDataModalTimeTable({});
        await fetchTimeTables();
    };

    const confirmDeleteTimeTable = async () => {
        let response = await deleteTimeTable(dataModal);
        if (response && response.ec === 0) {
            toast.success(response.em);
            await fetchTimeTables();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.em);
        }
    };

    const handleEditTimeTable = (timeTable) => {
        setActionModalTimeTable("UPDATE");
        setDataModalTimeTable(timeTable);
        setIsShowModalTimeTable(true);
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneTimeTables = _.cloneDeep(listTimeTables);
        cloneTimeTables = _.orderBy(cloneTimeTables, [sortField], [sortBy]);
        setTimeTables(cloneTimeTables);
    };
    const handleSubjectSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneTimeTables = _.cloneDeep(listTimeTables);
        cloneTimeTables = _.orderBy(cloneTimeTables, [item => item.subject && item.subject.name], [sortBy]);
        setTimeTables(cloneTimeTables);
    };


    const handleSearch = _.debounce((event) => {
        let term = event.target.value.toLowerCase();
        if (term) {
            let cloneTimeTables = _.cloneDeep(listTimeTables);
            cloneTimeTables = cloneTimeTables.filter((item) =>
                item.subject.name.toLowerCase().includes(term)
            );
            setTimeTables(cloneTimeTables);
        } else {
            fetchTimeTables();
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

    const fetchClassData = async () => {
        try {
            const classResponse = await getAllSchoolClassWithYearId(selectedYear);
            if (classResponse && classResponse.dt) {
                setClasses(classResponse.dt.map(cls => ({ id: cls.id, name: cls.name })));
            }
        } catch (error) {
            console.error('Error fetching class data:', error);
            toast.error('Failed to fetch class data');
        }
    };

    const handleYearChange = (selectedOption) => {
        setSelectedYear(selectedOption.value);
        setSelectedYearLabel(selectedOption.label);
        setSelectedTermLabel('Chọn kỳ học');
        setTerms([]);
        setSelectedTerm('');
        setSelectedClassLabel('Chọn lớp học');
        setClasses([]);
        setSelectedClass('');
        setTimeTables([]);
    };

    const handleTermChange = (selectedOption) => {
        setSelectedTerm(selectedOption.value);
        setSelectedTermLabel(selectedOption.label);
        setSelectedClassLabel('Chọn lớp học');
        setSelectedClass('');
        setTimeTables([]);
    };

    const handleClassChange = (selectedOption) => {
        setSelectedClass(selectedOption.value);
        setSelectedClassLabel(selectedOption.label);

    };


    useEffect(() => {
        fetchYearData();
    }, []);

    useEffect(() => {
        if (selectedYear) {
            fetchTermData();
        }
    }, [selectedYear]);

    useEffect(() => {
        if (selectedTerm) {
            fetchClassData();
        }
    }, [selectedTerm]);

    const fetchTimeTables = async () => {
        try {
            const response = await fetchAllTimeTableFromTermAndClass(currentPage, currentLimit, selectedTerm, selectedClass);
            if (response && response.dt && response.ec === 0) {
                setTotalPages(response.dt.totalPages);
                setTimeTables(response.dt.content);
            }
        } catch (error) {
            console.error('Error sending request:', error);
            toast.error('Failed to send request');
        }
    };


    const handleSendClick = () => {
        fetchTimeTables();
    };

    const isSelected = (timeTableId) => {
        return selectedTimeTables.includes(timeTableId);
    };
    const [selectedTimeTables, setSelectedTimeTables] = useState([]);

    const handleCheckboxChange = (timeTableId) => {
        const isTimeTableSelected = selectedTimeTables.includes(timeTableId);
        if (isTimeTableSelected) {
            setSelectedTimeTables(selectedTimeTables.filter(id => id !== timeTableId));
        } else {
            setSelectedTimeTables([...selectedTimeTables, timeTableId]);
        }
    };
    const handleToggleSelectAll = () => {
        if (selectedTimeTables.length === 0) {
            const allTimeTableIds = listTimeTables.map(timeTable => timeTable.id);
            setSelectedTimeTables(allTimeTableIds);
        } else {
            setSelectedTimeTables([]);
        }
    };
    const handleRemoveManyTimeTables = (timeTables) => {
        setDataModel(timeTables);
        setIsShowModalDelete(true);
    };
    const confirmDeleteManyTimeTables = async () => {
        try {
            const selectedTimeTableIds = listTimeTables.filter(timeTable => isSelected(timeTable.id)).map(timeTable => timeTable.id);

            const response = await deleteManyTimeDate(selectedTimeTableIds);
            if (response && response.ec === 0) {
                toast.success(response.em);
                setSelectedTimeTables([]);
                setIsShowModalDelete(false);
                await fetchTimeTables();

            } else {
                toast.error(response.em);
            }

        } catch (error) {
            console.error('Lỗi khi xóa nhiều bản ghi:', error);
        }
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

                        <div className="manage-timeTables-container">
                            <div className="timeTable-header row">
                                <div className="title mt-3">
                                    <h3>Thời khóa biểu</h3>
                                </div>
                                <div className="actions my-3">
                                    <div className="header-left col-4">
                                        <button
                                            className="btn btn-success refresh"
                                            onClick={handleRefresh}
                                        >
                                            <i className="fa fa-refresh"></i>Làm mới
                                        </button>
                                        {(selectedYear && selectedTerm && selectedClass) && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    setIsShowModalTimeTable(true);
                                                    setActionModalTimeTable("CREATE");
                                                    handleSendClick();
                                                }}
                                            >
                                                <i className="fa fa-plus-circle"></i>Thêm mới
                                            </button>
                                        )}
                                        {selectedTimeTables.length >= 2 && (
                                            <button
                                                className="btn btn-danger refresh"
                                                onClick={() => handleRemoveManyTimeTables(selectedTimeTables)}>
                                                <i className="fa fa-minus"></i>Xóa nhiều
                                            </button>
                                        )}

                                        <div className="mt-3">
                                            <p>
                                                Số ngày học đã chọn: {(selectedTimeTables.length) ? (selectedTimeTables.length) : 0}
                                            </p>
                                            Tổng số bản ghi: {(listTimeTables.length) ? (listTimeTables.length) : 0}
                                        </div>
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
                            <div className="timeTable-body">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                {listTimeTables.length > 0 && (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedTimeTables.length === listTimeTables.length}
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
                                            <th>
                                                <div className="sort-header">
                                                    <span>Môn học</span>
                                                    <span>
                                                        <i
                                                            className="fa-solid fa-arrow-down-long"
                                                            onClick={() => handleSubjectSort("desc", "name")}
                                                        ></i>
                                                        <i
                                                            className="fa-solid fa-arrow-up-long"
                                                            onClick={() => handleSubjectSort("asc", "name")}
                                                        ></i>
                                                    </span>
                                                </div>
                                            </th>
                                            <th scope="col">Tiết học</th>
                                            <th scope="col">Thứ</th>
                                            <th scope="col">Ngày</th>
                                            <th scope="col">Tuần</th>
                                            <th scope="col">Giáo viên giảng dạy</th>
                                            <th scope="col">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listTimeTables && listTimeTables.length > 0 ? (
                                            <>
                                                {listTimeTables.map((item, index) => {
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
                                                            <td>
                                                                {item.subject && (
                                                                    <>
                                                                        {item.subject.name}
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {item.schedule && (
                                                                    <>
                                                                        {item.schedule.name}
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {item.timeTable && (
                                                                    <>
                                                                        {item.timeTable.studyDay}
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {item.timeTable && (
                                                                    <>
                                                                        {item.timeTable.studyDate}
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {item.timeTable && (
                                                                    <>
                                                                        {item.timeTable.studyWeek}
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {item.teacher && (
                                                                    <>
                                                                        {item.teacher.firstName} {item.teacher.lastName}
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <span
                                                                    title="Sửa"
                                                                    className="edit"
                                                                    onClick={() => {
                                                                        handleEditTimeTable(item);
                                                                    }}
                                                                >
                                                                    <i className="fa fa-pencil"></i>
                                                                </span>
                                                                <span
                                                                    title="Xóa"
                                                                    className="delete"
                                                                    onClick={() => {
                                                                        handleDeleteTimeTable(item);
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
                                                    <td>Not found TimeTable</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 0 && (
                                <div className="timeTable-footer">
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
            <ModalDelete
                show={isShowModalDelete}
                handleClose={handleClose}
                confirmDelete={confirmDeleteTimeTable}
                confirmDeleteManyTimeTables={confirmDeleteManyTimeTables}
                dataModal={dataModal}
                title={"Ngày học"}
            />
            <ModalTimeTable
                show={isShowModalTimeTable}
                onHide={onHideModalTimeTable}
                action={actionModalTimeTable}
                dataModalTimeTable={dataModalTimeTable}
                schoolId={schoolId}
                yearId={selectedYear}

                semesterId={selectedTerm}
                classId={selectedClass}
            />
        </>
    );
};

export default ModalTimeTables;
