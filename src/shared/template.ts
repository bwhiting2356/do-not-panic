import { ID } from "./id.type";
import { Link } from "./link";
import { Todo } from "./todo";

export class Template extends Todo {
  constructor(
    public templateTitle: string = "",
    public projectId: ID = "",
    public name: string = "",
    public poms: string = "",
    public links: Link[] = [new Link("")],
    public autofocus: boolean = false
  ) {
    super();
  }
}

export const buildTodoFromTemplate = (template: Template) => {
  return new Todo(
    template.poms,
    template.name,
    template.links,
    template.projectId
  );
};
