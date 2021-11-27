import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  StateWithHistory,
  addNewStateGoingForward,
  redo,
  undo,
} from "../shared";
import { Template } from "../../shared/template";
import { ID } from "../../shared/id.type";
import { arrayMove } from "../../shared/util";

interface TemplateState {
  templates: Template[];
}

export type TemplateStateWithHistory = StateWithHistory<TemplateState>;

const initialCurrentState: TemplateState = {
  templates: [],
};

const initialState: TemplateStateWithHistory = {
  currentState: initialCurrentState,
  futureState: [],
  pastState: [],
};

export const templateSlice = createSlice({
  initialState,
  name: "templates",

  reducers: {
    addNewTemplate: (state, action: PayloadAction<Template>) => {
      const newTemplates = [
        { ...action.payload },
        ...state.currentState.templates,
      ];
      return addNewStateGoingForward(state, {
        ...state.currentState,
        templates: newTemplates,
      });
    },
    deleteTemplate: (state, action: PayloadAction<{ id: ID }>) => {
      const newTemplates = state.currentState.templates.filter(
        (template) => template.id !== action.payload.id
      );
      return addNewStateGoingForward(state, {
        ...state.currentState,
        templates: newTemplates,
      });
    },
    editTemplate: (
      state,
      action: PayloadAction<{ id: ID; newTemplate: Template }>
    ) => {
      const { templates } = state.currentState;
      const { id, newTemplate } = action.payload;
      const newTemplates = templates.slice().map((template) => {
        if (template.id === id) {
          return { ...template, ...newTemplate };
        } else {
          return template;
        }
      });

      return addNewStateGoingForward(state, {
        ...state.currentState,
        templates: newTemplates,
      });
    },
    moveTemplateUp: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      const { templates } = state.currentState;
      const newTemplates = arrayMove(templates, index, index - 1);
      return addNewStateGoingForward(state, {
        ...state.currentState,
        templates: newTemplates,
      });
    },
    moveTemplateDown: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      const { templates } = state.currentState;
      const newTemplates = arrayMove(templates, index, index + 1);
      return addNewStateGoingForward(state, {
        ...state.currentState,
        templates: newTemplates,
      });
    },
    redoTemplates: redo,
    undoTemplates: undo,
  },
});

export const {
  addNewTemplate,
  editTemplate,
  deleteTemplate,
  moveTemplateUp,
  moveTemplateDown,
  undoTemplates,
  redoTemplates,
} = templateSlice.actions;

export default templateSlice.reducer;
