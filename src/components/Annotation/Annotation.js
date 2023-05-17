import React, { useState } from 'react';
import {AiOutlineStar} from 'react-icons/ai' // doubt about inclusion of star button for annotation...

const Annotation = ({ type, text, user, privacy, starred_by }) => {

  return (
    <div className='annotation'>
      <h4>Annotation for {type}</h4>
      <div className='annotationText'>{text}</div>
      {/* <AiOutlineStar className='icon' onClick={ () => console.log("star pressed") } /> */}
    </div>
  );
};

export default Annotation;
