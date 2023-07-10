import { useEffect, useState } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import MusicInfo from "./MusicInfo"
import AnnotationSystem from '../Annotation/AnnotationSystem';
import EmbeddedWorkflowInteraction from '../Workflow/EmbeddedWorkflowInteraction';


const SampleRes = ({ 
    key,
    text, 
    lognumber, 
    length, 
    notes, 
    durations, 
    times, 
    distance, 
    idDBNotes,
    funcPlayMIDI, 
    getMusicInfo, 
    infoMusicList, 
 }) => {

    // key is undefined... this isn't good!
    
    return (
        <div className="sampleres" key={key}>
            {/* <div className="text">
                <h2>Song: {text.substr(text.indexOf("-") + 1)} </h2> </div>
            <AnnotationSystem
                type={"track"}
                info={text.substr(text.indexOf("-") + 1)}
                // index = {Number(text.split('-')[0])}
            /> */}
            <table>
                <thead>
                    <tr>
                        <th>Recording</th>
                        <th>Sample Duration</th>
                        <th>Notes</th>
                        <th>Times</th>
                        <th>Durations</th>
                        <th>Distance (difference to query)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>{lognumber}</th>
                        <th>{Number(length.toFixed(2))}</th>
                        <th>{notes}</th>
                        <th>{times}</th>
                        <th>{durations}</th>
                        <th>{distance}</th>
                    </tr>
                </tbody>
            </table> 

            <div className='buttonSampleRes'>
                <div className="iconsSampleRes">
                    <FiPlayCircle className='icon'
                        onClick={funcPlayMIDI} />
                </div>
                <AnnotationSystem 
                        type={"sample"}
                        info={text.substr(text.indexOf("-")+1)+"_"+notes+'_'+Number(text.split('-')[0])}
                        index={Number(text.split('-')[0])}
                    />
                {/* The indexRange is a way to know how many objects after the notes should be first one of the sample */}
                <EmbeddedWorkflowInteraction 
                    typeCaller={"sample"} 
                    idCaller={idDBNotes[0]} 
                    indexRange={idDBNotes.length}
                />
            </div>
        </div>
    );
}

export default SampleRes