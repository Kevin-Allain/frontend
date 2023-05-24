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
                Song:<br />{text.substr(text.indexOf("-")+1)} </div>
                <AnnotationSystem 
                    type={"track"}
                    info={text.substr(text.indexOf("-")+1)}
                    // index = {Number(text.split('-')[0])}
                    addAnnotation={addAnnotation}
                    getAnnotations = {getAnnotations}
                    updateAnnotation={updateAnnotation}
                    deleteAnnotation={deleteAnnotation}                
                />
            <div className='lognumber'>
                Recording: {lognumber}</div>
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
            <AnnotationSystem 
                    type={"sample"}
                    info={text.substr(text.indexOf("-")+1)+"_"+notes}
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