import { ActiveTodoModal } from "./ActiveTodoModal";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import { RestoreBackupModal } from "./RestoreBackupModal";

export const modalMap = {
  "": undefined,
  "keyboard-shortcuts": <KeyboardShortcutsModal />,
  "active-todo": <ActiveTodoModal />,
  "restore-backup": <RestoreBackupModal />,
};

export type ModalKeys = keyof typeof modalMap;
