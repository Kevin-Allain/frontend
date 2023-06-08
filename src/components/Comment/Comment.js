import React, { useState } from 'react';
import { AiOutlineComment, AiOutlineStar } from 'react-icons/ai' // doubt about inclusion of star button for annotation...
import {BiEdit} from 'react-icons/bi'
import {AiFillDelete} from 'react-icons/ai'

// Comments are meant to be public only. They are set as discussions for the annotations by researchers
const Comment = ({
    annotationId,
    commentInput,
    author,
    deleteComment,
    updateMode,
    time=null
}) => {

    return (
        <div className='comment'>
            <em>{author}</em> <br/>
            {commentInput}
            <BiEdit className='icon' onClick={updateMode}/>
            <AiFillDelete className='icon' onClick={deleteComment} />
            <br/> {time}
            <br/> <em>The annotationId is {annotationId}</em>
        </div>
    );
}

export default Comment;