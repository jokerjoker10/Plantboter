const REGEX = {
    auth: {
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        password: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*!@$%&?/~_=|#^]).{8,32}$/,
        key: /^[0-9A-Za-z]{8}$/
    }
}

function check(value: string, checktype: string){
    if(value == ''){
        return {status:'none', success: false};
    }
    if(checktype == "email" && REGEX.auth.email.test(value)){
        return {status:"success", success: true};
    }
    else if(checktype == "password" && REGEX.auth.password.test(value)){
        return {status:"success", success: true};
    }
    else if(checktype == "key" && REGEX.auth.key.test(value)){
        return {status:"success", success: true};
    }
    return {status: "error", success: false};
}

export default check;