import { createSlice } from '@reduxjs/toolkit';
import { reusableRedo, reusableUndo, StateWithHistory } from '../shared';
import { Project } from '../../shared/project';

interface ProjectState {
    projects: Project[],
}

export interface ProjectStateWithHistory extends StateWithHistory<ProjectState> {};

const initialCurrentState: ProjectState = {
    projects: [],
}

const initialState: ProjectStateWithHistory = {
    pastState: [],
    currentState: initialCurrentState,
    futureState: []
}

export const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        undo: reusableUndo,
        redo: reusableRedo
    }
})

export const { undo, redo } = projectSlice.actions;

export default projectSlice.reducer;