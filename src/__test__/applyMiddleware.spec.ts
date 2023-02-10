import { Store, legacy_createStore as createStore, applyMiddleware, MiddlewareAPI, Dispatch, AnyAction, StoreEnhancer } from "redux";
import { addTodo, Todo, TodoAction, todos } from "../mock/reducer";
import * as reducer from "../mock/reducer";
import { createLogger } from "redux-logger";
import { middlewares, seperateMiddlewares, mockMiddleware as customMiddleware } from "../mock/customMiddlewares";
import { customApplyMiddleware } from "../mock/customApplyMiddleware";
import { ADD_TODO } from "../mock/actionTypes";

describe("applyMiddleware", () => {
  let store: null | Store<Todo[], TodoAction>;
  let mockMiddleware = customMiddleware;
  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });
  it("apply redux-logger middleware ", () => {
    const logger = createLogger();
    store = createStore(todos, applyMiddleware(logger));
    store.dispatch(addTodo("todo1"));
    expect(store.getState().find((todo) => todo.text === "todo1")).not.toBeNull();
  });

  it("apply custom Middleware", () => {
    if (!mockMiddleware) return;
    const { mockActionFunc, mockNextFunc, mockOuterFunc } = mockMiddleware;

    store = createStore(todos, applyMiddleware(mockOuterFunc));
    expect(mockOuterFunc).toBeCalled();
    expect(mockNextFunc).toBeCalled();
    expect(mockActionFunc).not.toBeCalled();
    store.dispatch(addTodo("todo1"));
    expect(mockActionFunc).toBeCalled();
    store.dispatch(addTodo("todo2"));

    expect(mockOuterFunc).toBeCalledTimes(1);
    expect(mockNextFunc).toBeCalledTimes(1);
    expect(mockActionFunc).toBeCalledTimes(2);
  });
  it("when called middleware", () => {
    const { first, second, third } = seperateMiddlewares;
    const spyAddTodo = jest.spyOn(reducer, "addTodo");
    const action = {
      text: "first Todo",
      type: ADD_TODO,
    };
    store = createStore(todos, applyMiddleware(first.mockOuterFunc, second.mockOuterFunc, third.mockOuterFunc));

    expect(first.mockOuterFunc).toReturnWith(first.mockNextFunc);
    expect(first.mockNextFunc).toReturnWith(first.mockActionFunc);
    expect(second.mockOuterFunc).toReturnWith(second.mockNextFunc);
    expect(second.mockNextFunc).toReturnWith(second.mockActionFunc);
    expect(third.mockOuterFunc).toReturnWith(third.mockNextFunc);
    expect(third.mockNextFunc).toReturnWith(third.mockActionFunc);
    store.dispatch(addTodo("first Todo"));
    expect(first.mockActionFunc).toReturnWith(action);
    expect(second.mockActionFunc).toReturnWith(action);
    expect(third.mockActionFunc).toReturnWith(action);
    expect(third.next).toReturnWith(action);
    expect(spyAddTodo).toBeCalledTimes(1);
  });
});
