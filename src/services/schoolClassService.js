import axios from '../setups/customize-axios';

const getAllGrade = () => {
    return axios.get(`/api/v1/schoolClass/allGrade`);
}
const getASchoolClass = (id) => {
    return axios.get(`/api/v1/schoolClass/view/${id}`);
}
const getAllSchoolClass = () => {
    return axios.get(`/api/v1/schoolClass/all`);
}
const getAllSchoolClassWithYearId = (yearId) => {
    return axios.get(`/api/v1/schoolClass/all/${yearId}`);
}
const getAllSchoolClassWithSemesterIdForHeadTeacher = (username, semesterId) => {
    return axios.get(`/api/v1/schoolClass/all-for-headteacher/${username}/${semesterId}`);
}

const getAllByYearAndGrade = (yearId, grade) => {
    return axios.get(`/api/v1/schoolClass/${yearId}/all-by-grade?grade=${grade}`);
}

const getAllWithYearIdAndGradeForHeadTeacher = (username, yearId, grade) => {
    return axios.get(`/api/v1/schoolClass/head-teacher/all-by-grade/${username}/${yearId}/${grade}`);
}
const getAllWithYearIdAndGradeForStudent = (username, yearId, grade) => {
    return axios.get(`/api/v1/schoolClass/student/all-by-grade/${username}/${yearId}/${grade}`);
}

const getAllSchoolClassForHeadTeacherWithPagination = (page, limit, username, schoolId) => {
    return axios.get(`/api/v1/schoolClass/${username}/read?page=${page}&limit=${limit}&schoolId=${schoolId}`);
}
const getAllSchoolClassWithSemesterIdForTeacher = (username, semesterId) => {
    return axios.get(`/api/v1/schoolClass/all-for-teacher/${username}/${semesterId}`);
}
const getAllSchoolClassWithSemesterIdForStudent = (username, semesterId) => {
    return axios.get(`/api/v1/schoolClass/all-for-student/${username}/${semesterId}`);
}
const getAllSchoolClassWithSchoolId = (schoolId) => {
    return axios.get(`/api/v1/schoolClass/all-in-school/${schoolId}`);
}
const fetchAllSchoolClassWithPagination = (page, limit, schoolId) => {
    return axios.get(`/api/v1/schoolClass/read?page=${page}&limit=${limit}&schoolId=${schoolId}`);
}

const deleteSchoolClass = (schoolClass) => {
    return axios.post(`/api/v1/schoolClass/delete/${schoolClass.id}`);
}

const createNewSchoolClass = (schoolClassData) => {
    return axios.post("/api/v1/schoolClass/create", { ...schoolClassData })
}

const updateCurrentSchoolClass = (schoolClassData) => {
    return axios.put("/api/v1/schoolClass/update", { ...schoolClassData })
}
const countStudentsInClass = (classId) => {
    return axios.get(`/api/v1/schoolClass/count-students?classId=${classId}`)
}


export {
    fetchAllSchoolClassWithPagination, deleteSchoolClass, createNewSchoolClass, updateCurrentSchoolClass,
    getAllSchoolClass, getAllGrade, getAllSchoolClassWithYearId, getAllByYearAndGrade, getASchoolClass,
    getAllSchoolClassWithSchoolId, getAllSchoolClassWithSemesterIdForHeadTeacher, getAllSchoolClassWithSemesterIdForTeacher,
    getAllSchoolClassForHeadTeacherWithPagination,
    getAllWithYearIdAndGradeForHeadTeacher, countStudentsInClass, getAllSchoolClassWithSemesterIdForStudent, getAllWithYearIdAndGradeForStudent
}

