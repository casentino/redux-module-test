import { AnyAction } from "redux";
import { FETCH_TODO, FETCH_TODOS } from "./actionTypes";
import { Todo } from "./reducer";

export const datatodos = [
  { id: 1, text: "data1" },
  { id: 2, text: "data2" },
  { id: 3, text: "data3" },
  { id: 4, text: "data4" },
];

export interface AsyncData {
  response?: Todo[] | Todo;
}

const initialState: AsyncData = {};

export const fetchTodos = () => ({ type: FETCH_TODOS });
export const fetchTodo = (id: number) => ({ type: FETCH_TODO, id });

type FetchTodosAction = ReturnType<typeof fetchTodos>;
type FetchTodoAction = ReturnType<typeof fetchTodo>;

export type AsyncDataAction = FetchTodosAction | FetchTodoAction;

export async function asyncReducer(state: AsyncData = initialState, action: AsyncDataAction) {
  switch (action.type) {
    case FETCH_TODOS:
      return {
        ...state,
        response: await fetchAll(),
      };
    case FETCH_TODO:
      return {
        ...state,
        response: fetch(action.id),
      };
    default:
      return state;
  }
}

function fetchAll() {
  return new Promise<Todo[]>((resolve, reject) => {
    setTimeout(() => {
      resolve(datatodos);
    }, 450);
  });
}
function fetch(id: number) {
  return new Promise<Todo | undefined>((resolve, reject) => {
    setTimeout(() => {
      const todo = datatodos.find((data) => data.id);
      resolve(todo);
    });
  });
}
