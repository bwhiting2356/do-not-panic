import { v4 as uuidv4 } from "uuid";
import { Due } from "./due.type";
import { ID } from "./id.type";
import { Link } from "./link";

export class Todo {
  id: ID;
  done: boolean;
  due: Due;
  project?: string;
  archivedDate?: Date;

  constructor(
    public poms: string = "",
    public name: string = "",
    public links: Link[] = [new Link()]
  ) {
    this.id = uuidv4();
    this.due = Due.Today;
    this.done = false;
  }
}

export enum TodoTemplates {
  StartDay = "start-day",
  StartWeek = "start-week",
}

export const templateGenerators: { [key in TodoTemplates]: () => Todo } = {
  [TodoTemplates.StartDay]: () =>
    new Todo("0.5", "Start Day", [new Link("http://go/pwaivers:daily")]),
  [TodoTemplates.StartWeek]: () =>
    new Todo("1", "Start Week", [new Link("http://go/pwaivers:weekly")]),
};
