import axios from '../setups/customize-axios';


const fetchAllSubjectWithPagination = (page, limit, schoolId) => {
    return axios.get(`/api/v1/subject/read?page=${page}&limit=${limit}&schoolId=${schoolId}`);
}
const deleteSubject = (subject) => {
    return axios.post(`/api/v1/subject/delete/${subject.id}`);
}

const createNewSubject = (subjectData) => {
    return axios.post("/api/v1/subject/create", { ...subjectData })
}

const updateCurrentSubject = (subjectData) => {
    return axios.put("/api/v1/subject/update", { ...subjectData })
}
const getAllName = () => {
    return axios.get(`/api/v1/subject/allName`);
}
const getAllBySemesterId = (semesterId) => {
    return axios.get(`/api/v1/subject/all?semesterId=${semesterId}`);
}
const getAllBySemesterAndGrade = (semesterId, grade) => {
    return axios.get(`/api/v1/subject/${semesterId}/all-by-grade?grade=${grade}`);
}


export {
    fetchAllSubjectWithPagination, deleteSubject, createNewSubject, updateCurrentSubject,
    getAllName, getAllBySemesterId, getAllBySemesterAndGrade
}

