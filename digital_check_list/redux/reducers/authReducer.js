//import { GETPRODUCT_p } from "../constants/getproduct";
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from "../constants/userConstants";


const initialState = {
  user: {
    id: null,
    token: null,
    usernametmslocation: null,
    tmsuid: null,
    tmsname: null,
    tmsdesignationname: null,
    tmsdepartmentid: null,
    tmsdepartmentname: null,
    tmsemployeelocationcode: null
  },
  loading: false,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST": return { ...state, loading: true }
    case "LOGIN_SUCCESS": {
      return {
        ...state, loading: false, user: action.payload
      }
    }
    case "LOGIN_FAILURE": return { ...state, loading: false, error: action.payload }
    default:
      return state;
  }
};

export default authReducer;