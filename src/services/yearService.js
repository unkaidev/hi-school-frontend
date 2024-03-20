import axios from '../setups/customize-axios';

const getAllYearWithSchoolId = (schoolId) => {
    return axios.get(`/api/v1/year/${schoolId}/all`);
}

const fetchAllYearWithPagination = (page, limit, schoolId) => {
    return axios.get(`/api/v1/year/read?page=${page}&limit=${limit}&schoolId=${schoolId}`);
}
const deleteYear = (year) => {
    return axios.post(`/api/v1/year/delete/${year.id}`);
}

const createNewYear = (yearData) => {
    return axios.post("/api/v1/year/create", { ...yearData })
}

const updateCurrentYear = (yearData) => {
    return axios.put("/api/v1/year/update", { ...yearData })
}


export {
    fetchAllYearWithPagination, deleteYear, createNewYear, updateCurrentYear,
    getAllYearWithSchoolId
}

