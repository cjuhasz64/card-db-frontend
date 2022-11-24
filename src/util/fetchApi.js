import axios from 'axios';

// axios.get(`http://localhost:3000/api/v1/teams`)
        // .then(res => {
        //     const teams = res.data;
        //     this.setState({ teams });
        // })


// fetchApi('get', '/v1/users');
// fetchApi('post', '/v1/users', data);

const URL = 'http://localhost:3000/api';

export default async function fetchApi(method, endpoint, data = null) {


    switch (method.toLowerCase()) {

        case 'count':
            //console.log('get');

            try {
                return axios.get(`${URL}${endpoint}`)
                .then( res => {
                    return res.data.length;
                });
                    
            } catch (error) {
                return error;
            }
            break;
        case 'get':
            //console.log('get');

            try {
                return axios.get(`${URL}${endpoint}`);
                    

            } catch (error) {
                return error;
            }


            break;
        case 'post':
            console.log('post');
            break;
        case 'put':
            console.log('put');
            break;
        case 'delete':
            console.log('delete');
            break;
        default:
        
    }



}