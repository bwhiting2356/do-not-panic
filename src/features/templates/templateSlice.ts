import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addNewStateGoingForward,
  redo,
  undo,
  StateWithHistory,
} from "../shared";
import { Template } from "../../shared/template";
import { ID } from "../../shared/id.type";

interface TemplateState {
  templates: Template[];
}

export type TemplateStateWithHistory = StateWithHistory<TemplateState>;

const initialCurrentState: TemplateState = {
  templates: [],
};

const initialState: TemplateStateWithHistory = {
  pastState: [],
  currentState: initialCurrentState,
  futureState: [],
};

export const templateSlice = createSlice({
  name: "templates",
  initialState,
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

    deleteTemplate: (state, action: PayloadAction<{ id: ID }>) => {
      const newTemplates = state.currentState.templates.filter(
        (template) => template.id !== action.payload.id
      );
      return addNewStateGoingForward(state, {
        ...state.currentState,
        templates: newTemplates,
      });
    },
    undoTemplates: undo,
    redoTemplates: redo,
  },
});

export const {
  addNewTemplate,
  editTemplate,
  deleteTemplate,
  undoTemplates,
  redoTemplates,
} = templateSlice.actions;

export default templateSlice.reducer;
