import React, { useState } from 'react';
import { AiOutlineStar } from 'react-icons/ai' // doubt about inclusion of star button for annotation...

const Annotation = ({
  type,
  info = '',
  text,
  user,
  privacy = 'private',
  starred_by = []
}) => {

  return (
    <div className='annotation'>
      <h4>Annotation for {type}</h4>
      {(info === '') ? <></> : <><p>About info: {info}</p></>}
      <div className='annotationText'>{text}</div>
      {/* <AiOutlineStar className='icon' onClick={ () => console.log("star pressed") } /> */}
    </div>
  );
};

export default Annotation;
