import { ActiveTodoModal } from "./ActiveTodoModal";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import { ProjectAnalyticsModal } from "./project-analytics/ProjectAnalyticsModal";
import { RestoreBackupModal } from "./RestoreBackupModal";

export const modalMap = {
  "": undefined,
  "keyboard-shortcuts": <KeyboardShortcutsModal />,
  "active-todo": <ActiveTodoModal />,
  "project-analytics": <ProjectAnalyticsModal />,
  "restore-backup": <RestoreBackupModal />,
};

export type ModalKeys = keyof typeof modalMap;
