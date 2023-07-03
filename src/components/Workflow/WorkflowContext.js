import React, { createContext, useState } from 'react';

export const WorkflowContext = createContext();

export const WorkflowProvider = ({ children }) => {
  const [listWorkflows, setListWorkflows] = useState([]);

  return (
    <WorkflowContext.Provider value={{ listWorkflows, setListWorkflows }}>
      {children}
    </WorkflowContext.Provider>
  );
};