/* eslint-disable no-console */
import moment from "moment";
import { ChartData } from "chart.js";
import { Project } from "../../shared/project";
import { ID } from "../../shared/id.type";
import { Todo } from "../../shared/todo";
import { convertStringPoms, getDay } from "../../shared/util";

export enum Period {
  Weekly = "weekly",
  Monthly = "monthly",
}

export enum ReportType {
  PomsPerProject = "PomsPerProject",
  PomsPerDay = "PomsPerDay",
}

export interface ProjectAnalyticsState {
  period: Period;
  currentWeekIndex: number;
  currentMonthIndex: number;
  report: ReportType;
}

export const calculateDisabledArrows = (
  { period, currentMonthIndex, currentWeekIndex }: ProjectAnalyticsState,
  totalWeeks: number,
  totalMonths: number
) => {
  let disabledLeft = true;
  let disabledRight = true;
  if (period === Period.Weekly) {
    if (currentWeekIndex !== 0) {
      disabledLeft = false;
    }
    if (currentWeekIndex !== totalWeeks - 1) {
      disabledRight = false;
    }
  } else {
    if (currentMonthIndex !== 0) {
      disabledLeft = false;
    }
    if (currentMonthIndex !== totalMonths - 1) {
      disabledRight = false;
    }
  }

  return { disabledLeft, disabledRight };
};

const mapProjectIdToTitle = (projects: Project[]) => (projectId: ID) => {
  return projects.find(({ id }) => id === projectId)?.title || "No Project";
};

export const aggregatePomsByProjectChartData = (
  todos: Todo[],
  projects: Project[]
): ChartData<"pie", number[], string> => {
  const todoPomsByProject = todos.reduce(
    (acc, { projectId = "No Project", poms }) => {
      if (acc[projectId]) {
        acc[projectId] += convertStringPoms(poms);
      } else {
        acc[projectId] = convertStringPoms(poms);
      }
      return acc;
    },
    {
      "No Project": 0,
    } as Record<string, number>
  );

  return {
    datasets: [
      {
        backgroundColor: ["red", "blue", "pink", "orange", "green", "purple"],
        data: Object.values(todoPomsByProject),
      },
    ],
    labels: Object.keys(todoPomsByProject).map(mapProjectIdToTitle(projects)),
  };
};

export const aggregatePomsByDayChartData = (
  todos: Todo[]
): ChartData<"line", number[], string> => {
  const todoPomsByDay = todos.reduce((acc, { archivedDate, poms }) => {
    const day = getDay(archivedDate?.toString() || "") || "No Day";
    if (acc[day]) {
      acc[day] += convertStringPoms(poms);
    } else {
      acc[day] = convertStringPoms(poms);
    }
    return acc;
  }, {} as Record<string, number>);

  return {
    datasets: [
      {
        data: Object.values(todoPomsByDay),
        label: "Poms per day",
        borderColor: "tomato",
      },
    ],
    labels: Object.keys(todoPomsByDay),
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
  const monthlyBuckets = groupTodosByTimeBucket(todos, monthDisplay);
  const weeklyBuckets = groupTodosByTimeBucket(todos, weekDisplay);

  return {
    monthly: mapBucketObjToList(monthlyBuckets).sort(sortBucketsByDate),
    weekly: mapBucketObjToList(weeklyBuckets).sort(sortBucketsByDate),
  };
};
