import React, { useEffect, useState } from "react";
import "./scores.scss";
import { fetchAllScoreWithPagination, getSemesterEvaluation, fetchAllScoreOfTeacherWithPagination } from '../../../../services/scoreService'
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalScore from './ModalScore';
import Select from 'react-select';
import _ from "lodash";
import Navbar from "../../../../components/navbar/Navbar";
import Sidebar from "../../../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Link } from 'react-router-dom';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
const Scores = (props) => {

    const history = useHistory();

    const [listScores, setListScores] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModel] = useState({});
    const [isShowModalScore, setIsShowModalScore] = useState(false);
    const [actionModalScore, setActionModalScore] = useState("CREATE");
    const [dataModalScore, setDataModalScore] = useState({});
    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");
    const [semesterEvaluation, setSemesterEvaluation] = useState("");

    const user = useSelector(state => state.user);
    const schoolId = user?.dataRedux?.account?.schoolId || [];
    const username = user?.dataRedux?.account?.username || [];

    const { semesterId, studentId, studentName, className, yearName, termName,
        selectedYear, selectedTerm, selectedClass, selectedTeacher, isHeadTeacher, isTeacher, isStudent } = props.location.state;

    useEffect(() => {
        fetchScores();
    }, [currentPage]);

    const fetchScores = async () => {
        let response;
        if (!isHeadTeacher && isTeacher) {
            response = await fetchAllScoreOfTeacherWithPagination(currentPage, currentLimit, semesterId, studentId, username);
        }
        else {
            response = await fetchAllScoreWithPagination(currentPage, currentLimit, semesterId, studentId);
        }

        let evaluationResponse = await getSemesterEvaluation(semesterId, studentId);
        if (response && response.dt && response.ec === 0) {
            setTotalPages(response.dt.totalPages);
            setListScores(response.dt.content);
        }
        if (evaluationResponse && evaluationResponse.dt && evaluationResponse.ec === 0) {
            setSemesterEvaluation(evaluationResponse.dt);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected);
    };

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModel({});
    };

    const onHideModalScore = async () => {
        setIsShowModalScore(false);
        setDataModalScore({});
        await fetchScores();
    };


    const handleEditScore = (score) => {
        setActionModalScore("UPDATE");
        setDataModalScore(score);
        setIsShowModalScore(true);
    };

    const handleRefresh = async () => {
        fetchScores();
    };

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField);

        let cloneListScores = _.cloneDeep(listScores);
        cloneListScores = _.orderBy(cloneListScores, [sortField], [sortBy]);
        setListScores(cloneListScores);
    };

    const handleSearch = _.debounce((event) => {
        let term = event.target.value.toLowerCase();
        if (term) {
            let cloneListScores = _.cloneDeep(listScores);
            cloneListScores = cloneListScores.filter((item) =>
                item.subject.name.toLowerCase().includes(term)
            );
            setListScores(cloneListScores);
        } else {
            fetchScores();
        }
    }, 300);

    const handleBack = () => {
        history.push({
            pathname: "/list-transcripts",
            state: {
                selectedYearBack: selectedYear,
                selectedTermBack: selectedTerm,
                selectedClassBack: selectedClass,
                classNameBack: className,
                yearNameBack: yearName,
                termNameBack: termName,
                selectedTeacherBack: selectedTeacher,
                isStudent: isStudent,
            }
        });
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

                        <div className="manage-scores-container">
                            <div className="score-header row">
                                <div className="title mt-3">
                                    <h3 className="text-center">Danh sách điểm môn học</h3>
                                </div>
                                <div className="actions my-3">
                                    <div className="header-left col-3">
                                        <button
                                            className="btn btn-success refresh"
                                            onClick={handleRefresh}
                                        >
                                            <i className="fa fa-refresh"></i>Làm mới
                                        </button>
                                        <button
                                            className="btn btn-warning refresh"
                                            onClick={handleBack}
                                        >
                                            <i className="fa fa-arrow-left"></i>Quay lại học bạ
                                        </button>

                                    </div>

                                    <div className="header-right col-9">
                                        <div className="row">
                                            <div className="col-6 fw-bold fst-italic">
                                                Tên học sinh: {studentName}
                                            </div>
                                            <div className="col fw-bold fst-italic">
                                                Đang xếp loại: {semesterEvaluation}
                                            </div>
                                            <div className="col fw-bold fst-italic">
                                                Lớp: {className}
                                            </div>
                                            <div className="col fw-bold fst-italic">
                                                {yearName}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="score-body">
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
                                                    <span>Tên môn học</span>
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
                                            <th scope="col">Kỳ học</th>
                                            <th scope="col">Năm học</th>
                                            <th scope="col">Điểm chuyên cần</th>
                                            <th scope="col">Điểm giữa kỳ</th>
                                            <th scope="col">Điểm cuối kỳ</th>
                                            <th scope="col">Điểm tổng kết</th>
                                            <th scope="col">Đánh giá môn</th>
                                            <th scope="col">Tên giáo viên giảng dạy</th>
                                            {
                                                !isHeadTeacher && !isTeacher ?
                                                    <></>
                                                    :
                                                    <><th scope="col">Hành động</th></>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listScores && listScores.length > 0 ? (
                                            <>
                                                {listScores.map((item, index) => {
                                                    return (
                                                        <tr key={`row-${index}`}>
                                                            <td>{currentPage * currentLimit + index + 1}</td>
                                                            <td>{item.id}</td>
                                                            <td>{item.subject.name}</td>
                                                            <td>{item.semester.name}</td>
                                                            <td>{item.semester.schoolYear.name}</td>
                                                            <td>{
                                                                item.dailyScore ?
                                                                    item.dailyScore.toFixed(1)
                                                                    :
                                                                    <span className="fw-light fst-italic">
                                                                        "Chưa có "
                                                                    </span>
                                                            }</td>
                                                            <td>{
                                                                item.midtermScore ?
                                                                    item.midtermScore.toFixed(1)
                                                                    :
                                                                    <span className="fw-light fst-italic">
                                                                        "Chưa có "
                                                                    </span>
                                                            }</td>
                                                            <td>{
                                                                item.finalScore ?
                                                                    item.finalScore.toFixed(1)
                                                                    :
                                                                    <span className="fw-light fst-italic">
                                                                        "Chưa có "
                                                                    </span>
                                                            }</td>
                                                            <td>{
                                                                item.subjectScore ?
                                                                    item.subjectScore.toFixed(1)
                                                                    :
                                                                    <span className="fw-light fst-italic">
                                                                        "Chưa có "
                                                                    </span>
                                                            }</td>
                                                            <td>{
                                                                item.subjectEvaluation ?
                                                                    item.subjectEvaluation
                                                                    :
                                                                    <span className="fw-light fst-italic">
                                                                        "Chưa có "
                                                                    </span>
                                                            }</td>
                                                            <td>{item.teacher?.firstName} {item.teacher?.lastName}</td>
                                                            {
                                                                !isHeadTeacher && !isTeacher ?
                                                                    <></>
                                                                    :
                                                                    <> <td>
                                                                        <span
                                                                            title="Sửa"
                                                                            className="edit"
                                                                            onClick={() => {
                                                                                handleEditScore(item);
                                                                            }}
                                                                        >
                                                                            <i className="fa fa-pencil"></i>
                                                                        </span>

                                                                    </td></>
                                                            }

                                                        </tr>
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            <>
                                                <tr>
                                                    <td>Not found Score</td>
                                                </tr>
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 0 && (
                                <div className="score-footer">
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

            <ModalScore
                show={isShowModalScore}
                onHide={onHideModalScore}
                action={actionModalScore}
                dataModalScore={dataModalScore}
                schoolId={schoolId}
            />
        </>
    );
};

export default Scores;
