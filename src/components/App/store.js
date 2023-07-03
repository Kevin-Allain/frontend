// store.js
import { configureStore } from '@reduxjs/toolkit';
import WorkflowReducer from '../Reducers/WorkflowReducer';

const store = configureStore({
  reducer: {
    workflows: WorkflowReducer,
  },
});

export default store;