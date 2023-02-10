import { AnyAction } from "redux";
import { ADD_TODO } from "./actionTypes";

function id(state: { id: number }[]) {
  return state.reduce((result, item) => (item.id > result ? item.id : result), 0) + 1;
}

export interface Todo {
  id: number;
  text: string;
}
export function addTodo(text: string): AnyAction {
  return { type: ADD_TODO, text };
}
export type TodoAction = { type: "ADD_TODO"; text: string } | AnyAction;

export function todos(state: Todo[] = [], action: TodoAction) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          id: id(state),
          text: action.text,
        },
      ];
    default:
      return state;
  }
}
