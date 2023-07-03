// WorkflowsReducer.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const workflowsSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    setWorkflows: (state, action) => {
      return action.payload;
    },
  },
});

export const { setWorkflows } = workflowsSlice.actions;

export default workflowsSlice.reducer;