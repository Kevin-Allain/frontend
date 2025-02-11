import React, { useState } from 'react';
import { AiOutlineComment, AiOutlineStar } from 'react-icons/ai' // doubt about inclusion of star button for annotation...
import { BiEdit } from 'react-icons/bi'
import { AiFillDelete } from 'react-icons/ai'
import EmbeddedWorkflowInteraction from '../Workflow/EmbeddedWorkflowInteraction';

// Comments are meant to be public only. They are set as discussions for the annotations by researchers
const Comment = ({
    annotationId,
    commentId,
    commentInput,
    author,
    deleteComment,
    updateMode,
    time = null
}) => {

    console.log("time: ",time);

    return (
        <div className='comment'>
            <em>{author}</em> 
            {time===null?(<></>)
            : (<> at <em>{time.replaceAll('T', ' ').split('.')[0]}</em> </> )} <br />
            <div className='mx-[1rem]'>{commentInput}</div>
            {/* afterPrivateBeta NOT SECURED APPROACH: Needs to be based on the token of the user who made the content! */}
            {typeof (localStorage.token) !== 'undefined' && localStorage.username === author &&
                <>
                    <div className='flex'>
                        <BiEdit className='icon' onClick={updateMode} />
                        <AiFillDelete className='icon' onClick={deleteComment} />
                    </div>
                </>
            }
            {/* <br/> <em>The annotationId is {annotationId}</em> <br/> <em>The commentId is {commentId}</em> */}
            {typeof (localStorage.token) !== 'undefined' &&
                <EmbeddedWorkflowInteraction idCaller={commentId} typeCaller={"comment"} />
            }
        </div>
    );
}

export default Comment;