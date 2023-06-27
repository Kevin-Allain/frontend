import React from 'react';
import {BsWrenchAdjustable} from 'react-icons/bs'
import {RiTestTubeLine} from 'react-icons/ri';
import "../../App.css";
import {
  addContentWorkflow
} from '../../utils/HandleApi'

const WorkflowInterface =({ workflow }) => {

  const handleTestWorkflowEnrich = () => {
    console.log("handleTestWorkflowEnrich");
    // let's make a test with the seven nation army annotation search
    const idTest = '648b25f958abda06ad6d7cbb';
    const textNoteTest = 'This is an interesting point to start thinking about... After all, it is the latest popular song that reached this impact.';
    const timeTest = new Date();
    const typeContentTest = 'annotation'

    const objectsIndexesTest = workflow.objects.length; // Calculate the index based on the length of the objects array

    // call to handleApi
    addContentWorkflow(
      workflow._id,
      textNoteTest,
      timeTest,
      localStorage?.username,
      idTest,
      typeContentTest, 
      objectsIndexesTest
    )
  }

    return (
      <div className='workflowInterface'>
      <h1>Workflow Interface</h1>
      <div className='workflowHeader'>
        <h3>{workflow.title}</h3>
        <div className='workFlowDescription'> <u>Description:</u><br/>{workflow.description}  </div>
        <em>{workflow.author} | {workflow.time} | {workflow._id}</em>
    </div>
    {/* TODO assess whether call works fine for addition of an object to a workflow */}
    <RiTestTubeLine className='icon' onClick={handleTestWorkflowEnrich} /> <br/> 
    <div className='workflowListObjects'>
        Additional components and functionality for interacting with the workflow in progress... <br/>
        {workflow.objects.map( (item,i) => {
            <div className='workflowObject'>
            Object: {item} <br/>
            <div className='workflowContentDisplay'>Work in progress <BsWrenchAdjustable/> </div>
            </div>
            
        })}
    </div>
    </div>
    );
  };

export default WorkflowInterface;
