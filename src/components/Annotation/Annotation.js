import React, { useState } from 'react';
import { AiOutlineComment } from 'react-icons/ai' // doubt about inclusion of star button for annotation...
import { BiEdit } from 'react-icons/bi'
import { AiFillDelete } from 'react-icons/ai'
import CommentSystem from '../Comment/CommentSystem';
import EmbeddedWorkflowInteraction from '../Workflow/EmbeddedWorkflowInteraction';

const Annotation = ({
  type,
  _id = null,
  info = '',
  indexAnnotation = 0,
  annotationInput,
  author,
  deleteAnnotation,
  updateMode,
  handleShowAndLoadCommentsSystem,
  privacy = 'public',
  time = null,
  starred_by = [],
  collaborators = []
}) => {
  // display of info (and type) are not really relevant...

  const [comments, setComments] = useState([]);
  const [isCommentSystemVisible, setCommentSystemVisible] = useState(false);

  const handleToggleCommentSystem = () => {
    if (!isCommentSystemVisible) {
      // loadComments(); // TODO
    }
    setCommentSystemVisible(prevState => !prevState);
  };


  return (
    <div className='annotation'>
      Annotation for <em>{type}</em> written by <em>{(author === null) ? '?' : author} - IndexAnnotation: {indexAnnotation}</em> - Privacy: <b>{privacy}</b> <em>{time}</em> Unique Id: {_id}
      {/* {(info === '') ? <></> : <><p>About info: {info}</p></>} */}
      <h4><div className='annotationText'>{annotationInput}</div></h4>
      {/* <AiOutlineStar className='icon' onClick={ () => console.log("star pressed") } /> */}
      {/* afterPrivateBeta NOT SECURED APPROACH: Needs to be based on the token of the user who made the content! */}
      {typeof (localStorage.token) !== 'undefined' && localStorage.username === author &&
        <>
          <BiEdit className='icon' onClick={updateMode} />
          <AiFillDelete className='icon' onClick={deleteAnnotation} />
        </>
      }
      {/* TODO set a CommentSystem according to this annotation when clicking on the icon */}
      {/* Probably a function passed such as getComments */}
      <AiOutlineComment className='icon' onClick={handleToggleCommentSystem} />
      {typeof (localStorage.token) !== 'undefined' &&
        <EmbeddedWorkflowInteraction idCaller={_id} typeCaller={"annotation"} />
      }
      {/* TODO fix the issue with the loading */}
      {isCommentSystemVisible && (
        <CommentSystem type={type} info={info} indexAnnotation={indexAnnotation} annotationId={_id} />
      )}
    </div>
  );
};

export default Annotation;
