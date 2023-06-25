import React from 'react';

const WorkflowInterface =({ workflow }) => {


    return (
      <div className='workflowInterface'>
      <h1>Workflow Interface</h1>
      <div className='workflowHeader'>
        <h3>{workflow.title}</h3>
        <div className='workFlowDescription'> <u>Description:</u><br/>{workflow.description}  </div>
        <em>{workflow.author} | {workflow.time} | {workflow._id}</em>
    </div>
    <div className='workflowObjects'>
        Additional components and functionality for interacting with the workflow in progress... <br/>
        {workflow.objects.map( (item,i) => {
            
        })}
    </div>
    </div>
    );
  };

export default WorkflowInterface;
