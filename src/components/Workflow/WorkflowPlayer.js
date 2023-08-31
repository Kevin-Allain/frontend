import React, { useState, useEffect, useRef, useCallback } from 'react'
import * as Tone from "tone"
import NotetoMIDI from "../MusicInterface/NotetoMIDI.json"
import MIDItoNote from "../MusicInterface/MIDItoNote.json"
import NoteToColor from '../MusicInterface/NoteToColor.json'
import { FiPlayCircle } from 'react-icons/fi'

const sampler = new Tone.Sampler({
    urls: { "C4": "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", "A4": "A4.mp3", },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

const WorkflowPlayer = (props) => {
    const {notes, durations, occurences} = props;
    console.log("WorkflowPlayer props: ",props);
    const synth2 = useRef(new Tone.Synth());
    synth2.current.oscillator.type = "sine";
    synth2.current.toDestination();
  
    function formatAndPlay(item) {
        // Reformat
        const arrNotes = item.arrNotes;
        const arrTime = item.arrTime;
        const arrDurations = item.arrDurations
        const firstTime = arrTime[0];
        const combinedArray = arrNotes.map((note, index) => ({
          note,
          time: arrTime[index] - firstTime,
          duration: arrDurations[index]
        }));
        // Play formatted music
        playFormattedMusic(combinedArray);
      }
    
      function playFormattedMusic(music) {    
        synth2.current.dispose(); // this may be something good, but really unsure!
        synth2.current = new Tone.Synth();
        synth2.current.toDestination();
    
        Tone.Transport.stop();
        if (Tone.Transport.state !== "started") {
          Tone.Transport.start();
        } else {
          Tone.Transport.stop();
        }
        const offsetTest = 0.1;
        const now = Tone.now() + offsetTest;
        music.forEach(tune => { synth2.current.triggerAttackRelease(MIDItoNote[tune.note], tune.duration, now + tune.time) })    
        Tone.Transport.stop();
      }

    return (
        <FiPlayCircle className='icon buttonPlay'
            onClick={() => formatAndPlay(
                {arrNotes:notes, arrDurations:durations, arrTime:occurences})
            } 
        />
    )
}

export default WorkflowPlayer;