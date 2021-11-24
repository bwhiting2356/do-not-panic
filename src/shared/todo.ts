import { Due } from "./due.type";
import { ID } from "./id.type";
import { Item } from "./item";
import { Link } from "./link";

export class Todo extends Item {
  done: boolean;
  due: Due;
  archivedDate?: Date;

  constructor(
    public poms: string = "",
    public name: string = "",
    public links: Link[] = [new Link()],
    public projectId: ID = ""
  ) {
    super();
    this.due = Due.Today;
    this.done = false;
  }
}

// export enum TodoTemplates {
//   StartDay = "start-day",
//   StartWeek = "start-week",
// }

// export const templateGenerators: { [key in TodoTemplates]: () => Todo } = {
//   [TodoTemplates.StartDay]: () =>
//     new Todo("0.5", "Start Day", [new Link("http://go/pwaivers:daily")]),
//   [TodoTemplates.StartWeek]: () =>
//     new Todo("1", "Start Week", [new Link("http://go/pwaivers:weekly")]),
// };
