import React, { useState } from 'react';
import { AiOutlineStar } from 'react-icons/ai' // doubt about inclusion of star button for annotation...
import {AiFillDelete} from 'react-icons/ai'

const Annotation = ({
  type,
  info = '',
  annotationInput,
  user,
  deleteAnnotation,
  privacy = 'private',
  starred_by = []
}) => {

  // display of info (and type) are not really relevant...

  return (
    <div className='annotation'>
      Annotation for {type}
      {/* {(info === '') ? <></> : <><p>About info: {info}</p></>} */}
      <h4><div className='annotationText'>{annotationInput}</div></h4>
      {/* <AiOutlineStar className='icon' onClick={ () => console.log("star pressed") } /> */}
      <AiFillDelete className='icon' onClick={deleteAnnotation} />
    </div>
  );
};

export default Annotation;
