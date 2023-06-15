import React, { useState, useEffect } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import {FaRegStickyNote} from 'react-icons/fa'
import {BsCardChecklist} from 'react-icons/bs'
import {
    getUserAnnotations,
    getUserWorkflows
} from '../../utils/HandleApi'

const UserSystem = () => {

    // user info
    const [localUsername, setLocalUsername] = useState(localStorage?.username || '');
    const [isAnnotationsVisible, setIsAnnotationsVisible] = useState(false);
    const [listAnnotations, setListAnnotations] = useState([]);
    const [isWorkflowsVisible, setIsWorkflowsVisible] = useState(false);
    const [listWorkflows, setListWorkflows] = useState([]);


    const handleToggleUserAnnotations = () => {
        setIsAnnotationsVisible(prevState => !prevState);
      };
    const handleToggleUserWorkflows = () => {
        setIsWorkflowsVisible(prevState => !prevState);
    }      
    useEffect(() => {
        console.log("useEffect Logout for localStorage?.username : ", localStorage?.username)
        if (localStorage?.username) {
            setListAnnotations((prevArray) => [...prevArray, '' + new Date()])
            getUserAnnotations(setListAnnotations, localStorage.username);

            setListWorkflows((prevArray) => [...prevArray, '' + new Date()])
            getUserWorkflows(setListWorkflows, localStorage.username);

        }
    }, []);
    useEffect(() => {
        console.log("listWorkflows: ",listWorkflows);
        console.log("listAnnotations: ", listAnnotations);
    }, [listAnnotations, listWorkflows]);


    return (
        <div className='userInfo'>
            Your annotations <FaRegStickyNote className='icon' onClick={handleToggleUserAnnotations} /><br/>
            {isAnnotationsVisible && (
                <div className='userInfo' >
                    {listAnnotations.length > 0 ?
                        listAnnotations.map((item) => (
                            <div className='userAnnotation'>
                                _id is {item._id}, type is {item.type}, info is <u>{item.info}</u>, privacy is {item.privacy} @{item.time}.
                            </div>
                        ))
                        : <>Empty</>
                    }
                </div>
            )}
            Your workflows <BsCardChecklist className='icon' onClick={handleToggleUserWorkflows} />

        </div>
    )
}

export default UserSystem;
