import axios from '../setups/customize-axios';


const fetchAllScheduleWithPagination = (page, limit, schoolId) => {
    return axios.get(`/api/v1/schedule/read?page=${page}&limit=${limit}&schoolId=${schoolId}`);
}
const deleteSchedule = (schedule) => {
    return axios.post(`/api/v1/schedule/delete/${schedule.id}`);
}

const createNewSchedule = (scheduleData) => {
    return axios.post("/api/v1/schedule/create", { ...scheduleData })
}

const updateCurrentSchedule = (scheduleData) => {
    return axios.put("/api/v1/schedule/update", { ...scheduleData })
}
const getAllSchedulesWithSemesterId = (semesterId) => {
    return axios.get(`/api/v1/schedule/all/${semesterId}`);
}
export {
    fetchAllScheduleWithPagination, deleteSchedule, createNewSchedule, updateCurrentSchedule,
    getAllSchedulesWithSemesterId
}

