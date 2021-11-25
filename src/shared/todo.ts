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
