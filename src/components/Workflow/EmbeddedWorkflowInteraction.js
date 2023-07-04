import React, { useState, useEffect, useRef } from "react";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { BsThreeDotsVertical } from 'react-icons/bs'
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

// List of workflows with the reducer
import { useSelector, useDispatch } from 'react-redux';
import { setWorkflows } from '../Reducers/WorkflowReducer';

// TODO consider attributes from object that calls the 
const EmbeddedWorkflowInteraction = () => {

    // ## Attributes
    const [isWorkflowListVisible, setIsWorkflowListVisible] = useState(false);

    // Global variable for workflows
    const workflows = useSelector(state => state.workflows);
    const dispatch = useDispatch();
    // Creation attributes
    const [titleInput, setTitleInput] = useState("");
    const titleInputRef = useRef("");
    const [descriptionInput, setDescriptionInput] = useState("");
    const descriptionInputRef = useRef("");
    // Display attributes
    const [showWorkflowActions, setShowWorkflowActions] = useState(false);
    const [showWorkflowAddition, setShowWorkflowAddition] = useState(false);


    // ## Functions display
    const handleShowActionsWorkflow = () => {
        console.log("handleShowActionsWorkflow");
        setShowWorkflowActions(!showWorkflowActions);
        console.log("workflows: ", workflows);
    }
    const handleShowWorkflowAddition = () => {
        setShowWorkflowAddition(!showWorkflowAddition);
    };

    // ## Functions input
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
    

    // ## Functions actions


    // TODO Button for the display of actions related with workflows.

    // TODO Display list of actions when clicking the three dots. Those actions are
    // - Creation of new workflow (with the info of the object content added)
    // - Addition of object content to existing workflow

    return (
        <div className="embeddedWorkflowInteraction">
            <div className="threedotsEmbedded">
                <BsThreeDotsVertical
                    className="icon"
                    onClick={() => handleShowActionsWorkflow()}
                />
            </div>
            {showWorkflowActions &&
                <div className="listActionsWorkflowEmbedded">
                    The actions of the workflows are in progress <br />
                    <div className="creationWorkFlowEmbedded">
                        Add to new workflow{" "}
                        <HiOutlineViewGridAdd
                            className="icon"
                            onClick={() => handleShowWorkflowAddition()}
                        />
                    </div>
                    {showWorkflowAddition && (
                        <div className="creationWorkflow">
                            Title (50 characters max): <br />
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
                            Description (300 characters max): <br />
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
                                            dispatch,
                                            setWorkflows
                                        )
                                        : console.log("empty title or description. titleInput: ", titleInput, "typeof titleInput: ", typeof titleInput, ", descriptionInput: ", descriptionInput, "typeof descriptionInput: ", typeof descriptionInput);
                                }}
                            />
                        </div>
                    )}

                    <div className="additionWorkFlowEmbedded">
                        Add to existing workflow{" "} <br />
                        {workflows.map((item, i) =>
                            <div className="buttonAddToWorkflowEmbedded" key={item._id}>
                                {item.title}
                            </div>
                        )}

                    </div>

                </div>
            }
        </div>
    )
};

export default EmbeddedWorkflowInteraction;