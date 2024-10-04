import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  fetchProductRequest,
  FetchProductSuccess,
  FetchProductFailure,
} from "../actions/productActions";
import { fetchProductAPI } from "@/apis/productApi";


function* FetchProductSaga() {
  try {
    const response = yield call(fetchProductAPI, 2, 3);
    //yield put(fetchCounterBSuccess(response.value));
    if (response?.products) {
      yield put(FetchProductSuccess(response?.products))
    }
    else {
      throw ("INVALID API DATA!");
    }
  }
  catch (e) {

    yield put(FetchProductFailure(e))

  }
}

export default function* ProductSagaWatcher() {
  yield takeLatest("FETCH_PRODUCT_REQUEST", FetchProductSaga);
}


