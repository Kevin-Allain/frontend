import React, { useState, useEffect, useRef } from "react";
import { HiOutlineViewGridAdd, HiOutlineSaveAs } from "react-icons/hi";
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

// TODO consider attributes from object that calls the EmbeddedWorkflowInteraction
// We will at first follow a structure based on the attributes of the caller:
// -the type of caller... 
// - the idCaller, an item to identify it (either existing to an item, or loaded _id in the MongoDB database) ...
const EmbeddedWorkflowInteraction = ({idCaller, typeCaller}) => {
    // ## Attributes
    // Global variable for workflows
    const workflows = useSelector(state => state.workflows);
    const dispatch = useDispatch();
    // Creation attributes
    const [titleInput, setTitleInput] = useState("");
    const titleInputRef = useRef("");
    const [descriptionInput, setDescriptionInput] = useState("");
    const [noteInput, setNoteInput] = useState("");
    const descriptionInputRef = useRef("");
    // Display attributes
    const [isWorkflowListVisible, setIsWorkflowListVisible] = useState(false);
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
        // For test
        console.log("idCaller: ",idCaller, ", typeCaller: ",typeCaller);
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
    const handleChangeNoteInput = (event) => {
        const value = event.target.value;
        // Let's not allow the description to be extremely long
        if (value.length <= 300) {
            setNoteInput(value);
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
                    <div className="creationWorkFlowEmbedded">
                        Add to new workflow{" "}
                        <HiOutlineViewGridAdd
                            className="icon"
                            onClick={() => handleShowWorkflowAddition()}
                        />
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
                                <div className="infoAdditionWorkflow">
                                    Note about this object (500 characters max):{" "}
                                    <input
                                        type="text"
                                        placeholder="Write a note about this object"
                                        name="AddObjectNote"
                                        id="AddObjectNote"
                                        className="objectNoteInput"
                                        value={noteInput}
                                        onChange={(e) => setNoteInput(e.target.value)}
                                    />{" "}
                                </div>
                                <br />
                                Save this workflow{" "}
                                <TfiSave
                                    className="icon"
                                    onClick={() => {
                                        titleInput.length > 0 && descriptionInput.length > 0
                                            ? createWorkflow(
                                                titleInput, descriptionInput, new Date(), localStorage.username,
                                                [idCaller],
                                                [new Date()],
                                                [noteInput],
                                                [typeCaller],
                                                setTitleInput,
                                                setDescriptionInput,
                                                dispatch,
                                                setWorkflows
                                            )
                                            : console.log("empty title or description. titleInput: ", titleInput, "typeof titleInput: ", typeof titleInput, ", descriptionInput: ", descriptionInput, "typeof descriptionInput: ", typeof descriptionInput);
                                    }}
                                />
                            </div>
                        )}                    </div>


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