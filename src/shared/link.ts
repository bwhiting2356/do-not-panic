import { ID } from "./id.type";
import { v4 as uuidv4 } from "uuid";

export class Link {
  id: ID;
  constructor(public url: string = "") {
    this.id = uuidv4();
  }
}
