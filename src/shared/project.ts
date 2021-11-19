import { ID } from "./id.type";
import { Link } from "./link";
import { v4 as uuidv4 } from "uuid";

export class Project {
    id: ID;
    archivedDate?: Date;
  
    constructor(
      public title: string = "",
      public description: string = "",
      public link: Link = new Link()
    ) {
      this.id = uuidv4();
    }
  }