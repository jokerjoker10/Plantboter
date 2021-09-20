const ROUTES = {
    AUTH: {
        SIGNUP: "front/auth/signup",
        LOGIN: "front/auth/login",
        LOGOUT: "front/auth/refreshtoken",
        REFRESH_TOKEN: "front/auth/logout"
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
    }
}

export default ROUTES;