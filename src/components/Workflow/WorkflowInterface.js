import React, { useState, useEffect, useRef } from "react";
import { BsWrenchAdjustable } from "react-icons/bs";
import { HiOutlineSaveAs } from "react-icons/hi";
import { AiFillDelete } from "react-icons/ai";
import "../../App.css";
import { 
  getWorkflowsInfo, 
  addContentWorkflow,
  deleteWorkflowObject 
} from "../../utils/HandleApi";

import { useSelector, useDispatch } from 'react-redux';
import { setWorkflows } from '../Reducers/WorkflowReducer';


const WorkflowInterface = ({ workflow, 
  // setListWorkflows 
}) => {
  const [textInputObjectNote, setTextInputObjectNote] = useState("");

  // global variables
  const workflows = useSelector(state => state.workflows);
  const dispatch = useDispatch();



  // TODO see how this function can be used for later calls. We will need to have some way for elements to have access to listed workflows
  const handleTestWorkflowEnrich = () => {
    console.log(
      "handleTestWorkflowEnrich. textInputObjectNote: ",
      textInputObjectNote
    );
    // let's make a test with the seven nation army annotation search
    const idTest = "648b25f958abda06ad6d7cbb";
    const textNoteTest =
      textInputObjectNote.length > 0 ? textInputObjectNote : "N/A";
    const timeTest = new Date();
    const typeContentTest = "annotation";
    console.log("workflow.objects: ",workflow.objects)
    const objectsIndexesTest = (workflow.objects.length>0)?
      Math.max(... workflow.objects.map( a => Number( (a===null)? -42 : a.objectIndex) )) + 1 // change to adding the maximum value+1. We need to ensure it won't have another one with the same index value
      : 0;

    // call to handleApi
    addContentWorkflow(
      // setListWorkflows,
      dispatch,
      setWorkflows,
      workflow._id,
      textNoteTest,
      timeTest,
      localStorage?.username,
      idTest,
      typeContentTest,
      objectsIndexesTest,
      // TODO doubt about this! Works but should find something better
      workflow
    );
  };

  const handleDeleteWorkflowObject = (workflow_id,objectIndex) => {
    console.log("workflow_id: ",workflow_id,",objectIndex: ", objectIndex)
    // This is unique, so deletion of the workflow object should be simple
    deleteWorkflowObject(workflow_id,objectIndex, workflow, 
      // setListWorkflows, 
      dispatch,
      setWorkflows,
      localStorage?.username); // (and then we will want to load it again...) Maybe more things to add to that call...
  }

  return (
    <div className="workflowInterface">
      <h1>Workflow Interface</h1>
      <div className="workflowHeader">
        <h3>{workflow.title}</h3>
        <div className="workFlowDescription">
          {" "}
          <u>Description:</u>
          <br />
          {workflow.description}{" "}
        </div>
        <em>
          {workflow.author} | {workflow.time} | {workflow._id} |{" "}
          {workflow.objects.length} objects
        </em>
      </div>
      {/* TODO assess whether call works fine for addition of an object to a workflow */}
      <div className="infoAdditionWorkflow">
        Note (this is a test):{" "}
        <input
          type="text"
          placeholder="Add note about this object"
          name="AddObjectNote"
          id="AddObjectNote"
          className="objectNoteInput"
          value={textInputObjectNote}
          onChange={(e) => setTextInputObjectNote(e.target.value)}
        />{" "}
        <HiOutlineSaveAs className="icon" onClick={handleTestWorkflowEnrich} />{" "}
      </div>
      {/* TODO change display according to the type of the workflow object */}
      <div className="workflowListObjects">
        {workflow.objects.map((item, i) => (
          <div className="workflowObject" key={i}>
            <u>Object id:</u> {item.objectId} | <u>Object type:</u>{" "}
            {item.objectType} | <u>Object index:</u> {item.objectIndex} <br />
            <div className="workflowContentDisplay">
              <em>... Work in progress: display of content of object{" "}
              <BsWrenchAdjustable />{" "} </em>
            </div>
            <u>Object note:</u><br/> {item.objectNote} <br/>
            <AiFillDelete 
              className="icon" 
              onClick={() => handleDeleteWorkflowObject(workflow._id, item.objectIndex)} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowInterface;
