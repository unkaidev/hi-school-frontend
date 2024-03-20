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

export {
    fetchAllSchools,
    fetchAllSchool, deleteSchool, createNewSchool, updateCurrentSchool,
    fetchLatestSchool, countSchoolsByMonth
}

