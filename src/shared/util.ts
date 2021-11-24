import { URL_PREFIX } from "./constants";
import { ID } from "./id.type";
import { Todo } from "./todo";
import json2csv from "json2csv";
import { Link } from "./link";
import { Item } from "./item";
import { Project } from "./project";
import { Template } from "./template";

export const padUrlWithHttp = (url: string) => {
  if (url.startsWith("http")) return url;
  return `${URL_PREFIX}${url}`;
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
  return parseFloat(poms) || 0;
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

interface ArrowSelectionInfo {
  currentItemListId?: number;
  nextItemUUID?: ID;
  previousItemUUID?: ID;
}

export const getItemIdInfoForArrowSelection = (
  items: Item[],
  selectedItemId: ID
): ArrowSelectionInfo => {
  return items.reduce((acc, curr, currentIndex) => {
    if (selectedItemId === curr.id) {
      acc.currentItemListId = currentIndex;
      acc.previousItemUUID = items[currentIndex - 1]?.id;
      acc.nextItemUUID = items[currentIndex + 1]?.id;
    }
    return acc;
  }, {} as ArrowSelectionInfo);
};

export function download(filename: string, text: string) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function createCSVContents(todos: Todo[]) {
  const mapLinkListToString = (links: Link[]): string =>
    links.map((link) => link.url).join(", ");

  return json2csv.parse(
    todos.map((todo) => ({ ...todo, links: mapLinkListToString(todo.links) }))
  );
}

export const canDeleteProject = (project: Project, todos: Todo[], templates: Template[]): boolean => {
  if (project.title.toLowerCase() === "none") return false;
  return !todos.some(({ projectId }) => projectId === project.id) 
        && !templates.some(({ projectId }) => projectId === project.id) 
};
