import { AnyAction, compose, Dispatch, Middleware, PreloadedState, Reducer, Store, StoreCreator } from "redux";

type Param = [reducer: Reducer<any, AnyAction>, preloadedState?: PreloadedState<any>];
export function customApplyMiddleware(middlewares: Middleware[], steps?: (...args: any[]) => void) {
  return (createStore: StoreCreator) => {
    return (...args: Param): Store => {
      const store = createStore(...args);
      const middlewareAPI = {
        getState: store.getState,
        dispatch: () => {
          throw Error;
        },
      };
      if (steps) {
        steps("middlewares", middlewares);
      }
      const chain = middlewares.map((middleware) => middleware(middlewareAPI));
      if (steps) {
        steps("chain", chain);
      }
      const returnCompose = compose<any>(...chain);
      if (steps) {
        steps("return compose", returnCompose);
      }
      const dispatch: Dispatch<AnyAction> = returnCompose(store.dispatch);
      if (steps) {
        steps("dispatch", dispatch);
      }
      return {
        ...store,
        dispatch,
      };
    };
  };
}
