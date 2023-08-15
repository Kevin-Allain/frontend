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
import EmbeddedWorkflowInteraction from '../Workflow/EmbeddedWorkflowInteraction';


const TrackRes = ({ 
    text, 
    // lognumber, // length, // notes, // durations, // times, // distance, // funcPlayMIDI,  // getMusicInfo, 
    infoMusicList, 
    // addAnnotation, // getAnnotations, // updateAnnotation, // deleteAnnotation, 
    listSearchRes,
    formatAndPlay,
    getMusicInfo,
    setInfoMusicList
 }) => {

    return (
        <div className="trackres" key={text}>
            <div className="texttrackres">
                <h3>Track: {text} </h3> 
            </div>
            <AnnotationSystem type={"track"} info={text} />
            <EmbeddedWorkflowInteraction idCaller={listSearchRes[0].arrIdNotes[0]}  typeCaller={"track"}/>

            {listSearchRes.map((item, i) => ( 
                <SampleRes
                // key={i + '' + item.recording + '_' + item.arrNotes.toString().replaceAll(',', '-')}
                text={i + '-' + item.recording}
                lognumber={item.recording.split('-')[0]}
                length={item.arrTime[item.arrTime.length - 1] + item.arrDurations[item.arrDurations.length - 1] - item.arrTime[0]}
                notes={item.arrNotes.toString().replaceAll(',', '-')}
                durations={item.arrDurations.toString().replaceAll(',', '-')}
                times={item.arrTime.toString().replaceAll(',', '-')}
                distance={item.distCalc}
                // addition
                idDBNotes = {item.arrIdNotes}
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