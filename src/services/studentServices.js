import axios from '../setups/customize-axios';


const fetchAllStudentWithPagination = (page, limit, schoolId) => {
    return axios.get(`/api/v1/student/read?page=${page}&limit=${limit}&schoolId=${schoolId}`);
}
const fetchAllStudentInClassWithPagination = (page, limit, schoolClassId) => {
    return axios.get(`/api/v1/student/view?page=${page}&limit=${limit}&schoolClassId=${schoolClassId}`);
}
const fetchAllStudentNotInClassWithPagination = (page, limit, schoolClassId) => {
    return axios.get(`/api/v1/student/add?page=${page}&limit=${limit}&schoolClassId=${schoolClassId}`);
}
const deleteStudent = (student) => {
    return axios.post(`/api/v1/student/delete/${student.id}`);
}

const createNewStudent = (studentData) => {
    return axios.post("/api/v1/student/create", { ...studentData })
}

const updateCurrentStudent = (studentData) => {
    return axios.put("/api/v1/student/update", { ...studentData })
}

const removeStudentFromClass = (schoolClassId, student) => {
    return axios.post(`/api/v1/student/${schoolClassId}/remove/${student.id}`);
}

const addStudentFromClass = (schoolClassId, student) => {
    return axios.post(`/api/v1/student/${schoolClassId}/add/${student.id}`);
}
const addManyStudentsFromClass = (schoolClassId, students) => {
    return axios.post(`/api/v1/student/${schoolClassId}/add-many/${students}`);
}
const removeManyStudentsFromClass = (schoolClassId, students) => {
    return axios.post(`/api/v1/student/${schoolClassId}/remove-many/${students}`);
}
const fetchLatestStudent = (username) => {
    return axios.get(`/api/v1/student/latest?username=${username}`);
}
export {
    fetchAllStudentWithPagination, deleteStudent, createNewStudent, updateCurrentStudent,
    fetchAllStudentInClassWithPagination, fetchAllStudentNotInClassWithPagination,
    removeStudentFromClass, addStudentFromClass,
    addManyStudentsFromClass, removeManyStudentsFromClass,
    fetchLatestStudent
}

