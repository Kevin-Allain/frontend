import React, { useState, useEffect, useRef } from "react";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { BsCardChecklist } from "react-icons/bs";
import { TfiSave } from "react-icons/tfi";
import Workflow from "./Workflow";
import "./Workflow.css";
import {
  getWorkflow,
  getWorkflowsInfo,
  createWorkflow,
} from "../../utils/HandleApi";
import WorkflowInterface from "./WorkflowInterface";

// Work in progress: list of workflows with the reducer...
import { useSelector, useDispatch } from 'react-redux';
import { setWorkflows } from '../Reducers/WorkflowReducer';

const WorkflowManager = () => {
  const [isWorkflowListVisible, setIsWorkflowListVisible] = useState(false);
  
  const workflows = useSelector(state => state.workflows);
  const dispatch = useDispatch();
  const [listWorkflows, setListWorkflows] = useState([]);

  // Example usage: dispatching an action to update the workflows list
  const handleUpdateWorkflows = () => {
    const newWorkflows = [...workflows, { title: 'New Workflow' }];
    dispatch(setWorkflows(newWorkflows));
  };


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
      console.log("titleInput: ", titleInput);
    }
  };
  const handleChangeDescriptionInput = (event) => {
    const value = event.target.value;
    // Let's not allow the description to be extremely long
    if (value.length <= 300) {
      setDescriptionInput(value);
      console.log("descriptionInput: ", descriptionInput);
    }
  };

  useEffect(() => {
    if (localStorage?.username) {
      getWorkflowsInfo( dispatch ,setWorkflows, { user: localStorage?.username });
    }
  }, []);

  const loadDetailWorkflow = (_id) => {
    getWorkflow( setIsWorkerVisible, setSelectedWorkflow ,_id, localStorage?.username);
  };



  return (
    <div className="workflowManager">
      <h3> Workflow Manager </h3>
      <div className="additionWorkFlow">
        Create a new workflow{" "}
        <HiOutlineViewGridAdd
          className="icon"
          onClick={() => handleShowWorkflowAddition()}
        />
      </div>
      {showWorkflowAddition && (
        <div className="creationWorkflow">
          Title: <br />
          <input
            type="text"
            placeholder="Write a short title"
            ref={titleInputRef}
            autoComplete="off"
            required
            value={titleInput}
            onChange={handleChangeTitleInput}
          />{" "}
          <br />
          Description: <br />
          <input
            type="text"
            placeholder="Describe shortly the objective of this workflow"
            ref={descriptionInputRef}
            autoComplete="off"
            required
            value={descriptionInput}
            onChange={handleChangeDescriptionInput}
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
                    titleInput,
                    descriptionInput,
                    new Date(),
                    localStorage.username,
                    [],
                    [],
                    '', 
                    [],
                    setTitleInput,
                    setDescriptionInput,
                    setListWorkflows
                  )
                : console.log(
                    "empty title or description. titleInput: ",
                    titleInput,
                    "typeof titleInput: ",
                    typeof titleInput,
                    ", descriptionInput: ",
                    descriptionInput,
                    "typeof descriptionInput: ",
                    typeof descriptionInput
                  );
            }}
          />
        </div>
      )}
      <div className="listWorkflows">
        Your workflows{" "}
        <BsCardChecklist 
          className="icon" 
          onClick={handleToggleUserWorkflows} 
        />{" "}
        <br />
        {isWorkflowListVisible &&
          // listWorkflows.map((item, i) => (
            workflows.map((item,i) => (
            <div
              className="workflowDetails"
              onClick={() => loadDetailWorkflow(item._id)}
              key={item._id}
            >
              Title: {item.title} | {item.time} 
              {/* | {item._id} */}
            </div>
          ))}
      </div>
      {isWorkflowVisible && selectedWorkflow && 
          <WorkflowInterface workflow={selectedWorkflow} setListWorkflows={setListWorkflows} />
      }
    </div>
  );
};

export default WorkflowManager;
