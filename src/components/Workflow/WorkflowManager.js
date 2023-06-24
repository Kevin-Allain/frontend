import React, { useState, useEffect, useRef } from 'react';
import { HiOutlineViewGridAdd } from 'react-icons/hi'
import {BsCardChecklist} from 'react-icons/bs'
import {TfiSave} from 'react-icons/tfi'
import "./Workflow.css";
import {
    getWorkflow, getWorkflowsInfo, createWorkflow
} from '../../utils/HandleApi'

const WorkflowManager = () => {
    const [isWorkflowsVisible, setIsWorkflowsVisible] = useState(false);
    const [listWorkflows, setListWorkflows] = useState([]);

    // creation
    const [titleInput, setTitleInput] = useState('');
    const titleInputRef = useRef('');
    const [descriptionInput, setDescriptionInput] = useState('');
    const descriptionInputRef = useRef('');
    const [showWorkflowAddition, setShowWorkflowAddition] = useState(false);


    const handleShowWorkflowAddition = () => { setShowWorkflowAddition(!showWorkflowAddition) }
    
    const handleToggleUserWorkflows = () => { 
        getWorkflowsInfo(setListWorkflows, { user: localStorage?.username });
        setIsWorkflowsVisible(prevState => !prevState); 
    }
    const handleChangeTitleInput = (event) => {
        const value = event.target.value;    
        // Let's not allow a title too long
        if (value.length<=50){
            setTitleInput(value)
            console.log("titleInput: ",titleInput)
        }
      }
      const handleChangeDescriptionInput = (event) => {
        const value = event.target.value;    
        // Let's not allow the description to be extremely long
        if (value.length<=300){
            setDescriptionInput(value)
            console.log("descriptionInput: ",descriptionInput)
        }
      }

    useEffect(() => {
        console.log("useEffect Logout for localStorage?.username : ", localStorage?.username)
        if (localStorage?.username) {
            getWorkflowsInfo(setListWorkflows, { user: localStorage?.username });
        }
    }, []);
    // useEffect(() => {
    //     console.log("listWorkflows: ", listWorkflows);
    // }, [ listWorkflows]);


    const loadDetailWorkflow = (_id) => {
        console.log("loadDetailWorkflow. _id: ",_id);
        getWorkflow(_id, localStorage?.username);
    }

    return (
        <div className='workflowManager'>
            <h3> Workflow Manager </h3>
            <div className='additionWorkFlow'>
                Create a new workflow <HiOutlineViewGridAdd  className='icon' onClick={()=> handleShowWorkflowAddition()}/>
            </div>
            {showWorkflowAddition &&
                <div className='creationWorkflow'>
                    Title: <br />
                    <input
                        type="text"
                        placeholder="Write a short title"
                        ref={titleInputRef}
                        autoComplete="off"
                        required
                        value={titleInput}
                        onChange={handleChangeTitleInput}
                    /> <br />
                    Description: <br />
                    <input
                        type="text"
                        placeholder="Describe shortly the objective of this workflow"
                        ref={descriptionInputRef}
                        autoComplete="off"
                        required
                        value={descriptionInput}
                        onChange={handleChangeDescriptionInput}
                    /> <br />
                    <em>All the rest will come later... Please be patient with us</em><br />
                    Save this workflow <TfiSave className='icon' 
                        onClick={() => {
                            (titleInput.length > 0 && descriptionInput.length > 0) ?
                                createWorkflow(
                                    titleInput, 
                                    descriptionInput, 
                                    new Date(), 
                                    localStorage.username,
                                    [],
                                    [],
                                    setTitleInput,
                                    setDescriptionInput,
                                    getWorkflowsInfo,
                                    setListWorkflows
                                    )
                                : console.log("empty title or description. titleInput: ",titleInput
                                ,"typeof titleInput: ",(typeof titleInput)
                                ,", descriptionInput: ",descriptionInput
                                ,"typeof descriptionInput: ",(typeof descriptionInput)
                            )
                        }} />
                </div>
            }
            <div className='listWorkflows'>
                Your workflows <BsCardChecklist className='icon' onClick={handleToggleUserWorkflows} /> <br/>
                {isWorkflowsVisible &&
                listWorkflows.map((item, i) => (
                    <div className='workflowDetails' onClick={() => loadDetailWorkflow(item._id)}>
                        Title: {item.title} | {item.time} | {item._id}
                    </div>
                ))
                }
            </div>
        </div>
    )

}

export default WorkflowManager;
