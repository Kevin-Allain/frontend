import React, { useState, useEffect, useRef } from "react";
import { HiOutlineViewGridAdd, HiOutlineSaveAs } from "react-icons/hi";
import { BsThreeDotsVertical } from 'react-icons/bs'
import { BsCardChecklist } from "react-icons/bs";
import {AiOutlineLoading} from "react-icons/ai"
import { TfiSave } from "react-icons/tfi";
// import Workflow from "../../misc/disregardedWorkflow";
import "./Workflow.css";
import {
    getWorkflow,
    getWorkflowsInfo,
    createWorkflow,
    addContentWorkflow
} from "../../utils/HandleApi";
// import WorkflowInterface from "./WorkflowInterface";

// List of workflows with the reducer
import { useSelector, useDispatch } from 'react-redux';
import { setWorkflows } from '../Reducers/WorkflowReducer';

// TODO consider attributes from object that calls the EmbeddedWorkflowInteraction
// We will at first follow a structure based on the attributes of the caller:
// -the type of caller... 
// - the idCaller, an item to identify it (either existing to an item, or loaded _id in the MongoDB database) ...
const EmbeddedWorkflowInteraction = ({idCaller, typeCaller, indexRange=0,listLogNumbers=[], infoMusicList=[], listTracks=[]}) => {
  // console.log("EmbeddedWorkflowInteraction ___ ",{idCaller, typeCaller, indexRange})  
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
    // Addition attributes
    const [textInputObjectNote, setTextInputObjectNote] = useState("");
    // Display attributes
    const [isWorkflowListVisible, setIsWorkflowListVisible] = useState(false);
    const [showWorkflowActions, setShowWorkflowActions] = useState(false);
    const [showWorkflowAddition, setShowWorkflowAddition] = useState(false);

    const [selectedPrivacyOption, setSelectedPrivacyOption] = useState('public');
    const [showLoadingIcon, setShowLoadingIcon] = useState(false); 

    // ## Functions display
    const handleShowActionsWorkflow = () => { setShowWorkflowActions(!showWorkflowActions); }
    const handleShowWorkflowAddition = () => { setShowWorkflowAddition(!showWorkflowAddition);
        // For test
        console.log("handleShowWorkflowAddition - idCaller: ",idCaller, ", typeCaller: ",typeCaller,", indexRange: ",indexRange);
    };

    // ## Functions input
    const handleChangeTitleInput = (event) => {
        const value = event.target.value;
        // Let's not allow a title too long
        if (value.length <= 50) { setTitleInput(value); }
    };
    const handleChangeDescriptionInput = (event) => {
        const value = event.target.value;
        // Let's not allow the description to be extremely long
        if (value.length <= 300) { setDescriptionInput(value); }
    };
    const handleChangeNoteInput = (event) => {
        const value = event.target.value;
        // Let's not allow the description to be extremely long
        if (value.length <= 300) { setNoteInput(value); }
    };

    const handleChangeOption = (event) => {
      setSelectedPrivacyOption(event.target.value);
    };
  

    // ## Functions actions
    const handleWorkflowEnrich = (indexWorkflow) => {
      console.log("handleTestWorkflowEnrich. textInputObjectNote: ", textInputObjectNote, ", indexWorkflow: ", indexWorkflow, ", workflows[indexWorkflow]: ", workflows[indexWorkflow], ", idCaller: ", idCaller, ", typeCaller: ", typeCaller);
      // let's make a test with the seven nation army annotation search
      const textNote =
        textInputObjectNote.length > 0 ? textInputObjectNote : "N/A";
      const time = new Date();
      const workflow = workflows[indexWorkflow];
      // console.log("workflow.objects: ",workflow.objects)
      const objectsIndexes =
        workflow.objects.length > 0
          ? Math.max( ...workflow.objects.map((a) =>
                Number(a === null ? -42 : a.objectIndex) ) ) + 1 // change to adding the maximum value+1. We need to ensure it won't have another one with the same index value
          : 0;

      console.log("objectsIndexes: ", objectsIndexes);

      // call to handleApi
      addContentWorkflow(
        // setListWorkflows,
        dispatch,
        setWorkflows,
        workflow._id, 
        textNote, 
        time, 
        localStorage?.username,
        idCaller, 
        typeCaller, 
        objectsIndexes,
        workflow,
        indexRange
      );

      setShowWorkflowActions(!showWorkflowActions);
    };
    
    const handleWorkflowCreation = (
      titleInput,
      descriptionInput,
      [idCaller],
      [noteInput],
      [typeCaller],
      setTitleInput,
      setDescriptionInput,
      dispatch,
      setWorkflows,
      [indexRange], // // For samples we need to know how far the search goes beyond the first note identified
      selectedPrivacyOption ) => {
      console.log("-- handleWorkflowCreation. idCaller: ",idCaller,", typeCaller: ",typeCaller);

      // set icon to show loading about to happen
      setShowLoadingIcon(true);
      // load metadata if possible
      

      createWorkflow(
        titleInput,
        descriptionInput,
        new Date(),
        localStorage.username,
        [idCaller],
        [new Date()],
        [noteInput],
        [typeCaller],
        setTitleInput,
        setDescriptionInput,
        dispatch,
        setWorkflows,
        [indexRange], // // For samples we need to know how far the search goes beyond the first note identified
        selectedPrivacyOption,
        setShowLoadingIcon,
        listLogNumbers,infoMusicList, listTracks
      )

    }

    return (
      <div className="embeddedWorkflowInteraction border border-2 border-inherit rounded p-[0.2rem] h-fit ">
        {/* w-fit -> doubt about this, but maybe not necessary */}
        {typeof (localStorage.token) !== 'undefined' &&
        // className="threedotsEmbedded"
          <div className="icon flex text-[15px] items-center" onClick={() => handleShowActionsWorkflow()}>
            Workflow Interface
            <BsThreeDotsVertical
              className="icon threedotsEmbedded"
            />
          </div>
        }
        {showWorkflowActions && (
          <div className="listActionsWorkflowEmbedded">
            <div className="creationWorkFlowEmbedded icon" onClick={() => handleShowWorkflowAddition()}>
              Create new workflow{" "}<HiOutlineViewGridAdd/>
            </div>
              {showWorkflowAddition && (
                <div className="creationWorkflow">
                  Title (50 characters max): <br />
                  <input type="text" placeholder="Write a short title" ref={titleInputRef} autoComplete="off" required value={titleInput} onChange={handleChangeTitleInput} />{" "}
                  <br />
                  Description (300 characters max): <br />
                  <input type="text" placeholder="Describe shortly the objective of this workflow" ref={descriptionInputRef} autoComplete="off" required value={descriptionInput} onChange={handleChangeDescriptionInput} />{" "}
                  <br />
                  <div className="infoAdditionWorkflow">
                    Note about this object (500 characters max):{" "}<br/>
                    <input type="text" placeholder="Write a note about this object" name="AddObjectNote" id="AddObjectNote" className="objectNoteInput" value={noteInput} onChange={(e) => setNoteInput(e.target.value)} />{" "}
                  </div>
                  <br />
                  <select className='selectPrivacy' value={selectedPrivacyOption} onChange={handleChangeOption}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                  <br />
                  <div className="icon flex items-center" 
                    onClick={() => {
                      titleInput.length > 0 && descriptionInput.length > 0
                        ? handleWorkflowCreation(
                          titleInput,
                          descriptionInput,
                          [idCaller],
                          [noteInput],
                          [typeCaller],
                          setTitleInput,
                          setDescriptionInput,
                          dispatch,
                          setWorkflows,
                          [indexRange], // // For samples we need to know how far the search goes beyond the first note identified
                          selectedPrivacyOption
                        )
                        : console.log("empty title or description. titleInput: ", titleInput, "typeof titleInput: ", typeof titleInput, ", descriptionInput: ", descriptionInput, "typeof descriptionInput: ", typeof descriptionInput);

                      if (titleInput.length > 0 && descriptionInput.length > 0) { setShowWorkflowActions(!showWorkflowActions); }
                    }}                  
                  >
                  Save this workflow{" "}
                  <TfiSave/>
                  </div>
                {showLoadingIcon ?
                  <AiOutlineLoading className="spin" size={window.innerHeight / 10} />
                  : <></>
                }
              </div>
            )}{" "}

            <div className="additionWorkFlowEmbedded">
              Add to existing workflow <br />
              Note:{" "}
              <input
                type="text" placeholder="Add note about this object"
                name="AddObjectNote" id="AddObjectNote" className="objectNoteInput"
                value={textInputObjectNote}
                onChange={(e) => setTextInputObjectNote(e.target.value)}
              />{" "}
              {workflows.map((item, i) => (
                <div className="listWorkflowEmbedded icon" key={item._id} index={i} onClick={() => handleWorkflowEnrich(i)}>
                  {item.title}
                  <br />
                  <HiOutlineSaveAs />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
};

export default EmbeddedWorkflowInteraction;