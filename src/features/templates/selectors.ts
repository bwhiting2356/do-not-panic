import { createSelector } from "reselect";
import { RootState } from "../../app/store";

const selectTemplateState = (state: RootState) => state.templates;

export const selectTemplates = createSelector(
  selectTemplateState,
  (state) => state.currentState.templates
);

export const selectDefaultTemplate = createSelector(
  selectTemplates,
  (templates) =>
    templates.find(
      (template) => template.templateTitle.toLowerCase() === "default"
    )
);

export const selectCustomTemplates = createSelector(
  selectTemplates,
  (templates) =>
    templates.filter(
      (template) => template.templateTitle.toLowerCase() !== "default"
    )
);
