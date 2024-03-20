import axios from '../setups/customize-axios';

const getSemesterEvaluation = (semesterId, studentId) => {
    return axios.get(`/api/v1/score/semester-evaluation?semesterId=${semesterId}&studentId=${studentId}`);
}
const fetchAllScoreWithPagination = (page, limit, semesterId, studentId) => {
    return axios.get(`/api/v1/score/read?page=${page}&limit=${limit}&semesterId=${semesterId}&studentId=${studentId}`);
}
const fetchAllScoreOfTeacherWithPagination = (page, limit, semesterId, studentId, username) => {
    return axios.get(`/api/v1/score/${username}/read?page=${page}&limit=${limit}&semesterId=${semesterId}&studentId=${studentId}`);
}

const updateCurrentScore = (scoreData) => {
    return axios.put("/api/v1/score/update", { ...scoreData })
}
const getAllByYearAndGrade = (yearId, grade) => {
    return axios.get(`/api/v1/score/${yearId}/all-by-grade?grade=${grade}`);
}

export {
    fetchAllScoreWithPagination,
    updateCurrentScore,
    getAllByYearAndGrade,
    getSemesterEvaluation,
    fetchAllScoreOfTeacherWithPagination
}

