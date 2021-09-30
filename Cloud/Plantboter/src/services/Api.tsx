import axios from 'axios';
import CONFIG from '../config';
import ROUTES from './routes/routes';

const base_url = CONFIG.API_URL;

//add auth token header to requests
axios.interceptors.request.use((config) => {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
        config.headers["x-access-token"] = access_token;
    }
    else {
        if (!new RegExp("/auth/", "g").test(window.location.pathname)) {
            window.location.href = "/auth/login";
        }
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
    let refresh_token = localStorage.getItem("refresh_token");

    if (refresh_token && error.response.status === 401 && !original_request._retry) {
        original_request._retry = true;

        axios
            .post(base_url + ROUTES.AUTH.REFRESH_TOKEN, { refresh_token: refresh_token })
            .then((response) => {
                console.log(response.status)
                if (response.status == 200) {
                    localStorage.setItem("access_token", response.data.access_token);

                    console.log("Access token refreshed!");
                    return axios(original_request);
                }
                window.location.href = "/auth/login";
            })
            .catch((error) => {
                window.location.href = "/auth/login";
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
        return axios.post(base_url + ROUTES.AUTH.LOGIN, body)
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