import axios from '../setups/customize-axios';


const fetchAllTranscriptFromTermAndClass = (page, limit, semesterId, schoolClassId) => {
    return axios.get(`/api/v1/transcript/read?page=${page}&limit=${limit}&semesterId=${semesterId}&schoolClassId=${schoolClassId}`)
}
const fetchAllTranscriptFromTerm = (page, limit, semesterId) => {
    return axios.get(`/api/v1/transcript/read-by-semester?page=${page}&limit=${limit}&semesterId=${semesterId}`)
}
const fetchAllTranscriptFromTermAndClassForStudent = (page, limit, semesterId, username) => {
    return axios.get(`/api/v1/transcript/student/read?page=${page}&limit=${limit}&semesterId=${semesterId}&username=${username}`)
}

const updateCurrentTranscript = (transcriptData) => {
    return axios.put("/api/v1/transcript/update", { ...transcriptData })
}

export {
    updateCurrentTranscript,
    fetchAllTranscriptFromTermAndClass, fetchAllTranscriptFromTermAndClassForStudent, fetchAllTranscriptFromTerm
}

