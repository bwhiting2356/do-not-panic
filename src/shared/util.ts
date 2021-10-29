import { Todo } from "./todo.interface";

export const padUrlWithHttp = (url: string) => {
  if (url.startsWith("http")) return url;
  return `http://${url}`;
};

export const prettifyPoms = (poms: string) => {
  return poms === "0.5" || poms === "1/2" ? "½" : poms;
};

export const sortTodos = (a: Todo, b: Todo) => {
  if (a.done === b.done) {
    return parseFloat(a.poms) - parseFloat(b.poms);
  } else {
    return Number(a.done) - Number(b.done);
  }
};
