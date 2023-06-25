import React from 'react';

const WorkflowInterface =({ workflow }) => {
    return (
      <div className='workflowInterface'>
      <h1>Workflow Interface</h1>
        <h3>{workflow.title}</h3>
        <p>{workflow.description}</p>
        <p>{workflow.author}</p>
        <p>{workflow.time}</p>
        Additional components and functionality for interacting with the workflow in progress... 
      </div>
    );
  };

export default WorkflowInterface;
