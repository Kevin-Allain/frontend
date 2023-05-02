import React from 'react'
import {BiEdit} from 'react-icons/bi'
import {AiFillDelete} from 'react-icons/ai'

const JazzDap = ({text,updateMode,deleteJazzDap}) => {
    return (
        <div className="jazzdap">
            <div className="text">{text}</div>
            <div className="icons">
                <BiEdit className='icon' onClick={updateMode} />
                <AiFillDelete className='icon' onClick={deleteJazzDap} />
            </div>
        </div>
    );
}

export default JazzDap