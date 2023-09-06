import React, { useState, useEffect } from 'react';
import { HiOutlineComment } from 'react-icons/hi'
import Comment from './Comment'
import "./CommentSystem.css"
import {
    addComment,
    updateComment,
    getComments,
    deleteComment,
    getCommentsOfAnnotation
} from "../../utils/HandleApi";

const CommentSystem = ({
    type,
    info,
    indexAnnotation = 0,
    annotationId = null
}) => {

    const [textInputComment, setTextInputComment] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [commentId, setCommentId] = useState("");

    const [showInputComment, setShowInputComment] = useState(false);

    const [listComments, setListComments] = useState([]);

    useEffect(() => {
        console.log('useEffect CommentSystem. type: ', type,', info: ', info,', indexAnnotation: ', indexAnnotation,', annotationId', annotationId)
        // getComments( setListComments, localStorage.username ? localStorage.username : null, annotationId );
        getCommentsOfAnnotation( setListComments, localStorage.username ? localStorage.username : null, annotationId );
    }, []);


    const updateMode = (_id, text) => {
        console.log("updateMode CommentSystem. text: ", text);
        setIsUpdating(true);
        setTextInputComment(text);
        setCommentId(_id);
    };

    const handleShowAndLoad = (getComments) => {
        setShowInputComment(!showInputComment)
        console.log("handleShowAndLoad ± indexAnnotation: ", indexAnnotation, ", getComments: ", getComments, ", showInputComment: ", showInputComment, ", annotationId: ",annotationId, ", (typeof annotationId): ",(typeof annotationId))
        if (!showInputComment) {
            // getComments( setListComments,  localStorage.username ? localStorage.username : null,  annotationId );
            getCommentsOfAnnotation(setListComments,  localStorage.username ? localStorage.username : null,annotationId)
        }
    }

    return (
        <div className="commentInput">
            <div className='areaComment'>
                {/* TODO Change display according to who is connected!!! beforePrivateBeta */}
                <div className='areaInputComment'>
                    <input
                        type="text"
                        placeholder={"Add comment"}
                        name="AddComment"
                        id="AddComment"
                        className='comment'
                        value={textInputComment}
                        onChange={(e) => setTextInputComment(e.target.value)} />
                    <div className="add" onClick={isUpdating
                        ? () => updateComment(
                            commentId,
                            textInputComment,
                            setTextInputComment,
                            setListComments,
                            setIsUpdating,
                            localStorage?.username,
                            annotationId)
                        : () => addComment(
                            type,
                            info,
                            indexAnnotation,
                            textInputComment,
                            setTextInputComment,
                            setListComments,
                            localStorage?.username,
                            annotationId)
                    }
                    >
                        {isUpdating ? "Update" : "Add"}
                    </div>
                </div>
                <div className='areaDisplayComment'>
                    {listComments.map((item, i) => (
                        <div key={i} className='comment-wrapper'>
                            <div className="vertical-line" />
                            <Comment
                                key={item._id}
                                commentInput={item.commentInput}
                                annotationId={annotationId}
                                commentId={item._id}
                                info={item.info}
                                type={item.type}
                                author={item.author}
                                privacy={item.privacy}
                                time={item.time}
                                // TODO (and think about more) e.g. star, +1, -1 from people
                                updateMode={() => updateMode(
                                    item._id, 
                                    item.commentInput, 
                                    localStorage?.username
                                )}
                                deleteComment={() => deleteComment(
                                    item._id, 
                                    setListComments,
                                    localStorage?.username,
                                    annotationId                                    
                                )} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default CommentSystem;
