import { useState } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import MusicInfo from "./MusicInfo"
import SampleRes from './SampleRes';
import {
    addAnnotation,
    updateAnnotation,
    getAnnotations,
    deleteAnnotation
} from "../../utils/HandleApi";
import AnnotationSystem from '../Annotation/AnnotationSystem';


const TrackRes = ({ 
    text, 
    // lognumber, // length, // notes, // durations, // times, // distance, 
    // funcPlayMIDI, 
    // getMusicInfo, 
    infoMusicList, 
    // addAnnotation,
    // getAnnotations,
    // updateAnnotation,
    // deleteAnnotation, 
    listSearchRes,
    formatAndPlay,
    getMusicInfo,
    setInfoMusicList
 }) => {

    return (
        <div className="trackres" key={text}>
            <div className="text">
                <h2>Track: {text} </h2> 
            </div>
            <AnnotationSystem
                type={"track"}
                info={text}
                // index = {Number(text.split('-')[0])}
                // addAnnotation={addAnnotation}
                // getAnnotations={getAnnotations}
                // updateAnnotation={updateAnnotation}
                // deleteAnnotation={deleteAnnotation}
            />

            {listSearchRes.map((item, i) => ( 
                <SampleRes 
                key={i + '' + item.recording + '_' + item.arrNotes.toString().replaceAll(',', '-')}
                text={i + '-' + item.recording}
                lognumber={item.recording.split('-')[0]}
                length={item.arrTime[item.arrTime.length - 1] + item.arrDurations[item.arrDurations.length - 1] - item.arrTime[0]}
                notes={item.arrNotes.toString().replaceAll(',', '-')}
                durations={item.arrDurations.toString().replaceAll(',', '-')}
                times={item.arrTime.toString().replaceAll(',', '-')}
                distance={item.distCalc}
                // Need to format the structure 
                funcPlayMIDI={() => formatAndPlay(item)}
                getMusicInfo={() => getMusicInfo(item.recording, infoMusicList, setInfoMusicList)}
                infoMusicList={infoMusicList}
                />
            ))}

        </div>
    );
}

export default TrackRes