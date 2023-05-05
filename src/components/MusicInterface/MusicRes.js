import React from 'react'
import {FiPlayCircle} from 'react-icons/fi'

/**
 * We intend to make a component that can list results of licks queries, play it in Mp3 and MIDI, and display information about the song it comes from
 * @param {*} param0 
 * @returns 
 */
const MusicRes = ({text, length, notes, durations, times, distance, funcPlayMIDI, updateMode=null}) => {
    return (
        <div className="musicres">
            <div className="text">Song:<br/>{text}</div>
            <div className="length">Length:<br/>{length}</div>
            <div className="notes">Notes:<br/>{notes}</div>
            <div className="times">Times:<br/>{times}</div>
            <div className="distance">Distance:<br/>{distance}</div>
            <div className="durations">Durations:<br/>{durations}</div>
            <div className="iconsMusicRes">
                <FiPlayCircle className='icon' onClick={ funcPlayMIDI } />
            </div>
        </div>
    );
}

export default MusicRes