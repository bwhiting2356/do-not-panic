/* eslint-disable no-magic-numbers */
import moment, { Moment } from "moment";
import { createSelector } from "reselect";
import { RootState } from "../../app/store";
import { Period } from "../../shared/period";
import { Todo } from "../../shared/todo";
import { convertStringPoms, formatMomentDay } from "../../shared/util";
import {
  selectProjects,
  selectProjectsFilteredInArchive,
} from "../projects/selectors";
import { selectArchivedTodos } from "../todos/selectors";

const selectAnalyticsState = (state: RootState) => state.analytics.currentState;

export const selectPeriod = createSelector(
  [selectAnalyticsState],
  (state) => state.period
);

export const selectCurrentWeekIndex = createSelector(
  [selectAnalyticsState],
  (state) => state.currentWeekIndex
);

export const selectCurrentMonthIndex = createSelector(
  [selectAnalyticsState],
  (state) => state.currentMonthIndex
);

export const selectCurrenQuarterIndex = createSelector(
  [selectAnalyticsState],
  (state) => state.currentQuarterIndex
);

export const selectReport = createSelector(
  [selectAnalyticsState],
  (state) => state.report
);

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

const quarterDisplay = (date: Date) => {
  const momentObj = moment(date);
  const monthInt = momentObj.format("MM");
  const year = momentObj.format("YYYY");
  switch (monthInt) {
    case "01":
    case "02":
    case "03":
      return `1st Quarter, ${year}`;
      break;
    case "04":
    case "05":
    case "06":
      return `2nd Quarter, ${year}`;
    case "07":
    case "08":
    case "09":
      return `3rd Quarter, ${year}`;
    case "10":
    case "11":
    case "12":
      return `4th Quarter, ${year}`;
    default:
      return "";
  }
};

const mapBucketObjToList = (bucket: Record<string, Todo[]>) => {
  return Object.keys(bucket).map((timeDisplay) => ({
    timeDisplay,
    todos: bucket[timeDisplay],
  }));
};

interface TimeBucketGroup {
  timeDisplay: string;
  todos: Todo[];
}

const sortBucketsByDate = (a: TimeBucketGroup, b: TimeBucketGroup) => {
  const aDate = new Date(a.todos[0].archivedDate as Date);
  const bDate = new Date(b.todos[0].archivedDate as Date);
  if (aDate === bDate) return 0;
  if (aDate > bDate) return 1;
  if (aDate < bDate) return -1;
  return 0;
};

export const selectGroupedTodosByTimeBuckets = createSelector(
  [selectArchivedTodos],
  (todos) => {
    const monthlyBuckets = groupTodosByTimeBucket(todos, monthDisplay);
    const weeklyBuckets = groupTodosByTimeBucket(todos, weekDisplay);
    const quarterlyBuckets = groupTodosByTimeBucket(todos, quarterDisplay);

    return {
      monthly: mapBucketObjToList(monthlyBuckets).sort(sortBucketsByDate),
      weekly: mapBucketObjToList(weeklyBuckets).sort(sortBucketsByDate),
      quarterly: mapBucketObjToList(quarterlyBuckets).sort(sortBucketsByDate),
    };
  }
);

export const selectDisabledArrows = createSelector(
  [
    selectPeriod,
    selectCurrentWeekIndex,
    selectCurrentMonthIndex,
    selectCurrenQuarterIndex,
    selectGroupedTodosByTimeBuckets,
  ],
  (
    period,
    currentWeekIndex,
    currentMonthIndex,
    currentQuarterIndex,
    groupedTodos
  ) => {
    const totalWeeks = groupedTodos.weekly.length;
    const totalMonths = groupedTodos.monthly.length;
    const totalQuarters = groupedTodos.quarterly.length;
    let disabledLeft = true;
    let disabledRight = true;
    if (period === Period.Weekly) {
      if (currentWeekIndex !== 0) {
        disabledLeft = false;
      }
      if (currentWeekIndex !== totalWeeks - 1) {
        disabledRight = false;
      }
    } else if (period === Period.Monthly) {
      if (currentMonthIndex !== 0) {
        disabledLeft = false;
      }
      if (currentMonthIndex !== totalMonths - 1) {
        disabledRight = false;
      }
    } else {
      if (currentQuarterIndex !== 0) {
        disabledLeft = false;
      }
      if (currentQuarterIndex !== totalQuarters - 1) {
        disabledRight = false;
      }
    }

    return { disabledLeft, disabledRight };
  }
);

const sortXAxisValuesByDate = (
  a: { key: string; value: number },
  b: { key: string; value: number }
) => {
  const aDate = new Date(a.key);
  const bDate = new Date(b.key);
  if (aDate === bDate) return 0;
  if (aDate > bDate) return 1;
  if (aDate < bDate) return -1;
  return 0;
};

const groupTodosByProject = (todos: Todo[]) => {
  return todos.reduce(
    (acc, curr) => {
      const projectId = curr.projectId || "No Project";
      if (acc[projectId]) {
        acc[projectId].push(curr);
      } else {
        acc[projectId] = [curr];
      }
      return acc;
    },
    {
      "No Project": [],
    } as Record<string, Todo[]>
  );
};

export const selectCurrentTodoBucket = createSelector(
  [
    selectPeriod,
    selectGroupedTodosByTimeBuckets,
    selectCurrentWeekIndex,
    selectCurrentMonthIndex,
    selectCurrenQuarterIndex,
  ],
  (
    period,
    groupedTodos,
    currentWeekIndex,
    currentMonthIndex,
    currentQuarterIndex
  ) => {
    if (period === Period.Weekly) {
      return groupedTodos.weekly[currentWeekIndex];
    } else if (period === Period.Monthly) {
      return groupedTodos.monthly[currentMonthIndex];
    } else if (period === Period.Quarterly) {
      return groupedTodos.quarterly[currentQuarterIndex];
    }
  }
);
export const selectTimePeriodDescription = createSelector(
  [selectCurrentTodoBucket],
  (currentTodoBucket) => {
    return currentTodoBucket?.timeDisplay || "";
  }
);

const generateAllDaysForWeek = (date: string | Moment | Date) => {
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

const filterOnlyDaysInMonth = (dateList: Moment[], month: number) => {
  return dateList.filter((date) => {
    return moment(date).month() === month;
  });
};

const generateAllDaysForMonth = (date: string | Date | Moment) => {
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

const generateAllDaysForQuarter = (date: string | Date) => {
  const currentMonth = moment(date).format("MM");
  switch (currentMonth) {
    case "01":
    case "02":
    case "03":
      const jan = moment(date);
      jan.set({
        month: 0,
      });
      const janDays = generateAllDaysForMonth(jan);
      const feb = moment(date);
      feb.set({
        month: 1,
      });
      const febDays = generateAllDaysForMonth(feb);
      const march = moment(date);
      march.set({
        month: 2,
      });
      const marchDays = generateAllDaysForMonth(march);
      return [...janDays, ...febDays, ...marchDays];
      break;
    case "04":
    case "05":
    case "06":
      const april = moment(date);
      april.set({
        month: 3,
      });
      const aprilDays = generateAllDaysForMonth(april);
      const may = moment(date);
      may.set({
        month: 4,
      });
      const mayDays = generateAllDaysForMonth(may);
      const june = moment(date);
      june.set({
        month: 5,
      });
      const juneDays = generateAllDaysForMonth(june);
      return [...aprilDays, ...mayDays, ...juneDays];
    case "07":
    case "08":
    case "09":
      const july = moment(date);
      july.set({
        month: 6,
      });
      const julyDays = generateAllDaysForMonth(july);
      const august = moment(date);
      august.set({
        month: 7,
      });
      const augustDays = generateAllDaysForMonth(august);
      const sept = moment(date);
      sept.set({
        month: 8,
      });
      const septDays = generateAllDaysForMonth(sept);
      return [...julyDays, ...augustDays, ...septDays];
    case "10":
    case "11":
    case "12":
    default:
      const oct = moment(date);
      oct.set({
        month: 9,
      });
      const octDays = generateAllDaysForMonth(oct);
      const nov = moment(date);
      nov.set({
        month: 10,
      });
      const novDays = generateAllDaysForMonth(nov);
      const dec = moment(date);
      dec.set({
        month: 11,
      });
      const decDays = generateAllDaysForMonth(dec);
      return [...octDays, ...novDays, ...decDays];
  }
};

export const generateAllDaysForPeriod = (date: string, period: Period) => {
  if (period === Period.Weekly) {
    return generateAllDaysForWeek(date).map(formatMomentDay);
  } else if (period === Period.Monthly) {
    return generateAllDaysForMonth(date).map(formatMomentDay);
  } else {
    return generateAllDaysForQuarter(date).map(formatMomentDay);
  }
};

export const selectAllDaysForPeriod = createSelector(
  [selectPeriod, selectCurrentTodoBucket],
  (period, currentTodoBucket) => {
    const date = currentTodoBucket?.todos[0].archivedDate || new Date();
    if (period === Period.Weekly) {
      return generateAllDaysForWeek(date).map(formatMomentDay);
    } else if (period === Period.Monthly) {
      return generateAllDaysForMonth(date).map(formatMomentDay);
    } else {
      return generateAllDaysForQuarter(date).map(formatMomentDay);
    }
  }
);

export const selectPomsByDayChartDataStacked = createSelector(
  [selectCurrentTodoBucket, selectProjects, selectAllDaysForPeriod],
  (currentTodoBucket, projects, allDaysForPeriod) => {
    const todos = currentTodoBucket?.todos || [];
    const defaultDaysMap = allDaysForPeriod.reduce((acc, curr) => {
      acc[curr] = 0;
      return acc;
    }, {} as Record<string, number>);

    const todoPomsByProject = groupTodosByProject(todos);
    const todoPomsByProjectAndDay = Object.keys(todoPomsByProject).reduce(
      (projectAcc, currentProjectId) => {
        const { title = "No Project", color = "black" } =
          projects.find((project) => project.id === currentProjectId) || {};
        const projectTodos = todoPomsByProject[currentProjectId];

        const todoPomsByDay = projectTodos.reduce(
          (todoAcc, { archivedDate, poms }) => {
            const day =
              formatMomentDay(archivedDate?.toString() || "") || "No Day";
            todoAcc[day] += convertStringPoms(poms);
            return todoAcc;
          },
          {
            ...defaultDaysMap,
          } as Record<string, number>
        );

        const sortedTodoPomsByDay = Object.keys(todoPomsByDay)
          .map((key) => {
            return {
              key,
              value: todoPomsByDay[key] || 0,
            };
          })
          .sort(sortXAxisValuesByDate);

        const data = sortedTodoPomsByDay.map((obj) => obj.value);

        projectAcc[title] = {
          data,
          label: title,
          backgroundColor: color,
          fill: true,
        };
        return projectAcc;
      },
      {} as Record<
        string,
        {
          data: number[];
          label: string;
          backgroundColor: string;
          fill: boolean;
        }
      >
    );

    const datasets = Object.values(todoPomsByProjectAndDay);

    return {
      labels: allDaysForPeriod,
      datasets,
    };
  }
);

export const selectPomsByProject = createSelector(
  [selectCurrentTodoBucket, selectProjects],
  (currentTodoBucket, projects) => {
    const todoPomsByProject =
      currentTodoBucket?.todos?.reduce(
        (acc, { projectId = "No Project", poms }) => {
          const { title = "No Project" } =
            projects.find((project) => project.id === projectId) || {};
          if (acc[title]) {
            acc[title] += convertStringPoms(poms);
          } else {
            acc[title] = convertStringPoms(poms);
          }
          return acc;
        },
        {
          "No Project": 0,
        } as Record<string, number>
      ) || {};

    const labels = Object.keys(todoPomsByProject);
    const data = Object.values(todoPomsByProject);
    const backgroundColor = labels.map((title) => {
      return (
        projects.find((project) => project.title === title)?.color || "black"
      );
    });

    return {
      datasets: [
        {
          backgroundColor,
          data,
        },
      ],
      labels,
    };
  }
);

const sortTodosByDateDescending = (a: Todo, b: Todo) => {
  const aDate = new Date(a.archivedDate as Date);
  const bDate = new Date(b.archivedDate as Date);
  if (aDate === bDate) return 0;
  if (aDate < bDate) return 1;
  if (aDate > bDate) return -1;
  return 0;
};

export const selectTodosFilteredInArchive = createSelector(
  [selectCurrentTodoBucket, selectProjectsFilteredInArchive],
  (currentTodoBucket, projectIds) => {
    const filteredArchivedTodos =
      currentTodoBucket?.todos.filter((todo) =>
        projectIds.includes(todo.projectId)
      ) || [];
    filteredArchivedTodos.sort(sortTodosByDateDescending);
    return filteredArchivedTodos;
  }
);
