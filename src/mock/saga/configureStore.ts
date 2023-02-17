import { applyMiddleware, legacy_createStore as createStore } from "redux";
import rootReducer from "./reducer";
import createSagaMiddleware from "redux-saga";

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  console.log(sagaMiddleware);
  return {
    ...createStore(rootReducer, applyMiddleware(sagaMiddleware)),
    runSaga: sagaMiddleware.run,
  };
}
