import axios from '../setups/customize-axios';

const fetchATeacherWithClassId = (classId) => {
    return axios.get(`/api/v1/teacher/get/${classId}`);
}
const fetchAllTeacherWithPagination = (page, limit, schoolId) => {
    return axios.get(`/api/v1/teacher/read?page=${page}&limit=${limit}&schoolId=${schoolId}`);
}
const deleteTeacher = (teacher) => {
    return axios.post(`/api/v1/teacher/delete/${teacher.id}`);
}

const createNewTeacher = (teacherData) => {
    return axios.post("/api/v1/teacher/create", { ...teacherData })
}

const updateCurrentTeacher = (teacherData) => {
    return axios.put("/api/v1/teacher/update", { ...teacherData })
}
const getAllGroupName = () => {
    return axios.get(`/api/v1/teacher/allGroupName`);
}
const getAllTeacherWithSchoolId = (schoolId) => {
    return axios.get(`/api/v1/teacher/${schoolId}/all`)
}
const getAllTeacherBySchoolAndGroup = (schoolId, group) => {
    return axios.get(`/api/v1/teacher/${schoolId}/all-by-group?group=${group}`);
}
const getAllTeacherBySchoolAndGroupReady = (schoolId, group, selectedSchedules, selectedWeeks, selectedDays) => {
    const scheduleParams = selectedSchedules.map(schedule => `selectedSchedules=${schedule}`).join('&');
    const weekParams = selectedWeeks.map(week => `selectedWeeks=${week}`).join('&');
    const dayParams = selectedDays.map(day => `selectedDays=${day}`).join('&');

    return axios.get(`/api/v1/teacher/${schoolId}/all-by-group-ready?group=${group}&${scheduleParams}&${weekParams}&${dayParams}`);
};
const getAllTeacherReadyWithSchoolIdAndYearId = (schoolId, yearId) => {
    return axios.get(`/api/v1/teacher/${schoolId}/${yearId}/all`)
}

const fetchLatestTeacher = (username) => {
    return axios.get(`/api/v1/teacher/latest?username=${username}`);
}

export {
    fetchAllTeacherWithPagination, deleteTeacher, createNewTeacher, updateCurrentTeacher,
    getAllGroupName, getAllTeacherWithSchoolId, getAllTeacherBySchoolAndGroup, getAllTeacherBySchoolAndGroupReady,
    fetchATeacherWithClassId, getAllTeacherReadyWithSchoolIdAndYearId,
    fetchLatestTeacher
}

