import React, { useState, useEffect, useRef } from "react";
import { BsWrenchAdjustable } from "react-icons/bs";
import { RiTestTubeLine } from "react-icons/ri";
import "../../App.css";
import { getWorkflowsInfo, addContentWorkflow } from "../../utils/HandleApi";

const WorkflowInterface = ({ workflow , setListWorkflows }) => {
  
  const handleTestWorkflowEnrich = () => {
    console.log("handleTestWorkflowEnrich");
    // let's make a test with the seven nation army annotation search
    const idTest = "648b25f958abda06ad6d7cbb";
    const textNoteTest =
      "This is an interesting point to start thinking about... After all, it is the latest popular song that reached this impact.";
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
          {workflow.objects.length}{" "}objects
        </em>
      </div>
      {/* TODO assess whether call works fine for addition of an object to a workflow */}
      <RiTestTubeLine className="icon" onClick={handleTestWorkflowEnrich} />{" "}
      <br />
      {/* TODO change display according to the type of the workflow object */}
      <div className="workflowListObjects">
        {workflow.objects.map((item, i) => (
          <div className="workflowObject" key={i}>
            Object id: {item.objectId} <br />
            Object type: {item.objectType} <br /> 
            Object index: {item.objectIndex} <br /> 
            <div className="workflowContentDisplay">
              Work in progress: display of content of object <BsWrenchAdjustable />{" "}
            </div>
            Object note: {item.objectNote} <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowInterface;
