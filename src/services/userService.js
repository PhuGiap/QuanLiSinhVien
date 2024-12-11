import axios from '../axios';

const handleLoginApi = (userEmail, userPassword) => {
    console.log(userEmail, userPassword);
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

const getAllUser = (idUser) => {
    // template string
    return axios.get(`/api/get-all-user?id=${idUser}`)
}

const createNewUserService = (data) => {
    return axios.post(`/api/create-new-user`, data)
}
const deleteUserService = (userId) => {
    return axios.delete(`/api/delete-user`, { data: { id: userId } })
}
const editUserService = (data) => {
    return axios.put(`/api/edit-user`, data)
}


const getAllClass = (name) => {
    // template string
    return axios.get(`/api/get-all-class?name=${name}`)
}

const getAllSubject = (id) => {
    return axios.get(`/api/get-all-subject?id=${id}`)
}


const handleRegisterTinchi = (data) => {
    return axios.post('/api/register-tinchi', { data: data });
}


const handleCancleTinchi = (data) => {
    return axios.post('/api/cancle-tinchi', { data: data });
}



const handleUpdatePay = (id) => {
    return axios.post(`/api/update-pay?id=${id}`);
}


const getAllUserByClass = (idClass) => {
    return axios.get(`/api/get-all-user-class?idClass=${idClass}`)
}

export {
    handleLoginApi, getAllUser, createNewUserService, deleteUserService, editUserService,
    getAllClass, getAllSubject,
    handleRegisterTinchi, handleCancleTinchi, handleUpdatePay, getAllUserByClass
}