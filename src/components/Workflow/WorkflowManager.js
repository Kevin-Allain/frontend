import React, { useState, useEffect, useRef, useCallback } from "react";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { BsCardChecklist } from "react-icons/bs";
import {BiSearchAlt} from 'react-icons/bi';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
// import { BsWrenchAdjustable } from "react-icons/bs";
// import {FiPlayCircle} from 'react-icons/fi'
import { AiFillDelete, AiOutlineEyeInvisible, AiOutlineLoading } from "react-icons/ai";
import { TfiSave } from "react-icons/tfi";
import {BsUnlock,BsLock} from 'react-icons/bs';
// import Workflow from "../../misc/disregardedWorkflow";
import "./Workflow.css";
import {
  getWorkflow,
  getWorkflowsInfo,
  createWorkflow,
  deleteWorkflow,
  deleteWorkflowObject,
  getExactMatchWorkflowParameter,
  changeWorkflowPrivacy
} from "../../utils/HandleApi";
// import WorkflowInterface from "./WorkflowInterface";
import Title from "../Presentation/Title";

// Work in progress: list of workflows with the reducer...
import { useSelector, useDispatch } from 'react-redux';
import { setWorkflows } from '../Reducers/WorkflowReducer';
import PianoRoll from "../VisComponents/PianoRoll";
import WorkflowPlayer from "./WorkflowPlayer";

const WorkflowManager = () => {
  const [isWorkflowListVisible, setIsWorkflowListVisible] = useState(false);
  const [selectedPrivacyOption, setSelectedPrivacyOption] = useState('public');
  const [textSearch, setTextSearch] = useState('');
  const textSearchRef = useRef('');

  const [oldTextSearch, setOldTextSearch] = useState(''); 
  const [oldSelectionParameter, setOldSelectionParameter]= useState('');

  const [expandedSearch, setExpandedSearch] = useState(false);
  const [expandedCreation, setExpandedCreation] = useState(false);
  const [expandedListWorkflows, setExpandedListWorkflows] = useState(false);

  const [loadingSearchWorkflow, setLoadingSearchWorkflow] = useState(false);

  // Global variable for workflows
  const workflows = useSelector(state => state.workflows);
  const dispatch = useDispatch();

  // // Example usage: dispatching an action to update the workflows list
  // const handleUpdateWorkflows = () => {
  //   const newWorkflows = [...workflows, { title: 'New Workflow' }];
  //   dispatch(setWorkflows(newWorkflows));
  // };

  const handleDeleteWorkflow=(workflow_id)=>{
    console.log("handleDeleteWorkflow | workflow_id: ", workflow_id);
    deleteWorkflow(workflow_id,
      dispatch,
      setWorkflows,
      localStorage?.username); // (and then we will want to load it again...) Maybe more things to add to that call...
  }
  const handleDeleteWorkflowObject = (workflow_id, objectIndex) => {
    console.log("handleDeleteWorkflowObject | workflow_id: ", workflow_id, ",objectIndex: ", objectIndex)
    // This is unique, so deletion of the workflow object should be simple
    deleteWorkflowObject(workflow_id, objectIndex, selectedWorkflow, dispatch, setWorkflows, localStorage?.username);
  }

  const handleChangeOption = (event) => {
    setSelectedPrivacyOption(event.target.value);
  };
  const handleChangeSearchAttribute = (event) => {
    console.log("handleChangeSearchAttribute. event.target.value: ",event.target.value);
    setSearchAttribute(event.target.value);
  }
  const handleChangeQueryWorkflow = useCallback((event) => {
    const value = event.target.value;
    setTextSearch(value);
  }, [setTextSearch]);

  const [isWorkflowVisible, setIsWorkflowVisible] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  // creation attributes
  const [titleInput, setTitleInput] = useState("");
  const titleInputRef = useRef("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const descriptionInputRef = useRef("");
  const [showWorkflowAddition, setShowWorkflowAddition] = useState(false);
  const [showSearchWorkflow, setShowSearchWorkflow] = useState(false);
  const [searchAttribute, setSearchAttribute] = useState('author');

  const [searchWorkflowOutput, setSearchWorkflowOutput] = useState([]);
  const [isSearchWorkflowVisible, setIsSearchWorkflowVisible] = useState(false);
  const [selectedSearchWorkflow, setSelectedSearchWorkflow] = useState(null);

  function findExactMatchWorkflowParam(textSearch, setSearchAttribute) {
    console.log("---- findExactMatchWorkflowParam")
    setTextSearch('');

    getExactMatchWorkflowParameter(
      localStorage?.username,
      textSearch, 
      setSearchAttribute,
      searchWorkflowOutput, 
      setSearchWorkflowOutput,
      setLoadingSearchWorkflow
    )
  }


  const handleShowWorkflowAddition = () => { setShowWorkflowAddition(!showWorkflowAddition); };
  const handleShowWorkflowDetail = () => { setSelectedWorkflow(null); }
  const handleToggleUserWorkflows = () => {
    setSelectedWorkflow(null);
    getWorkflowsInfo(
      dispatch, setWorkflows,
      { user: localStorage?.username }
    );
    setIsWorkflowListVisible((prevState) => !prevState);
  };
  const handleChangeWorkflowPrivacy = (_id,newPrivacy, selectedWorkflow, setIsWorkerVisible, setSelectedWorkflow, user) => 
    { changeWorkflowPrivacy(_id,newPrivacy, selectedWorkflow, setIsWorkerVisible, setSelectedWorkflow, user); }
  const handleShowSearchWorkflowDetail = () => { setSelectedSearchWorkflow(null); }
  const handleToggleSearch = () => {
    setShowSearchWorkflow(!showSearchWorkflow);
    setOldTextSearch(''); 
    setOldSelectionParameter('');
    // Decided that we should hide previous results if we hide.
    setSearchWorkflowOutput([]);
  }

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

  const handleClickWorkflowSearch = useCallback (async (e) => {
    e.preventDefault();
    console.log("", textSearch, ", (typeof textSearch): ", (typeof textSearch));
    if (textSearch !== '') { 
      // findMatchLevenshteinDistance(textSearch); 
      setLoadingSearchWorkflow(true);
      setOldTextSearch(textSearch); 
      setOldSelectionParameter(searchAttribute);
      findExactMatchWorkflowParam(textSearch,searchAttribute);
    }
  }, [textSearch, findExactMatchWorkflowParam]);


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
      setIsWorkflowVisible,
      setSelectedWorkflow,
      _id,
      localStorage?.username
    );
  };

const loadDetailsSearchWorkflow = (_id) => {
  // need to make attributes for the loaded workflow searched for.
  console.log("loadDetailsSearchWorkflow, _id: ",_id);
  getWorkflow(
    setIsSearchWorkflowVisible,
    setSelectedSearchWorkflow,
    _id,
    localStorage?.username
  );

}

  return (
    <div className="workflowManager">
      {/* That's a bit much... */}
      {/* <Title firstLine="Workflow" secondLine="Manager" /> */}
      <h1 className="text-left">Workflow Manager</h1>
      <div className="blockWorkFlow rounded-t-lg">
      <div className="additionWorkFlow icon flex text-lg " onClick={() => handleShowWorkflowAddition()}>
        <HiOutlineViewGridAdd className="mr-[0.25rem]"/>
        Create a new workflow{" "}
        {showWorkflowAddition ? (
            <FaAngleUp className="metadata-icon" />
          ) : (
            <FaAngleDown className="metadata-icon" />
          )}
      </div>
      {showWorkflowAddition && (
        <div className="creationWorkflow">
          Title: <br />
          <input
            type="text" 
            className="textInputWorkflowCreation" 
            placeholder="Write a short title (50 characters max)" 
            ref={titleInputRef} 
            autoComplete="off" 
            required 
            value={titleInput} 
            onChange={handleChangeTitleInput}
          />{" "}
          <br />
          Description: <br />
          <input
            type="text" className="textInputWorkflowCreation" placeholder="Describe shortly the objective of this workflow (300 characters max)" ref={descriptionInputRef} autoComplete="off" required value={descriptionInput} onChange={handleChangeDescriptionInput}
          />{" "}
          <br />
          <em>Once created, you will be able to save objects of interest in your workflow.</em>
          <br />
          <select className='selectPrivacy' value={selectedPrivacyOption} onChange={handleChangeOption}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <br/>
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
                  setWorkflows,
                  [],
                  selectedPrivacyOption
                )
                : console.log("empty title or description. titleInput: ", titleInput, "typeof titleInput: ", typeof titleInput, ", descriptionInput: ", descriptionInput, "typeof descriptionInput: ", typeof descriptionInput);
            }}
          />
        </div>
      )}
      </div>
      <div className="blockWorkFlow">
      <div className="listWorkflows icon flex text-lg" onClick={handleToggleUserWorkflows}>
        <BsCardChecklist className="mr-[0.25rem]"/>
        Your workflows 
        {isWorkflowListVisible ? (
            <FaAngleUp className="metadata-icon" />
          ) : (
            <FaAngleDown className="metadata-icon" />
          )}
      </div>
      {isWorkflowListVisible &&
        workflows.map((item, i) => (
          <div className="containerWorkflowSummary" key={'containerWorkflowSummary_' + i}>
            <div className="workflowDetails" onClick={() => loadDetailWorkflow(item._id)} key={item._id} >
              Title: <u>{item.title}</u>
              {/* | {item.time.replace("T",' ').split(".")[0]} */}
            </div>
            <AiFillDelete className="icon" onClick={() => handleDeleteWorkflow(item._id)} />
          </div>
        ))}
      {isWorkflowVisible && selectedWorkflow &&
        <div className="workflowInterface">
          <h1>Workflow Interface</h1>{" "}<AiOutlineEyeInvisible className="icon" onClick={handleShowWorkflowDetail} />
          <div className="workflowHeader">
            <div className="workFlowTitle">{selectedWorkflow.title}</div> 
            <div className="privacyWorkflowInfo my-[0.5rem]">
                <div className="flex">[{selectedWorkflow.privacy}]
                  <div className='icon flex mx-[0.5rem]' onClick={() => 
                    handleChangeWorkflowPrivacy(selectedWorkflow._id,
                      selectedWorkflow.privacy === 'public' ? 'private' : 'public',
                      selectedWorkflow,
                      setIsWorkflowVisible,
                      setSelectedWorkflow,
                      localStorage?.username
                    )}>
                    {selectedWorkflow.privacy === 'public' ? <BsUnlock /> : <BsLock />} Change to {selectedWorkflow.privacy === 'public' ? 'private' : 'public'}
                  </div>
                </div>
            </div>
            <div className="workFlowDescription">
              <u>Description:</u>
              <br />
              {selectedWorkflow.description}
            </div>
            {/* <em> {selectedWorkflow.author} | {selectedWorkflow.time} | {selectedWorkflow._id} |{" "} {selectedWorkflow.objects.length} objects </em> */}
            <em>Creation: {selectedWorkflow.time.replace('T',' ').split('.')[0]} </em>
            <div className="workflowListObjects">
              {selectedWorkflow.objects.map((item, i) => (
                <div className="workflowObject" key={'workflowObject_' + i}>
                  {/* For testing */}
                  {/* <u>Object id:</u> {item.objectId} | <u>Object type:</u>{" "} {item.objectType} | <u>Object index:</u> {item.objectIndex} <br /> */}
                  <div className="workflowContentDisplay">
                    <b>Content of the {item.objectType}: </b>
                    {item.content ? (
                      <div className="contentItem">
                        {(item.content && item.content.length > 0 )?  
                        (
                          <div className="contentWorkflow">
                              {item.content
                                .slice() // Create a shallow copy of the array to avoid mutating the original
                                .sort((a, b) => a.m_id - b.m_id) // Sort by the m_id property                            
                                .map((contentI, index) => (
                                  <React.Fragment key={'head_contentI_' + index}>
                                    {index === 0 && (
                                      <table className="tableItemContentAndFirst">
                                        <colgroup>
                                          {Object.keys(contentI).map((key) => (
                                            <col key={key} />
                                          ))}
                                        </colgroup>
                                        <thead>
                                          <tr>
                                            {Object.keys(contentI).map((key) => (
                                              <th key={key}>
                                                <b style={{ color: 'white' }}>{key}</b>
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            {Object.values(contentI).map((value, index) => (
                                              <td key={'value_contentI_' + index}>
                                                <div className="tableCellContent">
                                                  {['duration', 'onset'].indexOf(Object.keys(contentI)[index]) === -1
                                                    ? value
                                                    : Number(value).toFixed(2)}
                                                </div>
                                              </td>
                                            ))}
                                          </tr>
                                        </tbody>
                                      </table>
                                    )}
                                    {index > 0 && (
                                      <table className="tableItemContentBody">
                                        <colgroup>
                                          {Object.keys(contentI).map((key) => (
                                            <col key={key} />
                                          ))}
                                        </colgroup>
                                        <tbody>
                                          <tr>
                                            {Object.values(contentI).map((value, index) => (
                                              <td key={'tableItemContentBody_' + index}>
                                                <div className="tableCellContent">
                                                  {['duration', 'onset'].indexOf(Object.keys(contentI)[index]) === -1
                                                    ? value
                                                    : Number(value).toFixed(2)}
                                                </div>
                                              </td>
                                            ))}
                                          </tr>
                                        </tbody>
                                      </table>
                                    )}
                                  </React.Fragment>
                                ))}
                              {item.objectType === 'sample' ? (
                                <div className="sampleWorkflow">
                                  {/* It's a sample (work in progress to include a player){" "}<BsWrenchAdjustable /> */}
                                  <div className='pianoArea'>
                                    <PianoRoll
                                      notes={[...item.content.slice().sort((a, b) => a.m_id - b.m_id).map(a => a.pitch)]}
                                      occurrences={[...item.content.slice().sort((a, b) => a.m_id - b.m_id).map(a => a.onset)]}
                                      durations={[...item.content.slice().sort((a, b) => a.m_id - b.m_id).map(a => a.duration)]}
                                      width={600}
                                      height={200}
                                    />
                                  </div>
                                  <div className="iconsSampleRes">
                                    <WorkflowPlayer
                                      notes={[...item.content.slice().sort((a, b) => a.m_id - b.m_id).map(a => a.pitch)]}
                                      occurences={[...item.content.slice().sort((a, b) => a.m_id - b.m_id).map(a => a.onset)]}
                                      durations={[...item.content.slice().sort((a, b) => a.m_id - b.m_id).map(a => a.duration)]}
                                    />
                                  </div>
                                </div>
                              ) : ('')}
                          </div>
                        )
                        : (<div className="contentWorkflow">No additional content in database for the {item.objectType} </div>)
                        }
                      </div>
                    ) : (
                      <em>Loading content...</em>
                    )}
                    {/* {item.content} {arrayContent.map((o,indx)=>( <div className='content' key={o._id}> id: {o._id}. index: {indx} </div> ))} */}
                  </div>
                  <u>Object note:</u><br /> {item.objectNote} <br />
                  <AiFillDelete
                    className="icon"
                    onClick={() => handleDeleteWorkflowObject(selectedWorkflow._id, item.objectIndex)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      </div>
      <div className="blockWorkFlow rounded-b-lg">
      <div className="workflowSearch icon flex text-lg" onClick={handleToggleSearch}>
        <BiSearchAlt className="mr-[0.25rem]"/>
        Search for workflows 
        {showSearchWorkflow ? (
            <FaAngleUp className="metadata-icon" />
          ) : (
            <FaAngleDown className="metadata-icon" />
          )}

      </div>
      {showSearchWorkflow &&
        (
          <div className="topTextSearchWorkflow mx-[0.5rem] my-[0.25rem]">
            <div className='disclaimerSearchWorkflow'>Workflow search based on
              <select className='selectPrivacy' value={searchAttribute} onChange={handleChangeSearchAttribute}>
                <option value="author">User name</option>
                <option value="track">Track name</option>
              </select>
            </div>
            <input
              type="text"
              className='inputWorkflowSearch'
              placeholder="Enter search here"
              ref={textSearchRef}
              autoComplete="off"
              required 
              value={textSearch}
              onChange={handleChangeQueryWorkflow}
            />
            <button
              className='mx-[0.5rem] my-[0.25rem]'
              onClick={handleClickWorkflowSearch}>
              Submit search
            </button>
            {loadingSearchWorkflow && <AiOutlineLoading className="spin"/>}
          </div>
        )
      }
        <div className="areaSearchWorkflowOutput mx-[1rem] my-[0.25rem] ">
          {showSearchWorkflow && oldTextSearch !== '' &&
            <u className='my-[0.5rem]'>Your search for: {oldTextSearch} with the parameter: {oldSelectionParameter}</u>
          }
          {showSearchWorkflow && searchWorkflowOutput.length > 0 &&
            searchWorkflowOutput.map(a => (
              <div className="searchWorkflowOutput" onClick={() => loadDetailsSearchWorkflow(a._id)} key={a._id}><u>Title:</u> {a.title}, from author: {a.author}, with {a.objects.length} objects.</div>
            ))
          }
          {/* The display of the content of the searched workflow */}
          {isSearchWorkflowVisible && selectedSearchWorkflow &&
        <div className="workflowInterface">
          <h1>Workflow Interface from Search</h1>{" "}<AiOutlineEyeInvisible className="icon" onClick={handleShowSearchWorkflowDetail} />
          <div className="workflowHeader">
            <div className="workFlowTitle">{selectedSearchWorkflow.title}</div> <div className="privacyWorkflowInfo">({selectedSearchWorkflow.privacy})</div>
            <div className="workFlowDescription">
              <u>Description:</u>
              <br />
              {selectedSearchWorkflow.description}
            </div>
            {/* <em> {selectedSearchWorkflow.author} | {selectedSearchWorkflow.time} | {selectedSearchWorkflow._id} |{" "} {selectedSearchWorkflow.objects.length} objects </em> */}
            <em>Creation: {selectedSearchWorkflow.time.replace('T',' ').split('.')[0]} </em>
            <div className="workflowListObjects">
              {selectedSearchWorkflow.objects.map((item, i) => (
                <div className="workflowObject" key={'workflowObject_' + i}>
                  {/* For testing */}
                  {/* <u>Object id:</u> {item.objectId} | <u>Object type:</u>{" "} {item.objectType} | <u>Object index:</u> {item.objectIndex} <br /> */}
                  <div className="workflowContentDisplay">
                    <b>Content of the {item.objectType}: </b>
                    {item.content ? (
                      <div className="contentItem">
                        {(item.content && item.content.length > 0 )?  
                        (
                          <div className="contentWorkflow">
                              {item.content
                                .slice() // Create a shallow copy of the array to avoid mutating the original
                                .sort((a, b) => a.m_id - b.m_id) // Sort by the m_id property                            
                                .map((contentI, index) => (
                                  <React.Fragment key={'head_contentI_' + index}>
                                    {index === 0 && (
                                      <table className="tableItemContentAndFirst">
                                        <colgroup>
                                          {Object.keys(contentI).map((key) => ( <col key={key} /> ))}
                                        </colgroup>
                                        <thead>
                                          <tr>
                                            {Object.keys(contentI).map((key) => (
                                              <th key={key}> <b style={{ color: 'white' }}>{key}</b> </th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr>
                                            {Object.values(contentI).map((value, index) => (
                                              <td key={'value_contentI_' + index}>
                                                <div className="tableCellContent">
                                                  {['duration', 'onset'].indexOf(Object.keys(contentI)[index]) === -1
                                                    ? value
                                                    : Number(value).toFixed(2)}
                                                </div>
                                              </td>
                                            ))}
                                          </tr>
                                        </tbody>
                                      </table>
                                    )}
                                    {index > 0 && (
                                      <table className="tableItemContentBody">
                                        <colgroup> {Object.keys(contentI).map((key) => ( <col key={key} /> ))} </colgroup>
                                        <tbody>
                                          <tr>
                                            {Object.values(contentI).map((value, index) => (
                                              <td key={'tableItemContentBody_' + index}>
                                                <div className="tableCellContent">
                                                  {['duration', 'onset'].indexOf(Object.keys(contentI)[index]) === -1
                                                    ? value
                                                    : Number(value).toFixed(2)}
                                                </div>
                                              </td>
                                            ))}
                                          </tr>
                                        </tbody>
                                      </table>
                                    )}
                                  </React.Fragment>
                                ))}
                              {item.objectType === 'sample' ? (
                                <div className="sampleWorkflow">
                                  <div className='pianoArea'>
                                    <PianoRoll notes={[...item.content.slice().sort((a, b) => a.m_id - b.m_id).map(a => a.pitch)]} occurrences={[...item.content.slice().sort((a, b) => a.m_id - b.m_id).map(a => a.onset)]} durations={[...item.content.slice().sort((a, b) => a.m_id - b.m_id).map(a => a.duration)]} width={600} height={200} />
                                  </div>
                                  <div className="iconsSampleRes">
                                    <WorkflowPlayer notes={[...item.content.slice().sort((a, b) => a.m_id - b.m_id).map(a => a.pitch)]} occurences={[...item.content.slice().sort((a, b) => a.m_id - b.m_id).map(a => a.onset)]} durations={[...item.content.slice().sort((a, b) => a.m_id - b.m_id).map(a => a.duration)]} />
                                  </div>
                                </div>
                              ) : ('')}
                            </div>
                          )
                          : (<div className="contentWorkflow">No additional content in database for the {item.objectType} </div>)
                        }
                      </div>
                    ) : (<em>Loading content...</em>)}
                  </div>
                  <u>Object note:</u><br /> {item.objectNote} <br />
                </div>
              ))}
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default WorkflowManager;
