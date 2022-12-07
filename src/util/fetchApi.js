import axios from 'axios';

const URL = 'http://localhost:3000/api';

export default async function fetchApi(method, endpoint, data = null) {
    switch (method.toLowerCase()) {

        case 'count':
            console.log('get');
            try {
                return axios.get(`${URL}${endpoint}`)
                .then( res => {
                    console.log(res.data.length)
                    return res.data.length;
                });
                    
            } catch (error) {
                return error;
            }
        case 'get':
            console.log('get');
            try {
                return axios.get(`${URL}${endpoint}`)
                .then( res => {
                    return res.data;
                });
            } catch (error) {
                return error;
            }
        case 'post':
            console.log('post');
            try {
                return axios.post(`${URL}${endpoint}`, data)
                .then( res => {
                    return res.data;
                });
            } catch (error) {
                return error;
            }
            break;
        case 'put':
            console.log(data)
            try {
                return axios.put(`${URL}${endpoint}`, data)
                .then( res => {
                    return res.data;
                });
            } catch (error) {
                return error;
            }
        case 'delete':
            console.log('delete');
            return axios.delete(`${URL}${endpoint}`)
            break;
        default:
        
    }



}