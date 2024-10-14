import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  LoginRequest,
  LoginSuccess,
  LoginFailure,
} from "../actions/loginActions";
import { loginApi } from "@/services/apis";
import AsyncStorage from "@react-native-async-storage/async-storage";

function* LoginSaga(action) {
  try {
    const { username, password, locationid } = action.payload;
    const response = yield call(loginApi, { username, password, locationid });

    if (response.error) {
      console.log("Some Error")
      console.log(response.error)
      yield put({ type: 'LOGIN_FAILURE', error: response.error });
    } else {
      // console.log("Some Success", response.data);
      const { token, userdetail } = response.data;

      console.log(userdetail)
      const user = {
        id: userdetail.tmsuid.trim(),
        token,
        usernametmslocation: userdetail.tmslocation.trim(),
        tmsuid: userdetail.tmsuid.trim(),
        tmsname: userdetail.tmsname.trim(),
        tmsdesignationname: userdetail.tmsdesignationname.trim(),
        tmsdepartmentid: userdetail.tmsdepartmentid.trim(),
        tmsdepartmentname: userdetail.tmsdepartmentname.trim(),
        tmsemployeelocationcode: userdetail.tmsemployeelocationcode.trim()
      }

      try {
        console.log("saving async");
        yield AsyncStorage.setItem("auth", JSON.stringify(user));
        console.log("saving async 2");
      } catch (error) {
        console.log("AIO = loginSaga.js => ERROR IN SAVING USER LOCALLY!");
      }

      yield put({ type: 'LOGIN_SUCCESS', payload: user });
    }
  } catch (error) {
    console.log(error);
    yield put({ type: 'LOGIN_FAILURE', error: 'An unexpected error occurred. Please try again.' });
  }
}
export default function* loginSagaWatcher() {
  yield takeLatest(LoginRequest().type, LoginSaga);
}


