import { v4 as uuidv4 } from "uuid";
import { Due } from "./due.type";
import { Todo } from "./todo.interface";

export const padUrlWithHttp = (url: string) => {
  if (url.startsWith("http")) return url;
  return `http://${url}`;
};

const oneHalfOptions = [".5", "0.5", "1/2"];

export const prettifyPoms = (poms: string) => {
  return oneHalfOptions.includes(poms) ? "½" : poms;
};

export const convertStringPoms = (poms: string) => {
  if (oneHalfOptions.includes(poms)) return 0.5;
  return parseFloat(poms);
};

export const sortTodos = (a: Todo, b: Todo) => {
  if (a.done === b.done) {
    return convertStringPoms(a.poms) - convertStringPoms(b.poms);
  } else {
    return Number(a.done) - Number(b.done);
  }
};

export const convertMinutesToHours = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}:${remainingMinutes}`;
};

export const generateNewLink = () => ({ id: uuidv4(), url: "" });

export const templates: { [key: string]: () => Todo } = {
  "start-day": () => ({
    id: uuidv4(),
    name: "Start Day",
    poms: "0.5",
    links: [{ id: uuidv4(), url: "http://go/pwaivers:daily" }],
    due: Due.Today,
    done: false,
  }),
  "start-week": () => ({
    id: uuidv4(),
    name: "Start Week",
    poms: "1",
    links: [{ id: uuidv4(), url: "http://go/pwaivers:weekly" }],
    due: Due.Today,
    done: false,
  }),
};
export const generateNewTodo = (): Todo => ({
  id: uuidv4(),
  name: "",
  poms: "",
  links: [generateNewLink()],
  due: Due.Today,
  done: false,
});
