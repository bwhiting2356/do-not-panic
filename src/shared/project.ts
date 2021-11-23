import { Link } from "./link";
import { Item } from "./item";

export class Project extends Item {
  archivedDate?: Date;

  constructor(
    public title: string = "",
    public description: string = "",
    public link: Link = new Link()
  ) {
    super()
  }
}
