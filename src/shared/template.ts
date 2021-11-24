import { ID } from "./id.type";
import { Todo } from "./todo";

export class Template extends Todo {
  constructor(public templateTitle: string = "", public projectId: ID) {
    super();
  }
}
