import React, { useState } from 'react';
import { AiOutlineComment, AiOutlineStar } from 'react-icons/ai' // doubt about inclusion of star button for annotation...
import {BiEdit} from 'react-icons/bi'
import {AiFillDelete} from 'react-icons/ai'


const Annotation = ({
  type,
  info = '',
  index=0,
  annotationInput,
  author,
  deleteAnnotation,
  updateMode,
  privacy = 'public',
  starred_by = [],
  collaborators = []
}) => {

  // display of info (and type) are not really relevant...

  return (
    <div className='annotation'>
      Annotation for <em>{type}</em> written by <em>{(author === null)? '?' : author }</em>
      {/* {(info === '') ? <></> : <><p>About info: {info}</p></>} */}
      <h4><div className='annotationText'>{annotationInput}</div></h4>
      {/* <AiOutlineStar className='icon' onClick={ () => console.log("star pressed") } /> */}
      <BiEdit className='icon' onClick={updateMode} />
      <AiFillDelete className='icon' onClick={deleteAnnotation} />
      <div class="line"></div>
      <AiOutlineComment className='icon' onClick={ () => console.log("should set comments")} />
    </div>
  );
};

export default Annotation;
