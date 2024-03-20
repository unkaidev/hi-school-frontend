import axios from '../setups/customize-axios';
const getAllWardCommune = () => {
    return axios.get(`/api/v1/address/allWardCommune`);
}
const getAllDistrict = () => {
    return axios.get(`/api/v1/address/allDistrict`);
}
const getAllProvince = () => {
    return axios.get(`/api/v1/address/allProvince`);
}
const getAllCity = () => {
    return axios.get(`/api/v1/address/allCity`);
}
const getAllIssuedPlace = () => {
    return axios.get(`/api/v1/address/allIssuedPlace`)
}
export {
    getAllCity, getAllDistrict, getAllProvince, getAllWardCommune,
    getAllIssuedPlace
}