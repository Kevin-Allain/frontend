import React, { useState } from 'react';
import { HiOutlineComment } from 'react-icons/hi'
import Comment from './Comment'
import "./CommentSystem.css"
import {
    addComment,
    updateComment,
    getComments,
    deleteComment
} from "../../utils/HandleApi";


const CommentSystem = ({
    type,
    info,
    index = 0,
}) => {

    const [textInputComment, setTextInputComment] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [commentId, setCommentId] = useState("");

    const [showInputComment, setShowInputComment] = useState(false);

    const [listComments, setListComments] = useState([]);

    const updateMode = (_id, text) => {
        console.log("updateMode CommentSystem. text: ", text);
        setIsUpdating(true);
        setTextInputComment(text);
        setCommentId(_id);
    };

    const handleShowAndLoad = (type, info, getComments) => {
        setShowInputComment(!showInputComment)
        console.log("type: ", type, ", info: ", info, ", index: ", index, ", getComments: ", getComments, ", showInputComment: ", showInputComment)
        if (!showInputComment) {
            getComments(type, info, setListComments, index, localStorage.username ? localStorage.username : null);
        }
    }

    return (
        <div className="commentInput">
                <div className='areaComment'>
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
                            ? () => updateComment(commentId, textInputComment, setTextInputComment, index, type, info,
                                setListComments, setIsUpdating,
                                localStorage?.username)
                            : () => addComment(type, info, index, textInputComment,
                                setTextInputComment,
                                setListComments,
                                localStorage?.username)
                        }
                        >
                            {isUpdating ? "Update" : "Add"}
                        </div>
                    </div>
                    <div className='areaDisplayComment'>
                        {listComments.map((item) => (
                            <Comment
                                key={item._id}
                                commentInput={item.commentInput}
                                info={item.info}
                                type={item.type}
                                author={item.author}
                                privacy={item.privacy}
                                // TODO (and think about more) e.g. star
                                updateMode={
                                    () => updateMode(item._id, item.commentInput, localStorage?.username)}
                                deleteComment={() => deleteComment(item._id, item.type, item.info, setListComments)}
                            />
                        ))}
                    </div>
                </div>
        </div>
    )
}


export default CommentSystem;
