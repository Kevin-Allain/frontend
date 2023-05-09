import {useState} from 'react'
import {FiPlayCircle} from 'react-icons/fi'
import {BsInfoCircleFill} from 'react-icons/bs'
import MusicInfo from "./MusicInfo"


const MusicRes = ({text, lognumber, length, notes, durations, times, distance, funcPlayMIDI, getMusicInfo, infoMusicList }) => {

    return (
        <div className="musicres">
            <div className="text">Song:<br />{text}
                <div className="infoMusic"> <BsInfoCircleFill className='icon' onClick={getMusicInfo} /> </div>
                {(infoMusicList.length <= 0) ? (<></>) :
                    infoMusicList.map((item, i) => (
                        lognumber !== item.lognumber? (<></>) : 
                        <MusicInfo className='musicinfo'
                            key={i + '' + item.text}
                            lognumber={item.lognumber}
                            contents={item.contents}
                        />
                    )
                    )
                }
            </div>
            <div className='lognumber'>lognumber: {lognumber}</div>
            <div className="length">Length:<br />{length}</div>
            <div className="notes">Notes:<br />{notes}</div>
            <div className="times">Times:<br />{times}</div>
            <div className="distance">Distance:<br />{distance}</div>
            <div className="durations">Durations:<br />{durations}</div>
            <div className="iconsMusicRes">
                <FiPlayCircle className='icon' onClick={funcPlayMIDI} />
            </div>
        </div>
    );
}

export default MusicRes