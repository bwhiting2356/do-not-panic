import { Due } from "./due.type";
import { ID } from "./id.type";
import { Link } from "./link.interface";
import { Project } from "./project.enum";

export interface Todo {
  id: ID;
  done: boolean;
  name: string;
  poms: string;
  links: Link[];
  due: Due;
  project?: Project;
  archivedDate?: Date;
}
