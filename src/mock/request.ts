import { Todo } from "./reducer";

export const datatodos: Todo[] = [
  { id: 1, text: "data1" },
  { id: 2, text: "data2" },
  { id: 3, text: "data3" },
  { id: 4, text: "data4" },
];

const fakeRequest = <T extends Todo | Todo[] | undefined>(time: number, data: T) =>
  new Promise<T>((resolve, reject) => {
    const timeout = data instanceof Array ? 800 : 200;
    if (time > timeout) {
      reject("timeout");
    }
    setTimeout(() => resolve(data), time);
  });

export const fetchAll = () => fakeRequest(datatodos.length * (Math.random() * 100), datatodos);

export const fetch = (id: number) => {
  const idx = datatodos.findIndex((todo) => (todo.id = id));
  const time = (idx + 1) * Math.random() * 10;
  return fakeRequest(time, datatodos[idx]);
};
