import { ActiveTodoModal } from "./ActiveTodoModal";
import { KeyboardShortcutsModal } from "./KeyboardShortcutsModal";
import { ProjectAnalyticsModal } from "./project-analytics/ProjectAnalyticsModal";

export const modalMap = {
  "": undefined,
  "keyboard-shortcuts": <KeyboardShortcutsModal />,
  "active-todo": <ActiveTodoModal />,
  "project-analytics": <ProjectAnalyticsModal />,
};

export type ModalKeys = keyof typeof modalMap;
