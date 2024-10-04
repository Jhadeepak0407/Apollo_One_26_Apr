import { combineReducers } from "redux";

import productReducer from "./reducers/productReducer";
import authReducer from "./reducers/authReducer"; // Correct name here

const rootReducer = combineReducers({
  counterB: productReducer, // Keep the naming consistent for products
  login: authReducer, // Use authReducer here instead of loginReducer
});

export default rootReducer;
