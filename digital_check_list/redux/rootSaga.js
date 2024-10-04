import { all } from "redux-saga/effects";

import ProductSagaWatcher from "./sagas/productSaga";
import loginSagaWatcher from "./sagas/loginSaga";
export default function* rootSaga() {
  yield all([loginSagaWatcher()],[ ProductSagaWatcher()]);
}


