import { ChartData } from "chart.js";
import { v4 as uuidv4 } from "uuid";
import { Due } from "./due.type";
import { ID } from "./id.type";
import { Todo } from "./todo.interface";

export const padUrlWithHttp = (url: string) => {
  if (url.startsWith("http")) return url;
  return `http://${url}`;
};

export const padZeros = (str: string | number) => {
  let strNumber = typeof str === "string" ? str : String(str);
  if (strNumber.length === 1) return `0${strNumber}`;
  return strNumber;
};

export const truncateUrl = (str: string, length: number = 40) => {
  const removeHttp = str.replace(/http(s)?:\/\//, "");
  if (removeHttp.length < length) return removeHttp;
  return `${removeHttp.substring(length, 0)}...`;
};

const oneHalfOptions = [".5", "0.5", "1/2"];

export const prettifyPoms = (poms: string) => {
  return oneHalfOptions.includes(poms) ? "½" : poms;
};

export const sumTodoPomodoros = (acc: number, curr: Todo) => {
  acc += convertStringPoms(curr.poms) || 0;
  return acc;
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
  return `${hours}:${padZeros(remainingMinutes)}`;
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

export const computeChartData = (
  todos: Todo[]
): ChartData<"pie", number[], string> => {
  const todoPomsByProject = todos.reduce(
    (acc, { project = "No Project", poms }) => {
      if (acc[project]) {
        acc[project] += convertStringPoms(poms);
      } else {
        acc[project] = convertStringPoms(poms);
      }
      return acc;
    },
    {
      "No Project": 0,
    } as Record<string, number>
  );

  return {
    labels: Object.keys(todoPomsByProject),
    datasets: [
      {
        data: Object.values(todoPomsByProject),
        backgroundColor: ["red", "blue", "pink", "orange", "green", "purple"],
      },
    ],
  };
};

interface ArrowSelectionInfo {
  currentTodoListId?: number;
  nextTodoUUID?: ID;
  previousTodoUUID?: ID;
}

export const getTodoIdInfoForArrowSelection = (
  todos: Todo[],
  selectedTodoId: ID
): ArrowSelectionInfo => {
  return todos.reduce((acc, curr, currentIndex) => {
    if (selectedTodoId === curr.id) {
      acc.currentTodoListId = currentIndex;
      acc.previousTodoUUID = todos[currentIndex - 1]?.id;
      acc.nextTodoUUID = todos[currentIndex + 1]?.id;
    }
    return acc;
  }, {} as ArrowSelectionInfo);
};
