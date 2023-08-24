import React, { useState, useEffect, useRef } from "react";
import { BsWrenchAdjustable } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { HiOutlineSaveAs } from "react-icons/hi";
import "../../App.css";
import { getWorkflowsInfo, addContentWorkflow, deleteWorkflowObject ,getDatabaseContent } from "../../utils/HandleApi";
import { useSelector, useDispatch } from 'react-redux';
import { setWorkflows } from '../Reducers/WorkflowReducer';
import Title from "../Presentation/Title";

const WorkflowInterface = ({ workflow }) => {
  const [textInputObjectNote, setTextInputObjectNote] = useState("");

  // global variables
  const workflows = useSelector(state => state.workflows);
  const dispatch = useDispatch();

  // How can we load the content of the objects of the objects?
  const [arrayContent, setArrayContent] = useState([]);

  // useEffect( () => {
  //   console.log("useEffect WorkflowInterface  workflow: ",workflow);
  //   // This would be a fine place to call a function to load the content...

  //   console.log("To load. workflow.objects: ",workflow.objects);
  //   // change according to type and we make different loadings...  
  //   // Several calls results in a loop of calls...?! Let's try one call with the array directly
  //     getDatabaseContent( 
  //       workflow.objects,
  //       arrayContent,
  //       setArrayContent
  //     );
  // },[]);

  useEffect(() => {
    console.log('arrayContent has changed:', arrayContent);
  }, [arrayContent]);

  useEffect(() => {
    console.log('workflow in useEffect:', workflow,", workflow.objects[0]: ",workflow.objects[0]);
  }, [workflow]);


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
    console.log("handleDeleteWorkflowObject | workflow_id: ",workflow_id,",objectIndex: ", objectIndex)
    // This is unique, so deletion of the workflow object should be simple
    deleteWorkflowObject(workflow_id,objectIndex, workflow, 
      // setListWorkflows, 
      dispatch,
      setWorkflows,
      localStorage?.username); // (and then we will want to load it again...) Maybe more things to add to that call...
  }

  // Information inside each object: 
  /**
   * objectId : "64907ea4c352872afba8250c"
   * objectIndex : 0
   *  objectNote : "N New Sample"
   * objectTime :  "2023-07-07T13:37:58.126Z"
   * objectType :  "sample"
   * _id :  "64a81536729e414cff9aa0e8"
   * objectIndexRange : 0 // can be non existent...
   */

  return (
    <div className="workflowInterface">
      <Title firstLine="Workflow" secondLine="Interface" />
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
      {/* <div className="infoAdditionWorkflow"> Note (this is a test):{" "} <input type="text" placeholder="Add note about this object" name="AddObjectNote" id="AddObjectNote" className="objectNoteInput" value={textInputObjectNote} onChange={(e) => setTextInputObjectNote(e.target.value)} />{" "} <HiOutlineSaveAs className="icon" onClick={handleTestWorkflowEnrich} />{" "} </div> */}
      {/* TODO change display according to the type of the workflow object */}
      <div className="workflowListObjects">
        {workflow.objects.map((item, i) => (
          <div className="workflowObject" key={i}>
            <u>Object id:</u> {item.objectId} | <u>Object type:</u>{" "}
            {item.objectType} | <u>Object index:</u> {item.objectIndex} <br />
            <div className="workflowContentDisplay">
              <em>... Work in progress: display of content of object{" "}
              <BsWrenchAdjustable />{" "} </em> <br/>
              {item.content ? (
                <div>
                  {item.content._id} - 
                </div>
              ) : (
                <em>Loading content...</em>
              )}
              {/* {item.content}
              {arrayContent.map((o,indx)=>(
                <div className='content' key={o._id}>
                  id: {o._id}. index: {indx}
                </div>
              ))} */}
            </div>
            <u>Object note:</u><br/> {item.objectNote} <br/>
            <AiFillDelete 
              className="icon" 
              onClick={() => handleDeleteWorkflowObject(workflow._id, item.objectIndex)} 
            />
          </div>
        ))}
        <div className="contentTest">
          {arrayContent.map((o,index)=>(
            <p key={index}>Array content. {o._id}, {index}</p>
        ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowInterface;
