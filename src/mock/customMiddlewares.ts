import { AnyAction, Dispatch, Middleware, MiddlewareAPI, StoreEnhancer, StoreEnhancerStoreCreator } from "redux";

export type MockMiddlewareFunc = {
  next: jest.Mock<AnyAction>;
  mockOuterFunc: jest.Mock<(next: Dispatch) => (action: AnyAction) => AnyAction>;
  mockNextFunc: jest.Mock<(action: AnyAction) => AnyAction>;
  mockActionFunc: jest.Mock<AnyAction>;
};

type SeperateMiddlewares = {
  first: MockMiddlewareFunc;
  second: MockMiddlewareFunc;
  third: MockMiddlewareFunc;
};
export const mockMiddleware: MockMiddlewareFunc = {
  next: jest.fn((action: AnyAction) => action),
  mockOuterFunc: jest.fn((api: MiddlewareAPI) => {
    return mockMiddleware.mockNextFunc;
  }),
  mockNextFunc: jest.fn((next: Dispatch<AnyAction>) => {
    return mockMiddleware.mockActionFunc;
  }),
  mockActionFunc: jest.fn((action: any) => {
    return mockMiddleware.next(action);
  }),
};
export const seperateMiddlewares: SeperateMiddlewares = {
  first: { ...mockMiddleware },
  second: { ...mockMiddleware },
  third: { ...mockMiddleware },
};

export const firstAction = (next: Dispatch) => (action: any) => next(action);
export const secondAction = (next: Dispatch) => (action: any) => next(action);
export const thirdAction = (next: Dispatch) => (action: any) => next(action);
export const middlewareFirst: Middleware =
  ({ getState, dispatch }) =>
  (next) =>
    firstAction(next);
export const middlewareSecond: Middleware =
  ({ getState, dispatch }) =>
  (next) =>
    secondAction(next);
export const middlewareThird: Middleware =
  ({ getState, dispatch }) =>
  (next) =>
    thirdAction(next);
const middlewareFourth: Middleware = ({ getState, dispatch }) => {
  console.log(
    `
      Fourth 
      getState, dispatch
      ------
      ${getState}
      ------
      ${dispatch}
      `
  );
  return (next) => {
    return (action) => {
      return next(action);
    };
  };
};
const middlewareFifth: Middleware = ({ getState, dispatch }) => {
  return (next) => {
    return (action) => {
      return next(action);
    };
  };
};

export const middlewares = [middlewareFirst, middlewareSecond, middlewareThird, middlewareFourth, middlewareFifth];
