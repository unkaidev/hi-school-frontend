import axios from '../setups/customize-axios';

const loginUser = (username, password) => {
    const loginRequest = {
        "username": username,
        "password": password
    };
    return axios.post(`/api/auth/signin`, loginRequest)
}
const logoutUser = () => {
    return axios.post(`/api/auth/signout`);
}
const fetchAllUser = (page, limit) => {
    return axios.get(`/api/v1/user/read?page=${page}&limit=${limit}`);
}

const fetchUsersWithManagerRole = (page, limit, username) => {
    return axios.get(`/api/v1/user/${username}/read/managers?page=${page}&limit=${limit}`);
}

const fetchUsersWithoutManagerAndAdmin = (page, limit, schoolId) => {
    return axios.get(`/api/v1/user/read/nonManagers?page=${page}&limit=${limit}&schoolId=${schoolId}`);
}

const deleteUser = (user) => {
    return axios.post(`/api/v1/user/delete/${user.id}`);
}

const createNewUser = (userData) => {
    return axios.post("/api/auth/signup", { ...userData })
}

const updateCurrentUser = (userData) => {
    return axios.put("/api/v1/user/update", { ...userData })
}

const getUserAccount = () => {
    return axios.get(`/api/v1/account`);
}
const fetchAllRole = () => {
    return axios.get('/api/v1/role/read');
}
const fetchAllRoleForAdmin = () => {
    return axios.get('/api/v1/role/admin/read');
}
const fetchAllRoleForManager = () => {
    return axios.get('/api/v1/role/manager/read');
}
const fetchUserWithUsername = (username) => {
    return axios.get(`/api/v1/user/user?username=${username}`);
}
const changeUserPassword = (username, oldPassword, newPassword, reNewPassword) => {
    return axios.post("/api/v1/user/change-password", { username, oldPassword, newPassword, reNewPassword })
}
const fetchCountNotificationUnReadWithUsername = (username) => {
    return axios.get(`/api/v1/user/count-notification?username=${username}`);
}
const fetchAllNotificationWithUsername = (page, limit, username) => {
    return axios.get(`/api/v1/user/all-notification?page=${page}&limit=${limit}&username=${username}`);
}
const changeStatusNotification = (id) => {
    return axios.post(`/api/v1/user/notification/change-status/${id}`);
}
const fetchCountUserWithUsername = (username) => {
    return axios.get(`/api/v1/user/count-users?username=${username}`);
}

const fetchCountSchoolWithUsername = (username) => {
    return axios.get(`/api/v1/user/count-schools?username=${username}`);
}
const fetchCountUserToday = (username, today) => {
    return axios.get(`/api/v1/user/count-users-today?username=${username}&today=${today}`);
}
const fetchCountSchoolToday = (username, today) => {
    return axios.get(`/api/v1/user/count-schools-today?username=${username}&today=${today}`);
}
const fetchCountAllUserWithUsername = (username) => {
    return axios.get(`/api/v1/user/count-all-users?username=${username}`);
}
const fetchCountAllUserToday = (username, today) => {
    return axios.get(`/api/v1/user/count-all-users-today?username=${username}&today=${today}`);
}

const countUsersByMonth = (year) => {
    return axios.get(`/api/v1/user/count-by-month/${year}`);
}
const countUsersInSchoolByYear = (schoolId) => {
    return axios.get(`/api/v1/user/${schoolId}/count-by-year`);
}

export {
    loginUser, logoutUser,
    fetchAllUser, deleteUser, createNewUser, updateCurrentUser, getUserAccount,
    fetchAllRole, fetchUsersWithManagerRole, fetchUsersWithoutManagerAndAdmin,
    fetchAllRoleForManager, fetchAllRoleForAdmin, fetchUserWithUsername,
    changeUserPassword, fetchCountNotificationUnReadWithUsername, fetchAllNotificationWithUsername,
    changeStatusNotification,
    fetchCountUserWithUsername, fetchCountSchoolWithUsername, fetchCountUserToday, fetchCountSchoolToday,
    fetchCountAllUserWithUsername, fetchCountAllUserToday, countUsersByMonth,
    countUsersInSchoolByYear,
}

