import { ID } from "./id.type";
import { Link } from "./link.interface";

export interface Todo {
  id: ID;
  done: boolean;
  name: string;
  poms: string;
  links: Link[];
  due: "today" | "later";
}
