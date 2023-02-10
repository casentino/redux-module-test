/// <references path="../../node_modules/@types//redux-logger" />
import { applyMiddleware, legacy_createStore as createStore, Middleware, Store } from "redux";
import { addTodo, Todo, TodoAction, todos } from "../mock/reducer";
import { createLogger } from "redux-logger";
import { middlewares } from "../mock/customMiddlewares";
import { ADD_TODO } from "../mock/actionTypes";

var $$observable = (function () {
  return (typeof Symbol === "function" && Symbol.observable) || "@@observable";
})();
describe("CreateStore test", () => {
  let store: null | Store<Todo[], TodoAction>;
  beforeEach(() => {
    const logger = createLogger() as Middleware;
    store = createStore(todos);
  });
  test("some", () => {
    const input = [
      { id: 1, url: "https://www.url1.dev" },
      { id: 2, url: "https://www.url2.dev" },
      { id: 3, url: "https://www.link3.dev" },
    ];

    const output = [{ id: 3, url: "https://www.link3.dev" }];
    expect(input.filter((v) => v.id === 3)).toEqual(output);
  });
  test("createStore initialize", () => {
    if (!store) return;
    const methods = Object.keys(store).filter((key) => key !== $$observable);

    expect(methods).toContain("dispatch");
    expect(methods).toContain("getState");
    expect(methods).toContain("subscribe");
    expect(methods).toContain("replaceReducer");
  });
  test("store dispatch", () => {
    if (!store) return;

    console.log("dispatch", store.dispatch);
    store.dispatch(addTodo("todo1"));

    expect(store.getState()[0].text).toBe("todo1");
  });
  test("store subscirbe", () => {
    if (!store) return;

    const { subscribe } = store;
    const subsFunc = jest.fn(() => () => {
      if (!store) return;
      const todos = store.getState();
      expect(todos.length).toBe(1);
      expect(todos[0].text).toContainEqual("todo3");
    });
    const unsubscirbe = subscribe(subsFunc);
    const action = store.dispatch(addTodo("todo3"));
    expect(action.type).toBe(ADD_TODO);
    unsubscirbe();
    store.dispatch(addTodo("todo1"));
    expect(subsFunc).toBeCalledTimes(1);

    expect(store.getState().length).toBe(2);
  });
});
