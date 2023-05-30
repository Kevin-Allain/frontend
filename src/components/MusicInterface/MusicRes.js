import { useState } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import MusicInfo from "./MusicInfo"
import AnnotationSystem from '../Annotation/AnnotationSystem';


const MusicRes = ({ 
    text, 
    lognumber, 
    length, 
    notes, 
    durations, 
    times, 
    distance, 
    funcPlayMIDI, 
    getMusicInfo, 
    infoMusicList, 
    addAnnotation,
    getAnnotations,
    updateAnnotation,
    deleteAnnotation
 }) => {

    return (
        <div className="musicres" key={text}>
            <div className="text">
                Song: {text.substr(text.indexOf("-") + 1)} </div>
            <AnnotationSystem
                type={"track"}
                info={text.substr(text.indexOf("-") + 1)}
                // index = {Number(text.split('-')[0])}
                addAnnotation={addAnnotation}
                getAnnotations={getAnnotations}
                updateAnnotation={updateAnnotation}
                deleteAnnotation={deleteAnnotation}
            />
            <table>
                <thead>
                    <tr>
                        <th>Recording</th>
                        <th>Duration</th>
                        <th>Notes</th>
                        <th>Times</th>
                        <th>Distance (difference to query)</th>
                        <th>Durations</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>{lognumber}</th>
                        <th>{length}</th>
                        <th>{notes}</th>
                        <th>{times}</th>
                        <th>{distance}</th>
                        <th>{durations}</th>
                    </tr>
                </tbody>
            </table> 

            <div className="iconsMusicRes">
                <FiPlayCircle className='icon'
                    onClick={funcPlayMIDI} />
            </div>
            <AnnotationSystem 
                    type={"sample"}
                    info={text.substr(text.indexOf("-")+1)+"_"+notes+'_'+Number(text.split('-')[0])}
                    index={Number(text.split('-')[0])}
                    addAnnotation= {addAnnotation}
                    getAnnotations = {getAnnotations}
                    updateAnnotation={updateAnnotation}
                    deleteAnnotation={deleteAnnotation}
                />
        </div>
    );
}

export default MusicRes