import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./rootReducer";
import rootSaga from "./rootSaga";
import devtoolsEnhancer from "redux-devtools-expo-dev-plugin";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false,serializableCheck:false }).concat(sagaMiddleware),
  devTools:false,
  enhancers:(getDefaultEnhancer)=>
    getDefaultEnhancer().concat(devtoolsEnhancer())
});

sagaMiddleware.run(rootSaga);

//////// without saga

// import { configureStore } from "@reduxjs/toolkit";
// import rootReducer from "./rootReducer";

// export const store = configureStore({
//   reducer: rootReducer,
// });