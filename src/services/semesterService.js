import axios from '../setups/customize-axios';

const getAllSemester = () => {
    return axios.get(`/api/v1/semester/all`);
}
const fetchAllSemesterWithPagination = (page, limit, schoolId) => {
    return axios.get(`/api/v1/semester/read?page=${page}&limit=${limit}&schoolId=${schoolId}`);
}
const getAllSemesterWithYearId = (yearId) => {
    return axios.get(`/api/v1/semester/all/${yearId}`);
}

const deleteSemester = (semester) => {
    return axios.post(`/api/v1/semester/delete/${semester.id}`);
}

const createNewSemester = (semesterData) => {
    return axios.post("/api/v1/semester/create", { ...semesterData })
}

const updateCurrentSemester = (semesterData) => {
    return axios.put("/api/v1/semester/update", { ...semesterData })
}
const getAllSemesterWithSchoolId = (schoolId) => {
    return axios.get(`/api/v1/semester/all-in-school/${schoolId}`);
}

export {
    fetchAllSemesterWithPagination, deleteSemester, createNewSemester, updateCurrentSemester,
    getAllSemester, getAllSemesterWithYearId, getAllSemesterWithSchoolId
}

