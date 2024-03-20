import axios from '../setups/customize-axios';


const fetchAllTimeTableWithPagination = (page, limit, schoolId) => {
    return axios.get(`/api/v1/timeTable/read?page=${page}&limit=${limit}&schoolId=${schoolId}`);
}
const fetchAllTimeTableFromTermAndClass = (page, limit, semesterId, schoolClassId) => {
    return axios.get(`/api/v1/timeTable/read?page=${page}&limit=${limit}&semesterId=${semesterId}&schoolClassId=${schoolClassId}`)
}
const deleteTimeTable = (timeTable) => {
    return axios.post(`/api/v1/timeTable/delete/${timeTable.id}`);
}

const createNewTimeTable = (timeTableData) => {
    return axios.post("/api/v1/timeTable/create", { ...timeTableData })
}

const updateCurrentTimeTable = (timeTableData) => {
    return axios.put("/api/v1/timeTable/update", { ...timeTableData })
}
const getAllName = () => {
    return axios.get(`/api/v1/timeTable/allName`);
}
const getAllTimeWeekWithSemester = (semesterId) => {
    return axios.get(`/api/v1/timeTable/all-week/${semesterId}`);
}
const getAllTimeDayWithSemester = (semesterId) => {
    return axios.get(`/api/v1/timeTable/all-day/${semesterId}`);
}
const getAllWithSemester = (semesterId) => {
    return axios.get(`/api/v1/timeTable/all/${semesterId}`);
}
const deleteManyTimeDate = (timeTables) => {
    return axios.post(`/api/v1/timeTable/delete-all/${timeTables}`);
}
const getAllByUsernameForTeacher = (username) => {
    return axios.get(`/api/v1/timeTable/${username}/all-for-teacher`);
}
const getAllByUsernameForStudent = (username) => {
    return axios.get(`/api/v1/timeTable/${username}/all-for-student`);
}

export {
    fetchAllTimeTableWithPagination, deleteTimeTable, createNewTimeTable, updateCurrentTimeTable,
    getAllName, fetchAllTimeTableFromTermAndClass, getAllTimeWeekWithSemester, getAllWithSemester,
    deleteManyTimeDate, getAllTimeDayWithSemester, getAllByUsernameForStudent,
    getAllByUsernameForTeacher
}

