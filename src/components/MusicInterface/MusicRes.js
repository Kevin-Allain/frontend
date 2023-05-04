import React from 'react'
import {FiPlayCircle} from 'react-icons/fi'

/**
 * We intend to make a component that can list results of licks queries, play it in Mp3 and MIDI, and display information about the song it comes from
 * @param {*} param0 
 * @returns 
 */
const MusicRes = ({text, funcPlayMIDI, updateMode=null}) => {
    return (
        <div className="musicres">
            <div className="text">{text}</div>
            <div className="iconsMusicRes">
                <FiPlayCircle className='icon' onClick={ funcPlayMIDI } />
            </div>
        </div>
    );
}

export default MusicRes