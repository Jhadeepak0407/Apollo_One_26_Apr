import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from "../constants/userConstants"

export const LoginRequest = (data) => {
    return {
        type: LOGIN_REQUEST,
        payload: data
    }
}

export const LoginSuccess = (data) => {
    return {
        type: LOGIN_SUCCESS, payload: data
    }
}
export const LoginFailure = (data) => {
    return {
        type: LOGIN_FAILURE, payload: data

    }
}




//FETCH_PRODUCT_REQUEST
//FETCH_PRODUCT_FAILURE
//FETCH_PRODUCT_SUCCESS