import { useEffect, useState } from 'react'
import { FiPlayCircle } from 'react-icons/fi'
import MusicInfo from "./MusicInfo"
import AnnotationSystem from '../Annotation/AnnotationSystem';
import EmbeddedWorkflowInteraction from '../Workflow/EmbeddedWorkflowInteraction';
import PianoRoll from '../VisComponents/PianoRoll';
import * as Tone from "tone";
import MIDItoNote from './MIDItoNote.json';

const sampler = new Tone.Sampler({
    urls: { "C4": "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", "A4": "A4.mp3", },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

const handlePlayNotes = (notes,durations,times) => {
    console.log("handlePlayNotes");
    const now = Tone.now();
    // console.log("handlePlayNotes notes: ", notes, ", durations: ", durations,", times: ",times);
    if (typeof notes === 'undefined') { return; }
    let arrNotes = notes.split('-');
    let arrDur = durations.split('-');
    let arrTimes = times.split('-').map(a => Number(a));
    const firstTime = arrTimes[0];
    const adjustedTimes = arrTimes.map(a => now+a-firstTime);
    for (let i=0; i < arrNotes.length; i++) {
        sampler.triggerAttackRelease([MIDItoNote[arrNotes[i]]], arrDur[i], adjustedTimes[i]); //   synth.current.triggerAttackRelease(note, "8n", now + 0.25);
    }
};


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
    // getMusicInfo, infoMusicList, 
 }) => {
    
    return (
        <div className="sampleres" key={key}>
            {/* <div className="text"> <h2>Song: {text.substr(text.indexOf("-") + 1)} </h2> </div> <AnnotationSystem type={"track"} info={text.substr(text.indexOf("-") + 1)} /> */}
            {/* ==== Piano Roll === */}
            {/* <div className='contentSample'> </div> */}
            <div className='pianoArea'>
                <PianoRoll
                    notes={notes}
                    occurrences={times}
                    durations={durations}
                    width={600}
                    height={200}
                />
            </div>
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
            
            {/* <PianoRoll notes={notes.split("-").map(Number)} occurrences={times.split("-").map(Number)} durations={durations.split("-").map(Number)} width={600} height={150} /> */}

            {/* {notes && console.log(notes.split("-").map(Number))} */}
            <div className='buttonSampleRes'>
                <div className="iconsSampleRes">
                    <FiPlayCircle className='icon buttonPlay'
                        // onClick={funcPlayMIDI} 
                        onClick={()=> handlePlayNotes(notes,durations,times)}
                        />
                </div>
                <AnnotationSystem
                    type={"sample"}
                    info={text.substr(text.indexOf("-") + 1) + "_" + notes + '_' + Number(text.split('-')[0])}
                    index={Number(text.split('-')[0])}
                />
                {/* The indexRange is a way to know how many objects after the notes should be first one of the sample */}
                {typeof (localStorage.token) !== 'undefined' &&
                    <EmbeddedWorkflowInteraction
                        typeCaller={"sample"}
                        idCaller={idDBNotes[0]}
                        indexRange={idDBNotes.length}
                    />
                }
            </div>
        </div>
    );
}

export default SampleRes