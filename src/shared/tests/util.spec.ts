/* eslint-disable no-magic-numbers */
import moment from "moment";
import { Due } from "../due.type";
import { Link } from "../link";
import { Project } from "../project";
import { Template } from "../template";
import { Todo } from "../todo";
import {
  cleanUrl,
  convertStringPoms,
  padZeros,
  prettifyPoms,
  truncateUrl,
  sumTodoPomodoros,
  sortTodos,
  convertMinutesToHours,
  getItemIdInfoForArrowSelection,
  createCSVContents,
  canDeleteProject,
  arrayMove,
  generateAllDaysForWeek,
  duplicateTodo,
} from "../util";

describe("util", () => {
  describe("cleanUrl", () => {
    it("should remove whitespace from the beginning and end of the url", () => {
      const urlWithWhitespace = " http://www.google.com  ";
      const result = cleanUrl(urlWithWhitespace);
      expect(result).toBe("http://www.google.com");
    });

    it("should add http:// at the beginning of the url if it wasn't already there", () => {
      const urlWithoutHTTPS = "www.google.com";
      const result = cleanUrl(urlWithoutHTTPS);
      expect(result).toBe("http://www.google.com");
    });
  });

  describe("padZeros", () => {
    it("should add zeros at the beginning of the string if it's only one digit", () => {
      const num = 1;
      const paddedNum = padZeros(num);
      expect(paddedNum).toBe("01");
    });

    it("should return the same string", () => {
      const num = "12";
      const paddedNum = padZeros(num);
      expect(paddedNum).toBe("12");
    });
  });

  describe("truncateUrl", () => {
    it("should replace http with empty string", () => {
      const shortUrl = "http://short.url";
      const truncatedUrl = truncateUrl(shortUrl);
      expect(truncatedUrl).toBe("short.url");
    });

    it("should should shorten the url to the length passed in plus ellipsis", () => {
      const shortUrl = "http://veryverylongurl.verylong/veryverylong";
      const urlLength = 20;
      const truncatedUrl = truncateUrl(shortUrl, urlLength);
      expect(truncatedUrl).toBe("veryverylongurl.very...");
    });
  });

  describe("prettifyPoms", () => {
    it("should leave the number as is if it is not a version of one half", () => {
      const poms = "5";
      const prettifiedPoms = prettifyPoms(poms);
      expect(prettifiedPoms).toBe(poms);
    });

    it("should change the string to ½", () => {
      const poms = "0.5";
      const prettifiedPoms = prettifyPoms(poms);
      expect(prettifiedPoms).toBe("½");
    });
  });

  describe("convertStringPoms", () => {
    it("should convert the string poms into a number", () => {
      const stringPoms = "5";
      const convertedPoms = convertStringPoms(stringPoms);
      expect(convertedPoms).toBe(5);
    });

    it("should convert the string poms into a number even for .5 shorthand", () => {
      const stringPoms = ".5";
      const convertedPoms = convertStringPoms(stringPoms);
      expect(convertedPoms).toBe(0.5);
    });
  });

  describe("sumTodoPomodoros", () => {
    it("should sum the poms of all the todo pomodoros in the list", () => {
      const todos: Todo[] = [
        {
          id: "123",
          name: "Laundry",
          done: false,
          due: Due.Today,
          poms: "0.5",
          links: [],
          projectId: "",
        },
        {
          id: "456",
          name: "Study",
          done: false,
          due: Due.Today,
          poms: "2",
          links: [],
          projectId: "",
        },
        {
          id: "789",
          name: "Gym",
          done: false,
          due: Due.Today,
          poms: "1",
          links: [],
          projectId: "",
        },
      ];
      const totalCompletePoms = todos.reduce(sumTodoPomodoros, 0);
      expect(totalCompletePoms).toBe(3.5);
    });
  });

  describe("sortTodos", () => {
    it("should sort the todos by done and poms", () => {
      const todos: Todo[] = [
        {
          id: "1",
          name: "Laundry",
          done: false,
          due: Due.Today,
          poms: "1",
          links: [],
          projectId: "",
        },
        {
          id: "2",
          name: "Study",
          done: true,
          due: Due.Today,
          poms: "2",
          links: [],
          projectId: "",
        },
        {
          id: "3",
          name: "Gym",
          done: true,
          due: Due.Today,
          poms: "1",
          links: [],
          projectId: "",
        },
        {
          id: "4",
          name: "Gym",
          done: false,
          due: Due.Today,
          poms: "0.5",
          links: [],
          projectId: "",
        },
      ];
      const sortedTodos = todos.sort(sortTodos);
      // done todos with the least poms are first
      expect(sortedTodos[0].id).toBe("4");
      expect(sortedTodos[1].id).toBe("1");
      expect(sortedTodos[2].id).toBe("3");
      expect(sortedTodos[3].id).toBe("2");
    });
  });

  describe("convertMinutesToHours", () => {
    it("should convert total minutes to a string of hours:remaining minutes", () => {
      const totalMinutes = 62;
      const convertedMinutes = convertMinutesToHours(totalMinutes);
      expect(convertedMinutes).toBe("1:02");
    });
  });

  describe("getItemIdInfoForArrowSelection", () => {
    it("should return the info bundled for the up/down arrow selection", () => {
      const todos: Todo[] = [
        {
          id: "1",
          name: "Laundry",
          done: false,
          due: Due.Today,
          poms: "1",
          links: [],
          projectId: "",
        },
        {
          id: "2",
          name: "Study",
          done: true,
          due: Due.Today,
          poms: "2",
          links: [],
          projectId: "",
        },
        {
          id: "3",
          name: "Gym",
          done: true,
          due: Due.Today,
          poms: "1",
          links: [],
          projectId: "",
        },
        {
          id: "4",
          name: "Gym",
          done: false,
          due: Due.Today,
          poms: "0.5",
          links: [],
          projectId: "",
        },
      ];
      const info = getItemIdInfoForArrowSelection(todos, "3");
      expect(info).toEqual({
        currentItemListId: 2,
        nextItemUUID: "4",
        previousItemUUID: "2",
      });
    });
  });

  describe("createCSVContents", () => {
    it("should create the CSV version of the todo list", () => {
      const todos: Todo[] = [
        {
          id: "123",
          name: "Laundry",
          done: false,
          due: Due.Today,
          poms: "0.5",
          links: [],
          projectId: "",
        },
        {
          id: "456",
          name: "Study",
          done: false,
          due: Due.Today,
          poms: "2",
          links: [],
          projectId: "",
        },
        {
          id: "789",
          name: "Gym",
          done: false,
          due: Due.Today,
          poms: "1",
          links: [],
          projectId: "",
        },
      ];
      const csvTodos = createCSVContents(todos);
      const expectedCsvTodos = `"id","name","done","due","poms","links","projectId"
"123","Laundry",false,"today","0.5","",""
"456","Study",false,"today","2","",""
"789","Gym",false,"today","1","",""`;
      expect(csvTodos).toEqual(expectedCsvTodos);
    });
  });

  describe("canDeleteProject", () => {
    it("should return false if the project title is 'None'", () => {
      const todos: Todo[] = [
        {
          id: "1",
          name: "Laundry",
          done: false,
          due: Due.Today,
          poms: "1",
          links: [],
          projectId: "1",
        },
      ];
      const project: Project = {
        id: "2",
        title: "None",
        description: "no project",
        link: new Link(),
      };
      const templates: Template[] = [];

      expect(canDeleteProject(project, todos, templates)).toBe(false);
    });

    it("should return false if one of the todos is still linked to that project", () => {
      const todos: Todo[] = [
        {
          id: "1",
          name: "Laundry",
          done: false,
          due: Due.Today,
          poms: "1",
          links: [],
          projectId: "2",
        },
      ];
      const project: Project = {
        id: "2",
        title: "Special Project",
        description: "special",
        link: new Link(),
      };
      const templates: Template[] = [];

      expect(canDeleteProject(project, todos, templates)).toBe(false);
    });

    it("should return false if one of the templates is still linked to that project", () => {
      const todos: Todo[] = [
        {
          id: "1",
          name: "Laundry",
          done: false,
          due: Due.Today,
          poms: "1",
          links: [],
          projectId: "2",
        },
      ];
      const project: Project = {
        id: "2",
        title: "Special Project",
        description: "special",
        link: new Link(),
      };
      const templates: Template[] = [
        {
          id: "3",
          templateTitle: "Special Template",
          projectId: "2",
          name: "New Special Todo",
          poms: "1",
          links: [],
          autofocus: true,
          group: "special group",
          done: false,
          due: Due.Today,
        },
      ];

      expect(canDeleteProject(project, todos, templates)).toBe(false);
    });

    it("should return true if nothing is linked to this project", () => {
      const todos: Todo[] = [
        {
          id: "1",
          name: "Laundry",
          done: false,
          due: Due.Today,
          poms: "1",
          links: [],
          projectId: "1",
        },
      ];
      const project: Project = {
        id: "2",
        title: "Special Project",
        description: "special",
        link: new Link(),
      };
      const templates: Template[] = [
        {
          id: "3",
          templateTitle: "Special Template",
          projectId: "4",
          name: "New Special Todo",
          poms: "1",
          links: [],
          autofocus: true,
          group: "special group",
          done: false,
          due: Due.Today,
        },
      ];

      expect(canDeleteProject(project, todos, templates)).toBe(true);
    });
  });

  describe("arrayMove", () => {
    it("should move the item to the index of the array", () => {
      const items = ["one", "two", "three", "four"];
      const newItems = arrayMove(items, 2, 1);
      expect(newItems).toEqual(["one", "three", "two", "four"]);
    });
  });

  describe("generateAllDaysForWeek", () => {
    it("should generate all the days of the week for that date", () => {
      const date = moment(new Date("2022-07-12T00:31:37.000Z")); // a Tuesday
      const days = generateAllDaysForWeek(date);
      expect(days[0].date()).toEqual(11);
      expect(days[1].date()).toEqual(12);
      expect(days[2].date()).toEqual(13);
      expect(days[3].date()).toEqual(14);
      expect(days[4].date()).toEqual(15);
    });
  });

  describe("duplicateTodo", () => {
    it("should return a new todo with a different id", () => {
      const originalTodo: Todo = {
        id: "1",
        name: "Laundry",
        done: false,
        due: Due.Today,
        poms: "1",
        links: [],
        projectId: "",
      };

      const duplicatedTodo = duplicateTodo(originalTodo);
      expect(duplicatedTodo.id).not.toBe("1");
      expect(duplicatedTodo.name).toBe("Laundry");
      expect(duplicatedTodo.poms).toBe("1");
    });
  });
});
