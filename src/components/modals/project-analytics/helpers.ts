import { ChartData } from "chart.js";
import moment from "moment";
import { Todo } from "../../../shared/todo";
import { convertStringPoms } from "../../../shared/util";

export type TimeBucketType = 'weekly' | 'monthly';

export interface ProjectModalState {
    key: TimeBucketType,
    currentWeekIndex: number;
    currentMonthIndex: number;
}

export const calculateDisabledArrows = ({ 
    key, 
    currentMonthIndex, 
    currentWeekIndex }: ProjectModalState, 
    totalWeeks: number, 
    totalMonths: number) => {
    let disabledLeft = true;
    let disabledRight = true;
    if (key === 'weekly') {
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
  
    return { disabledLeft, disabledRight }
  }

  export const aggregateChartData = (
    todos: Todo[],
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