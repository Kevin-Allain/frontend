import React, { useState } from 'react';
import { AiOutlineComment, AiOutlineStar } from 'react-icons/ai' // doubt about inclusion of star button for annotation...
import {BiEdit} from 'react-icons/bi'
import {AiFillDelete} from 'react-icons/ai'
import CommentSystem from '../Comment/CommentSystem';

const Annotation = ({
  type,
  info = '',
  indexAnnotation=0,
  annotationInput,
  author,
  deleteAnnotation,
  updateMode,
  handleShowAndLoadCommentsSystem,
  privacy = 'public',
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
      Annotation for <em>{type}</em> written by <em>{(author === null)? '?' : author } - IndexAnnotation: {indexAnnotation}</em>
      {/* {(info === '') ? <></> : <><p>About info: {info}</p></>} */}
      <h4><div className='annotationText'>{annotationInput}</div></h4>
      {/* <AiOutlineStar className='icon' onClick={ () => console.log("star pressed") } /> */}
      <BiEdit className='icon' onClick={updateMode} />
      <AiFillDelete className='icon' onClick={deleteAnnotation} />
      {/* TODO set a CommentSystem according to this annotation when clicking on the icon */}
      {/* Probably a function passed such as getComments */}
      <AiOutlineComment className='icon'   onClick={ handleToggleCommentSystem }
      />
      {isCommentSystemVisible && (
        <CommentSystem type={type} info={info} indexAnnotation={indexAnnotation} />
      )}

    </div>
  );
};

export default Annotation;
