/* eslint-disable no-magic-numbers */
import { Due } from "../../../shared/due.type";
import { Period } from "../../../shared/period";
import { ReportType } from "../../../shared/report-type";
import { Todo } from "../../../shared/todo";
import { AnalyticsState } from "../analyticsSlice";
import {
  selectCurrentMonthIndex,
  selectCurrentWeekIndex,
  selectCurrentQuarterIndex,
  selectPeriod,
  selectReport,
  groupArchivedTodosByTimeBucket,
  weekDisplay,
  monthDisplay,
  quarterDisplay,
  selectGroupedTodosByTimeBuckets,
  selectDisabledArrows,
  GroupedTodos,
  selectCurrentIndexes,
  selectCurrentIndexForPeriod,
  selectTotalBucketsForPeriod,
} from "../selectors";

const july11th = new Date("2022-07-11T00:31:37.000Z");
const july12th = new Date("2022-07-12T00:31:37.000Z");
const july18th = new Date("2022-07-18T00:31:37.000Z");
const july19th = new Date("2022-07-18T00:31:37.000Z");

describe("selectors", () => {
  describe("selectPeriod", () => {
    it("should return the period", () => {
      const initialState: AnalyticsState = {
        period: Period.Weekly,
        currentMonthIndex: 0,
        currentQuarterIndex: 1,
        currentWeekIndex: 2,
        report: ReportType.PomsPerDay,
      };
      const result = selectPeriod.resultFunc(initialState);
      expect(result).toBe(Period.Weekly);
    });
  });
  describe("selectCurrentWeekIndex", () => {
    it("should return the current week index", () => {
      const initialState: AnalyticsState = {
        period: Period.Weekly,
        currentMonthIndex: 0,
        currentQuarterIndex: 1,
        currentWeekIndex: 2,
        report: ReportType.PomsPerDay,
      };
      const result = selectCurrentWeekIndex.resultFunc(initialState);
      expect(result).toBe(2);
    });
  });

  describe("selectCurrentMonthIndex", () => {
    it("should return the current month index", () => {
      const initialState: AnalyticsState = {
        period: Period.Weekly,
        currentMonthIndex: 0,
        currentQuarterIndex: 1,
        currentWeekIndex: 2,
        report: ReportType.PomsPerDay,
      };
      const result = selectCurrentMonthIndex.resultFunc(initialState);
      expect(result).toBe(0);
    });
  });

  describe("selectCurrentQuarterIndex", () => {
    it("should return the current quarter index", () => {
      const initialState: AnalyticsState = {
        period: Period.Weekly,
        currentMonthIndex: 0,
        currentQuarterIndex: 1,
        currentWeekIndex: 2,
        report: ReportType.PomsPerDay,
      };
      const result = selectCurrentQuarterIndex.resultFunc(initialState);
      expect(result).toBe(1);
    });
  });

  describe("selectReport", () => {
    it("should return the report", () => {
      const initialState: AnalyticsState = {
        period: Period.Weekly,
        currentMonthIndex: 0,
        currentQuarterIndex: 1,
        currentWeekIndex: 2,
        report: ReportType.PomsPerDay,
      };
      const result = selectReport.resultFunc(initialState);
      expect(result).toBe(ReportType.PomsPerDay);
    });
  });

  describe("weekDisplay", () => {
    it("should generate a human readably description of the week this date is in", () => {
      const date = new Date("2022-07-11T00:31:37.000Z");
      const display = weekDisplay(date);
      expect(display).toBe("Jul 10th - Jul 16th 2022");
    });
  });

  describe("monthDisplay", () => {
    it("should generate a human readably description of the month this date is in", () => {
      const date = new Date("2022-07-11T00:31:37.000Z");
      const display = monthDisplay(date);
      expect(display).toBe("Jul 2022");
    });
  });

  describe("quarterDisplay", () => {
    it("should generate a human readably description of the quarter this date is in", () => {
      const date = new Date("2022-07-11T00:31:37.000Z");
      const display = quarterDisplay(date);
      expect(display).toBe("3rd Quarter, 2022");
    });
  });

  describe("groupArchivedTodosByTimeBucket", () => {
    it("should group the todos by the time function passed in", () => {
      const archivedTodos: Todo[] = [
        {
          id: "1",
          name: "Laundry",
          done: false,
          due: Due.Today,
          poms: "0.5",
          links: [],
          projectId: "",
          archivedDate: july11th,
        },
        {
          id: "2",
          name: "Study",
          done: false,
          due: Due.Today,
          poms: "2",
          links: [],
          projectId: "",
          archivedDate: july12th,
        },
        {
          id: "3",
          name: "Gym",
          done: false,
          due: Due.Today,
          poms: "1",
          links: [],
          projectId: "",
          archivedDate: july18th,
        },
        {
          id: "4",
          name: "Learn",
          done: false,
          due: Due.Today,
          poms: "1",
          links: [],
          projectId: "",
          archivedDate: july19th,
        },
      ];
      const groupedTodos = groupArchivedTodosByTimeBucket(
        archivedTodos,
        weekDisplay
      );
      expect(groupedTodos["Jul 10th - Jul 16th 2022"].length).toBe(2);
      expect(groupedTodos["Jul 17th - Jul 23rd 2022"].length).toBe(2);
    });
  });

  describe("selectGroupedTodosByTimeBuckets", () => {
    it("should group the todos by weekly, monthly, quarterly buckets", () => {
      const archivedTodos: Todo[] = [
        {
          id: "1",
          name: "Laundry",
          done: false,
          due: Due.Today,
          poms: "0.5",
          links: [],
          projectId: "",
          archivedDate: july11th,
        },
        {
          id: "2",
          name: "Study",
          done: false,
          due: Due.Today,
          poms: "2",
          links: [],
          projectId: "",
          archivedDate: july12th,
        },
        {
          id: "3",
          name: "Gym",
          done: false,
          due: Due.Today,
          poms: "1",
          links: [],
          projectId: "",
          archivedDate: july18th,
        },
        {
          id: "4",
          name: "Learn",
          done: false,
          due: Due.Today,
          poms: "1",
          links: [],
          projectId: "",
          archivedDate: july19th,
        },
      ];
      const result = selectGroupedTodosByTimeBuckets.resultFunc(archivedTodos);
      expect(result.quarterly.length).toBe(1);
      expect(result.monthly.length).toBe(1);
      expect(result.weekly.length).toBe(2);
      expect(result.weekly[0]).toEqual({
        timeDisplay: "Jul 10th - Jul 16th 2022",
        todos: [
          {
            id: "1",
            name: "Laundry",
            done: false,
            due: Due.Today,
            poms: "0.5",
            links: [],
            projectId: "",
            archivedDate: july11th,
          },
          {
            id: "2",
            name: "Study",
            done: false,
            due: Due.Today,
            poms: "2",
            links: [],
            projectId: "",
            archivedDate: july12th,
          },
        ],
      });
    });
  });

  describe("selectCurrentIndexes", () => {
    it("should return the current indexes packaged in an object", () => {
      const currentWeekIndex = 0;
      const currentMonthIndex = 1;
      const currentQuarterIndex = 2;
      const result = selectCurrentIndexes.resultFunc(
        currentWeekIndex,
        currentMonthIndex,
        currentQuarterIndex
      );
      expect(result).toEqual({
        [Period.Weekly]: currentWeekIndex,
        [Period.Monthly]: currentMonthIndex,
        [Period.Quarterly]: currentQuarterIndex,
      });
    });
  });

  describe("selectCurrentIndexForPeriod", () => {
    it("should return the current index for the period passed in", () => {
      const currentWeekIndex = 0;
      const currentMonthIndex = 1;
      const currentQuarterIndex = 2;
      const currentIndexes = {
        [Period.Weekly]: currentWeekIndex,
        [Period.Monthly]: currentMonthIndex,
        [Period.Quarterly]: currentQuarterIndex,
      };
      const currentPeriod = Period.Weekly;
      const result = selectCurrentIndexForPeriod.resultFunc(
        currentIndexes,
        currentPeriod
      );
      expect(result).toBe(currentWeekIndex);
    });
  });

  describe("selectTotalBucketsForPeriod", () => {
    it("should return the total number for buckets in that period", () => {
      const currentBuckets: GroupedTodos = {
        [Period.Weekly]: [
          {
            timeDisplay: "Jul 10th - Jul 16th 2022",
            todos: [
              {
                id: "1",
                name: "Laundry",
                done: false,
                due: Due.Today,
                poms: "0.5",
                links: [],
                projectId: "",
                archivedDate: july11th,
              },
              {
                id: "2",
                name: "Study",
                done: false,
                due: Due.Today,
                poms: "2",
                links: [],
                projectId: "",
                archivedDate: july12th,
              },
            ],
          },
        ],
        [Period.Monthly]: [],
        [Period.Quarterly]: [],
      };
      const currentPeriod = Period.Weekly;
      const result = selectTotalBucketsForPeriod.resultFunc(
        currentBuckets,
        currentPeriod
      );
      expect(result).toBe(1);
    });
  });

  describe("selectDisabledArrows", () => {
    it("should make the left arrow disabled if index for the current period is 0", () => {
      const currentIndexForPeriod = 0;
      const totalBucketsForPeriod = 5;
      const result = selectDisabledArrows.resultFunc(
        currentIndexForPeriod,
        totalBucketsForPeriod
      );
      expect(result.disabledLeft).toBeTruthy();
    });

    it("should make the left arrow enabled if index for the current period is greater than 0", () => {
      const currentIndexForPeriod = 1;
      const totalBucketsForPeriod = 5;
      const result = selectDisabledArrows.resultFunc(
        currentIndexForPeriod,
        totalBucketsForPeriod
      );
      expect(result.disabledLeft).toBeFalsy();
    });

    it("should make the right arrow disabled if index for the current period is the same as the total length minus 1", () => {
      const currentIndexForPeriod = 4;
      const totalBucketsForPeriod = 5;
      const result = selectDisabledArrows.resultFunc(
        currentIndexForPeriod,
        totalBucketsForPeriod
      );
      expect(result.disabledRight).toBeTruthy();
    });

    it("should make the right arrow enabled if index for the current period is less than same as the total length minus 1", () => {
      const currentIndexForPeriod = 3;
      const totalBucketsForPeriod = 5;
      const result = selectDisabledArrows.resultFunc(
        currentIndexForPeriod,
        totalBucketsForPeriod
      );
      expect(result.disabledRight).toBeFalsy();
    });
  });
});
