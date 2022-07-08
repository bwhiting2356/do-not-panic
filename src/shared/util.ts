/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
import json2csv from "json2csv";
import moment, { Moment } from "moment";
import {
  SECONDS_PER_MINUTE,
  URL_PREFIX,
  URL_TRUNCATE_LENGTH,
} from "./constants";
import { ID } from "./id.type";
import { Todo } from "./todo";
import { Link } from "./link";
import { Item } from "./item";
import { Project } from "./project";
import { Template } from "./template";
import { Period } from "./period";
import { RootState } from "../app/store";

export const padUrlWithHttp = (url: string) => {
  if (url.startsWith("http")) return url;
  return `${URL_PREFIX}${url}`;
};

export const padZeros = (str: string | number) => {
  const strNumber = typeof str === "string" ? str : String(str);
  if (strNumber.length === 1) return `0${strNumber}`;
  return strNumber;
};

export const truncateUrl = (str: string, length = URL_TRUNCATE_LENGTH) => {
  const removeHttp = str.replace(/http(s)?:\/\//, "");
  if (removeHttp.length < length) return removeHttp;
  return `${removeHttp.substring(length, 0)}...`;
};

const oneHalfOptions = new Set([".5", "0.5", "1/2"]);

export const prettifyPoms = (poms: string) => {
  return oneHalfOptions.has(poms) ? "½" : poms;
};

export const convertStringPoms = (poms: string) => {
  if (oneHalfOptions.has(poms)) return 0.5;
  return parseFloat(poms) || 0;
};

export const sumTodoPomodoros = (acc: number, curr: Todo) => {
  return acc + convertStringPoms(curr.poms) || 0;
};

export const sortTodos = (a: Todo, b: Todo) => {
  if (a.done === b.done) {
    return convertStringPoms(a.poms) - convertStringPoms(b.poms);
  } else {
    return Number(a.done) - Number(b.done);
  }
};

export const convertMinutesToHours = (minutes: number) => {
  const hours = Math.floor(minutes / SECONDS_PER_MINUTE);
  const remainingMinutes = minutes % SECONDS_PER_MINUTE;
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
  const element = document.createElement("a");
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

export const canDeleteProject = (
  project: Project,
  todos: Todo[],
  templates: Template[]
): boolean => {
  if (project.title.toLowerCase() === "none") return false;
  return (
    !todos.some(({ projectId }) => projectId === project.id) &&
    !templates.some(({ projectId }) => projectId === project.id)
  );
};

export const arrayMove = <T>(
  arr: T[],
  fromIndex: number,
  toIndex: number
): T[] => {
  const arrayCopy = arr.slice();
  const element = arrayCopy[fromIndex];
  arrayCopy.splice(fromIndex, 1);
  arrayCopy.splice(toIndex, 0, element);
  return arrayCopy;
};

const generateAllDaysForWeek = (date: string | Moment) => {
  const dayOfWeek = moment(date).day();
  const mondayOfWeek = moment(date).subtract(dayOfWeek - 1, "d");
  const tuesdayOfWeek = moment(mondayOfWeek).add(1, "d");
  const wednesdayOfWeek = moment(mondayOfWeek).add(2, "d");
  const thursdayOfWeek = moment(mondayOfWeek).add(3, "d");
  const fridayOfWeek = moment(mondayOfWeek).add(4, "d");
  return [
    mondayOfWeek,
    tuesdayOfWeek,
    wednesdayOfWeek,
    thursdayOfWeek,
    fridayOfWeek,
  ];
};
export const MOMENT_FORMAT = "ddd MMMM Do, YY";
export const formatMomentDay = (m: Moment | string) =>
  moment(m).format(MOMENT_FORMAT);

const filterOnlyDaysInMonth = (dateList: Moment[], month: number) => {
  return dateList.filter((date) => {
    return moment(date).month() === month;
  });
};

const generateAllDaysForMonth = (date: string) => {
  const dayOfMonth = moment(date).date();
  const firstDayOfMonth = moment(date).subtract(dayOfMonth, "d");
  const oneWeekAfter = moment(firstDayOfMonth).add(7, "d");
  const twoWeeksAfter = moment(firstDayOfMonth).add(14, "d");
  const threeWeeksAfter = moment(firstDayOfMonth).add(21, "d");
  const fourWeeksAfter = moment(firstDayOfMonth).add(28, "d");

  const allDays = [
    ...generateAllDaysForWeek(firstDayOfMonth),
    ...generateAllDaysForWeek(oneWeekAfter),
    ...generateAllDaysForWeek(twoWeeksAfter),
    ...generateAllDaysForWeek(threeWeeksAfter),
    ...generateAllDaysForWeek(fourWeeksAfter),
  ];
  return filterOnlyDaysInMonth(allDays, moment(date).month());
};

export const generateAllDaysForPeriod = (date: string, period: Period) => {
  if (period === Period.Weekly) {
    return generateAllDaysForWeek(date).map(formatMomentDay);
  } else if (period === Period.Monthly) {
    return generateAllDaysForMonth(date).map(formatMomentDay);
  } else {
    return generateAllDaysForMonth(date).map(formatMomentDay);
  }
};

// eslint-disable-next-line no-empty-function
export const noOp = () => {};

export const downloadBackupFromState = (state: RootState) => {
  const time = moment().format(`${MOMENT_FORMAT}, h:mm:ss a`);
  download(`backup-${time}.json`, JSON.stringify(state));
  const { todos } = state.todos.currentState;
  if (todos.length) {
    download(`todos-${time}.csv`, createCSVContents(todos));
  }
};
