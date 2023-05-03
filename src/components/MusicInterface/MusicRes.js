import React from 'react'
import {BiEdit} from 'react-icons/bi'
import {AiFillDelete} from 'react-icons/ai'

const MusicRes = ({text,updateMode,deleteJazzDap}) => {
    return (
        <div className="musicres">
            <div className="text">{text}</div>
            {/* <div className="icons">
                <BiEdit className='icon' onClick={console.log("MusicRes biedit")} />
                <AiFillDelete className='icon' onClick={console.log("MusicRes aifilldelete")} />
            </div> */}
        </div>
    );
}

export default MusicRes