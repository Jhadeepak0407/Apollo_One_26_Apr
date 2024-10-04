import { FETCH_PRODUCT_FAILURE, FETCH_PRODUCT_REQUEST, FETCH_PRODUCT_SUCCESS } from "../constants/productConstants"

export const fetchProductRequest = () => {
    return {
        type: FETCH_PRODUCT_REQUEST
    }
}

export const FetchProductSuccess = (data) => {
    return {
        type: FETCH_PRODUCT_SUCCESS, payload: data
    }
}
export const FetchProductFailure = (data) => {
    return {
        type: FETCH_PRODUCT_FAILURE, payload: data

    }
}




//FETCH_PRODUCT_REQUEST
//FETCH_PRODUCT_FAILURE
//FETCH_PRODUCT_SUCCESS