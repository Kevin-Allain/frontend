import React, { useState, useEffect } from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import {FaRegStickyNote} from 'react-icons/fa'
import WorkflowManager from '../Workflow/WorkflowManager'
import {
    getUserAnnotations,
} from '../../utils/HandleApi'

const UserSystem = () => {

    // user info
    const [isAnnotationsVisible, setIsAnnotationsVisible] = useState(false);
    const [listAnnotations, setListAnnotations] = useState([]);

    const handleToggleUserAnnotations = () => {
        setIsAnnotationsVisible(prevState => !prevState);
      };
    useEffect(() => {
        console.log("useEffect Logout for localStorage?.username : ", localStorage?.username)
        if (localStorage?.username) {
            setListAnnotations((prevArray) => [...prevArray, '' + new Date()])
            getUserAnnotations(setListAnnotations, localStorage.username);
        }
    }, []);
    useEffect(() => {
        console.log("listAnnotations: ", listAnnotations);
    }, [listAnnotations]);


    return (
        <div className='userInfo'>
            {/* Your annotations <FaRegStickyNote className='icon' onClick={handleToggleUserAnnotations} /><br/> */}
            {isAnnotationsVisible && (
                <div className='userInfoBox' >
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
            <WorkflowManager />

        </div>
    )
}

export default UserSystem;
