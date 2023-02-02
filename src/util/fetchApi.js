import axios from 'axios';
import logger from './logger';

const URL = 'http://localhost:3000/api';

export default async function fetchApi(method, endpoint, data = null) {
  switch (method.toLowerCase()) {
    case 'count':
      try {
        return axios.get(`${URL}${endpoint}`)
          .then(res => {
            return res.data.length;
          });
      } catch (error) {
        return error;
      }
    case 'get':
      try {
        return axios.get(`${URL}${endpoint}`)
          .then(res => {
            return res.data;
          });
      } catch (error) {
        return error;
      }
    case 'post':
      try {
        return axios.post(`${URL}${endpoint}`, data)
          .then(res => {
            return res.data;
          });
      } catch (error) {
        return error;
      }
      break;
    case 'put':
      try {
        return axios.put(`${URL}${endpoint}`, data)
          .then(res => {
            return res.data;
          });
      } catch (error) {
        return error;
      }
    case 'delete':
      return axios.delete(`${URL}${endpoint}`)
      break;
    default:
  }
}