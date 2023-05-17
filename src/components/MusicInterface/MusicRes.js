import { useState } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import MusicInfo from "./MusicInfo"


const MusicRes = ({ text, lognumber, length, notes, durations, times, distance, funcPlayMIDI, getMusicInfo, infoMusicList }) => {

    return (
        <div className="musicres" key={text}>
            <div className="text">
                Song:<br />{text} </div>
            <div className='lognumber'>
                lognumber: {lognumber}</div>
            <div className="length">
                Length:<br />{length}</div>
            <div className="notes">
                Notes:<br />{notes}</div>
            <div className="times">
                Times:<br />{times}</div>
            <div className="distance">
                Distance (difference to query):<br />{distance}</div>
            <div className="durations">
                Durations:<br />{durations}</div>
            <div className="iconsMusicRes">
                <FiPlayCircle className='icon'
                    onClick={funcPlayMIDI} />
            </div>
        </div>
    );
}

export default MusicRes