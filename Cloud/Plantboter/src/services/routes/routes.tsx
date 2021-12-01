const ROUTES = {
    AUTH: {
        SIGNUP: "front/auth/signup",
        LOGIN: "front/auth/login",
        REFRESH_TOKEN: "front/auth/refreshtoken",
        LOGOUT: "front/auth/logout"
    },
    USER: {
        GET_USER: "front/user/getUser",
        CHANGE_EMAIL: "front/user/changeemail",
        VERIFY_EMAIL: "front/mail/verifymail",
        RESET_PASSWORD: "front/mail/resetpassword"
    },
    SETTINGS: {
        FRONTEND_SETTINGS: "front/settings"
    },
    MAIL: {
        REQUEST_MAIL_VERIFICATION: "front/mail/requestmailverification",
        REQUEST_PASSWORD_RESET: "front/mail/requestpasswordreset"
    },
    CONTROLLER: {
        GET_CONTROLLER_LIST: "front/controller/",
        GET_CONTROLLER: "front/controller/info",
        ADD_CONTROLLER: "front/controller/create",
        UPDATE_CONTROLLER: "front/controller/"
    },
    PLANT: {
        GET_PLANTS_OF_CONTROLLER: "front/plant/plantsofcontroller",
        GET_PLANT_INFO: "front/plant",
        CREATE_PLANT: "front/plant",
        UPDATE_PLANT: "front/plant",
    },
    API_KEY: {
        CREATE_API_KEY: "front/api",
        GET_API_KEY: "front/api"
    },
    HEALTHCHECK : "healthcheck"
}

export default ROUTES;