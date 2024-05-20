import axios from '../setups/customize-axios';

const fetchAllSchools = () => {
    return axios.get(`/api/v1/school/all`);
}

const fetchAllSchool = (page, limit) => {
    return axios.get(`/api/v1/school/read?page=${page}&limit=${limit}`);
}
const deleteSchool = (school) => {
    return axios.post(`/api/v1/school/delete/${school.id}`);
}

const createNewSchool = (schoolData) => {
    return axios.post("/api/v1/school/create", { ...schoolData })
}

const updateCurrentSchool = (schoolData) => {
    return axios.put("/api/v1/school/update", { ...schoolData })
}
const fetchLatestSchool = () => {
    return axios.get(`/api/v1/school/latest`);
}
const countSchoolsByMonth = (year) => {
    return axios.get(`/api/v1/school/count-by-month/${year}`);
}
const countClassInSchoolByYear = (schoolId) => {
    return axios.get(`/api/v1/school/${schoolId}/count-by-year`);
}
const countAllYearsInSchool = (schoolId) => {
    return axios.get(`/api/v1/school/${schoolId}/count-all-years`);
}
const countAllSemestersInSchool = (schoolId) => {
    return axios.get(`/api/v1/school/${schoolId}/count-all-semesters`);
}
const countAllSchedulesInSchool = (schoolId) => {
    return axios.get(`/api/v1/school/${schoolId}/count-all-schedules`);
}
const countAllSubjectsInSchool = (schoolId) => {
    return axios.get(`/api/v1/school/${schoolId}/count-all-subjects`);
}
const countAllStudentsInSchool = (schoolId) => {
    return axios.get(`/api/v1/school/${schoolId}/count-all-students`);
}
const countAllTeachersInSchool = (schoolId) => {
    return axios.get(`/api/v1/school/${schoolId}/count-all-teachers`);
}
const countAllClassInSchool = (schoolId) => {
    return axios.get(`/api/v1/school/${schoolId}/count-all-class`);
}
const countAllTranscriptsInSchool = (schoolId) => {
    return axios.get(`/api/v1/school/${schoolId}/count-all-transcripts`);
}
const countAllStudentsInSchoolByYearAndGrade = (schoolId, year, grade) => {
    return axios.get(`/api/v1/school/${schoolId}/${year}/${grade}/count-all-students`);
}
export {
    fetchAllSchools,
    fetchAllSchool, deleteSchool, createNewSchool, updateCurrentSchool,
    fetchLatestSchool, countSchoolsByMonth, countClassInSchoolByYear,
    countAllYearsInSchool, countAllSchedulesInSchool, countAllSemestersInSchool, countAllSubjectsInSchool,
    countAllStudentsInSchool, countAllTeachersInSchool, countAllClassInSchool, countAllTranscriptsInSchool,
    countAllStudentsInSchoolByYearAndGrade
}

