import { ChartData } from "chart.js";
import moment from "moment";
import { URL_PREFIX } from "./constants";
import { ID } from "./id.type";
import { Todo } from "./todo";

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

export const weekDisplay = (date: Date) => {
  const momentObj = moment(date);
  const year = momentObj.year();
  const weekStart = momentObj.startOf("week").format("MMM Do");
  const weekEnd = momentObj.endOf("week").format("MMM Do");
  return `${weekStart} - ${weekEnd} ${year}`;
};

const monthDisplay = (date: Date) => {
  const momentObj = moment(date);
  const year = momentObj.year();
  const month = momentObj.format("MMM");
  return `${month} ${year}`;
};

interface TimeBucketGroup {
  timeDisplay: string;
  todos: Todo[];
}

interface GroupedTodos {
  weekly: TimeBucketGroup[];
  monthly: TimeBucketGroup[];
}

const sortBucketsByDate = (a: TimeBucketGroup, b: TimeBucketGroup) => {
  const aDate = new Date(a.todos[0].archivedDate as Date);
  const bDate = new Date(b.todos[0].archivedDate as Date);
  if (aDate === bDate) return 0;
  if (aDate > bDate) return 1;
  if (aDate < bDate) return -1;
  return 0;
};

const mapBucketObjToList = (weekBucketsObj: Record<string, Todo[]>) => {
  return Object.keys(weekBucketsObj).map((timeDisplay) => ({
    timeDisplay,
    todos: weekBucketsObj[timeDisplay],
  }));
};

const groupTodosByTimeBucket = (
  todos: Todo[],
  timeFunc: (d: Date) => string
) => {
  return todos.reduce((acc, curr) => {
    const { archivedDate } = curr;
    if (archivedDate) {
      const timeKey = timeFunc(archivedDate);
      if (acc[timeKey]) {
        acc[timeKey].push(curr);
      } else {
        acc[timeKey] = [curr];
      }
    }

    return acc;
  }, {} as Record<string, Todo[]>);
};

export const groupTodosByTimeDisplayBuckets = (todos: Todo[]): GroupedTodos => {
  const weeklyBuckets = groupTodosByTimeBucket(todos, weekDisplay);
  const monthlyBuckets = groupTodosByTimeBucket(todos, monthDisplay);

  return {
    weekly: mapBucketObjToList(weeklyBuckets).sort(sortBucketsByDate),
    monthly: mapBucketObjToList(monthlyBuckets).sort(sortBucketsByDate),
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
