import { createSelector } from "reselect";
import { RootState } from "../../app/store";

const selectTemplateState = (state: RootState) => state.templates;

export const selectTemplates = createSelector(
    selectTemplateState,
    state => state.currentState.templates
)