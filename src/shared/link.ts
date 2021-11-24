import { Item } from "./item";

export class Link extends Item {
  constructor(public url: string = "") {
    super();
  }
}
