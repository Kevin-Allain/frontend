import React, { useState } from 'react';
import { AiOutlineComment, AiOutlineStar } from 'react-icons/ai' // doubt about inclusion of star button for annotation...
import {BiEdit} from 'react-icons/bi'
import {AiFillDelete} from 'react-icons/ai'
import EmbeddedWorkflowInteraction from '../Workflow/EmbeddedWorkflowInteraction';

// Comments are meant to be public only. They are set as discussions for the annotations by researchers
const Comment = ({
    annotationId,
    commentId,
    commentInput,
    author,
    deleteComment,
    updateMode,
    time=null
}) => {

    return (
        <div className='comment'>
            <em>{author}</em> at <em>{time.replaceAll('T',' ').split('.')[0]}</em> <br/>
            {commentInput}
            <BiEdit className='icon' onClick={updateMode}/>
            <AiFillDelete className='icon' onClick={deleteComment} />
            
            {/* <br/> <em>The annotationId is {annotationId}</em> <br/> <em>The commentId is {commentId}</em> */}
            <EmbeddedWorkflowInteraction idCaller={commentId} typeCaller={"comment"}/>
        </div>
    );
}

export default Comment;