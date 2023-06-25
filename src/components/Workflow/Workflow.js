import React, { useState } from 'react';
import { AiOutlineComment } from 'react-icons/ai' // doubt about inclusion of star button for annotation...
import {BiEdit} from 'react-icons/bi'
import {AiFillDelete} from 'react-icons/ai'
import CommentSystem from '../Comment/CommentSystem';

const Workflow = ({
    _id, title, description, time, author, objects = [], objectsTimes = []
}) => {
  // display of info (and type) are not really relevant...

  

  return (
    <div className='workflow'>
      <h4><em>{title}</em></h4> written by <em>{(author === null)? '?' : author }</em> <br/>
      {description} <br/>
      ({time}) <br/>
      We are working on the development of functionalities to assign objects to the workflows.
    </div>
  );
};

export default Workflow;
