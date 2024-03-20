import axios from '../setups/customize-axios';


const fetchAttendancesWithPagination = (currentPage, currentLimit, timeTableId, scheduleId, teacherId, classId) => {
    return axios.get(`/api/v1/attendance/read?page=${currentPage}&limit=${currentLimit}&timeTableId=${timeTableId}&scheduleId=${scheduleId}&teacherId=${teacherId}&classId=${classId}`);
};
const changeStatus = (id) => {
    return axios.post(`/api/v1/attendance/change-status/${id}`);
}


export {
    fetchAttendancesWithPagination,
    changeStatus
}

