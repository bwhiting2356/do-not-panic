import { v4 as uuidv4 } from "uuid";
import { ID } from "./id.type";

export abstract class Item {
  id: ID;

  constructor() {
    this.id = uuidv4();
  }
}
