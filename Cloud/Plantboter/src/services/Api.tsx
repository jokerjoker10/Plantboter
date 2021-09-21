import axios from 'axios';
import CONFIG from '../config';
import ROUTES from './routes/routes';

const base_url = CONFIG.API_URL;

//add auth token header to requests
axios.interceptors.request.use((config) => {
    const access_token = localStorage.getItem("acces_token");
    if(access_token) {
        config.headers["x-access-token"] = access_token;
    }
    return config;
}, (error) => {
    Promise.reject(error);
});

//if token is expired refresh token
axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const original_request = error.config;
    console.log(original_request)
    let refresh_token = localStorage.getItem("refresh_token");

    if(refresh_token && error.response.status === 401 && !original_request._retry){
        original_request._retry = true;

        return axios
            .post(base_url + ROUTES.AUTH.REFRESH_TOKEN)
            .then((res) => {
                if(res.status === 200){
                    localStorage.setItem("access_token", res.data.access_token);
                    localStorage.setItem("refresh_token", res.data.refresh_token);
                    console.log("Access token refreshed!");
                    return axios(original_request);
                }
            })
    }
    return Promise.reject(error);
});


const api = {
    //auth
    signup: (body: Object) => {
        return axios.post(base_url + ROUTES.AUTH.SIGNUP, body);
    },
    login: (body: Object) => {
        return axios.post(base_url + ROUTES.AUTH.LOGIN, body);
    },
    logout: () => {
        return axios.delete(base_url + ROUTES.AUTH.LOGOUT);
    },

    //user
    getUser: () => {
        return axios.get(base_url + ROUTES.USER.GET_USER);
    },
    changeEmail: (body: Object) => {
        return axios.post(base_url + ROUTES.USER.CHANGE_EMAIL, body);
    },
    verifyEmail: (body: Object) => {
        return axios.post(base_url + ROUTES.USER.VERIFY_EMAIL, body);
    },
    resetPassword: (body: Object) => {
        return axios.post(base_url + ROUTES.USER.RESET_PASSWORD, body);
    },

    //settings
    getSettings: () => {
        return axios.get(base_url + ROUTES.SETTINGS.FRONTEND_SETTINGS);
    },

    //mail
    requestMailVerification: (body: Object) => {
        return axios.post(base_url + ROUTES.MAIL.REQUEST_MAIL_VERIFICATION, body);
    },
    requestPasswordReset: (body: Object) => {
        return axios.post(base_url + ROUTES.MAIL.REQUEST_PASSWORD_RESET, body);
    }
}

export default api;