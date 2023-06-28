import React, { useState, useEffect, useRef } from "react";
import { BsWrenchAdjustable } from "react-icons/bs";
import { HiOutlineSaveAs } from "react-icons/hi";
import "../../App.css";
import { getWorkflowsInfo, addContentWorkflow } from "../../utils/HandleApi";

const WorkflowInterface = ({ workflow , setListWorkflows }) => {
  
  const [textInputObjectNote, setTextInputObjectNote] = useState("");

  const handleTestWorkflowEnrich = () => {
    console.log("handleTestWorkflowEnrich. textInputObjectNote: ",textInputObjectNote);
    // let's make a test with the seven nation army annotation search
    const idTest = "648b25f958abda06ad6d7cbb";
    const textNoteTest = (textInputObjectNote.length>0)?textInputObjectNote:'N/A';
    const timeTest = new Date();
    const typeContentTest = "annotation";
    const objectsIndexesTest = workflow.objects.length;

    // call to handleApi
    addContentWorkflow(
      setListWorkflows,
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
        Note (this is a test): {" "} <input
          type="text"
          placeholder="Add note about this object"
          name="AddObjectNote"
          id="AddObjectNote"
          class="objectNoteInput"
          value= {textInputObjectNote}
          onChange={(e) => setTextInputObjectNote(e.target.value)} 
        />{" "}
        <HiOutlineSaveAs className="icon" onClick={handleTestWorkflowEnrich} />{" "}
      </div>
      {/* TODO change display according to the type of the workflow object */}
      <div className="workflowListObjects">
        {workflow.objects.map((item, i) => (
          <div className="workflowObject" key={i}>
            <u>Object id:</u> {item.objectId} <br />
            <u>Object type:</u> {item.objectType} <br />
            <u>Object index:</u> {item.objectIndex} <br />
            <div className="workflowContentDisplay">
              ... Work in progress: display of content of object{" "}
              <BsWrenchAdjustable />{" "}
            </div>
            Object note: {item.objectNote} <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowInterface;
