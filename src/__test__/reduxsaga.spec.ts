import redux, { combineReducers, legacy_createStore as createStore, Store } from "redux";
import { selectReddit } from "../mock/saga/action";
import configureStore from "../mock/saga/configureStore";
import rootSaga from "../mock/saga/usingSaga";

describe("redux-saga", () => {
  const store = configureStore();
  store.runSaga(rootSaga);
  test("store", () => {
    store.dispatch(selectReddit("reactjs"));
    const posts = store.getState().postsByReddit;
    expect(posts).not.toBeUndefined();

    expect("reactjs" in posts).toBeTruthy();
    expect(posts.reactjs).not.toBeUndefined();
    const reactPosts = posts.reactjs;
    expect("items" in reactPosts).toBeTruthy();
    expect(reactPosts.items.length).not.toBe(0);
  });
});
