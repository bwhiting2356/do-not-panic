import { Item } from "./item";

export class ToastData extends Item {
  constructor(public text: string) {
    super();
  }
}
