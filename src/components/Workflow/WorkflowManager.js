import React, { useState, useEffect, useRef } from "react";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { BsCardChecklist } from "react-icons/bs";
import { BsWrenchAdjustable } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { TfiSave } from "react-icons/tfi";
import Workflow from "./Workflow";
import "./Workflow.css";
import {
  getWorkflow,
  getWorkflowsInfo,
  createWorkflow,
  deleteWorkflowObject
} from "../../utils/HandleApi";
import WorkflowInterface from "./WorkflowInterface";

// Work in progress: list of workflows with the reducer...
import { useSelector, useDispatch } from 'react-redux';
import { setWorkflows } from '../Reducers/WorkflowReducer';

const WorkflowManager = () => {
  const [isWorkflowListVisible, setIsWorkflowListVisible] = useState(false);

  // Global variable for workflows
  const workflows = useSelector(state => state.workflows);
  const dispatch = useDispatch();

  // Example usage: dispatching an action to update the workflows list
  const handleUpdateWorkflows = () => {
    const newWorkflows = [...workflows, { title: 'New Workflow' }];
    dispatch(setWorkflows(newWorkflows));
  };

  const handleDeleteWorkflowObject = (workflow_id,objectIndex) => {
    console.log("handleDeleteWorkflowObject | workflow_id: ",workflow_id,",objectIndex: ", objectIndex)
    // This is unique, so deletion of the workflow object should be simple
    deleteWorkflowObject(workflow_id,objectIndex, selectedWorkflow, 
      // setListWorkflows, 
      dispatch,
      setWorkflows,
      localStorage?.username); // (and then we will want to load it again...) Maybe more things to add to that call...
  }

  const [isWorkflowVisible, setIsWorkerVisible] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  // creation attributes
  const [titleInput, setTitleInput] = useState("");
  const titleInputRef = useRef("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const descriptionInputRef = useRef("");
  const [showWorkflowAddition, setShowWorkflowAddition] = useState(false);

  const handleShowWorkflowAddition = () => {
    setShowWorkflowAddition(!showWorkflowAddition);
  };

  const handleToggleUserWorkflows = () => {
    // TODO change to call based on global variable... 
    getWorkflowsInfo(
      dispatch ,setWorkflows,
      { user: localStorage?.username }
    );
    setIsWorkflowListVisible((prevState) => !prevState);

  };
  const handleChangeTitleInput = (event) => {
    const value = event.target.value;
    // Let's not allow a title too long
    if (value.length <= 50) {
      setTitleInput(value);
    }
  };
  const handleChangeDescriptionInput = (event) => {
    const value = event.target.value;
    // Let's not allow the description to be extremely long
    if (value.length <= 300) {
      setDescriptionInput(value);
    }
  };

  useEffect(() => {
    if (localStorage?.username) {
      getWorkflowsInfo(
        dispatch,
        setWorkflows,
        { user: localStorage?.username }
      );
    }
  }, []);

  const loadDetailWorkflow = (_id) => {
    getWorkflow( 
      setIsWorkerVisible, 
      setSelectedWorkflow ,
      _id, 
      localStorage?.username
    );
  };

  return (
    <div className="workflowManager">
      <h3> Workflow Manager </h3>
      <div className="additionWorkFlow">
        Create a new workflow{" "}
        <HiOutlineViewGridAdd className="icon" onClick={() => handleShowWorkflowAddition()} />
      </div>
      {showWorkflowAddition && (
        <div className="creationWorkflow">
          Title: <br />
          <input
            type="text" placeholder="Write a short title (50 characters max)" ref={titleInputRef} autoComplete="off" required value={titleInput} onChange={handleChangeTitleInput}
          />{" "}
          <br />
          Description: <br />
          <input
            type="text" placeholder="Describe shortly the objective of this workflow (300 characters max)" ref={descriptionInputRef} autoComplete="off" required value={descriptionInput} onChange={handleChangeDescriptionInput}
          />{" "}
          <br />
          <em>Once created, you will be able to save objects of interest in your workflow.</em>
          <br />
          Save this workflow{" "}
          {/* Note the call to this function is set with empty parameters as we set first the creation without objects to populate the workflow */}
          <TfiSave
            className="icon"
            onClick={() => {
              titleInput.length > 0 && descriptionInput.length > 0
                ? createWorkflow(
                    titleInput, descriptionInput, new Date(), localStorage.username,
                    // These arrays are to be changed to objects, which contains an array of objects as: 
                    [], // objectId: String
                    [], // objectTime: Date
                    // objectIndex: Number (not entered as function call)
                    [], // objectNote: String
                    [], // objectType: String
                    setTitleInput,
                    setDescriptionInput,
                    dispatch,
                    setWorkflows
                  )
                : console.log("empty title or description. titleInput: ", titleInput, "typeof titleInput: ", typeof titleInput, ", descriptionInput: ", descriptionInput, "typeof descriptionInput: ", typeof descriptionInput );
            }}
          />
        </div>
      )}
      <div className="listWorkflows">
        Your workflows{" "}
        <BsCardChecklist className="icon" onClick={handleToggleUserWorkflows} />{" "}
        <br />
        {isWorkflowListVisible &&
            workflows.map((item,i) => (
            <div className="workflowDetails" onClick={() => loadDetailWorkflow(item._id)} key={item._id} >
              Title: {item.title} | {item.time} 
            </div>
          ))}
      </div>
      {isWorkflowVisible && selectedWorkflow && 
          // <WorkflowInterface 
          //   workflow={selectedWorkflow} 
          // />
          <div className="workflowHeader">
          <h3>{selectedWorkflow.title}</h3>
          <div className="workFlowDescription">
            {" "}
            <u>Description:</u>
            <br />
            {selectedWorkflow.description}{" "}
          </div>
          <em>
            {selectedWorkflow.author} | {selectedWorkflow.time} | {selectedWorkflow._id} |{" "}
            {selectedWorkflow.objects.length} objects
          </em>
          <div className="workflowListObjects">
        {selectedWorkflow.objects.map((item, i) => (
          <div className="workflowObject" key={i}>
            <u>Object id:</u> {item.objectId} | <u>Object type:</u>{" "}
            {item.objectType} | <u>Object index:</u> {item.objectIndex} <br />
            <div className="workflowContentDisplay">
              <em>... Work in progress: display of content of object{" "}
              <BsWrenchAdjustable />{" "} </em> <br/>
              {item.content ? (
                <div>
                  {typeof(item.content)} and {item.content.length} and {item.content.length>0 && Object.keys(item.content[0]) && item.content[0]._id}
                  <br/>
                  {item.content.map((a,index)=>(
                    <div className="contentItem">{item.objectType}: {a._id} with keys: {Object.keys(a)} </div>
                  ))}
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
              onClick={() => handleDeleteWorkflowObject(selectedWorkflow._id, item.objectIndex)} 
            />
          </div>
        ))}
      </div>

        </div>
  
      }
    </div>
  );
};

export default WorkflowManager;
