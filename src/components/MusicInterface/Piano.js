import React, { useState, useEffect, useRef } from 'react'
import * as Tone from "tone"
import "./MusicInterface.css"
import NotetoMIDI from "./NotetoMIDI.json"
import MIDItoNote from "./MIDItoNote.json"

import NoteToColor from './NoteToColor.json'

const sampler = new Tone.Sampler({
    urls: { "C4": "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", "A4": "A4.mp3", },
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();


const Piano = (props) => {
    const { onKeyPress } = props;
    // const synth = useRef(new Tone.Synth());
    // // Set the tone to sine
    // synth.current.oscillator.type = "sine";
    // // connect it to the master output (your speakers)
    // synth.current.toDestination();

    const [activeWhiteNote, setActiveWhiteNote] = useState(null);
    const [activeBlackNote, setActiveBlackNote] = useState(null);

    const handleNoteDown = (note) => {
        if (note.endsWith("s")) {
            setActiveBlackNote(note);
        } else if (activeBlackNote === null) {
            setActiveWhiteNote(note);
        }
        onKeyPress(note);
    };
    const handleNoteUp = (note) => {
        if (note.endsWith("s")) {
            setActiveBlackNote(null);
        } else {
            setActiveWhiteNote(null);
        }
    };

    // useEffect(() => {
    //     const handleKeyUp = (event) => {
    //         const note = event.target.dataset.note;
    //         handleNoteUp(note);
    //     };

    //     const handleKeyDown = (event) => {
    //         const note = event.target.dataset.note;
    //         console.log("handleKeyDown note: ", note,", event: ",event);
    //         const now = Tone.now();
    //         synth.current.triggerAttackRelease(note, "8n", now + 0.25);
    //         Tone.Transport.stop();
    //         handleNoteDown(note);
    //     };

    //     document.querySelectorAll(".key").forEach((key) => {
    //         key.addEventListener("mousedown", handleKeyDown);
    //         key.addEventListener("mouseup", handleKeyUp);
    //     });

    //     return () => {
    //         document.querySelectorAll(".key").forEach((key) => {
    //             key.removeEventListener("mousedown", handleKeyDown);
    //             key.removeEventListener("mouseup", handleKeyUp);
    //         });
    //     };
    // }, [activeWhiteNote, activeBlackNote]);

    useEffect(() => {
        const handlePointerUp = (event) => {
          const note = event.target.dataset.note;
          handleNoteUp(note);
        };
      
        const handlePointerDown = (event) => {
          const note = event.target.dataset.note;
          console.log("handlePointerDown note: ", note, ", event: ", event);
          const now = Tone.now();
        //   synth.current.triggerAttackRelease(note, "8n", now + 0.25);
        sampler.triggerAttackRelease([note], 1,now);
        // Tone.Transport.stop();
          handleNoteDown(note);
        };
      
        document.querySelectorAll(".key").forEach((key) => {
          key.addEventListener("pointerdown", handlePointerDown);
          key.addEventListener("pointerup", handlePointerUp);
        });
      
        return () => {
          document.querySelectorAll(".key").forEach((key) => {
            key.removeEventListener("pointerdown", handlePointerDown);
            key.removeEventListener("pointerup", handlePointerUp);
          });
        };
      }, [activeWhiteNote, activeBlackNote]);
      

    return (
        <ul id="piano" className='keys'>
            {/* Could go from 0 to 8 */}
            <li data-note="C3"
                className={`key note white ${activeWhiteNote === "C3" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["C"], border:"solid", borderWidth:"medium",
                }}
                >
                <div data-note="C#3s"
                    className={`black-key note white ${activeBlackNote === "C#3s" ? "active" : ""}`} 
                    style={{color: NoteToColor["C#"], border:"solid",borderColor:NoteToColor["C#"]}}
                    >
                    C#3
                </div>
                C3
            </li>
            <li data-note="D3"
                className={`key note white ${activeWhiteNote === "D3" ? "active" : ""}`} 
                style={{color: NoteToColor["D"], border:"solid", borderWidth:"medium", }}                
                >
                <div data-note="D#3s"
                    className={`black-key note white ${activeBlackNote === "D#3s" ? "active" : ""}`} 
                    style={{color: NoteToColor["D#"], border:"solid",borderColor:NoteToColor["D#"]}}
                    >
                    D#3
                </div>
                D3
            </li>
            <li data-note="E3"
                className={`key note white ${activeWhiteNote === "E3" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["E"], border:"solid", borderWidth:"medium",
                }}
                >
                E3
            </li>
            <li data-note="F3"
                className={`key note white ${activeWhiteNote === "F3" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["F"], border:"solid", borderWidth:"medium",
                    }}
                >
                <div data-note="F#3s"
                    className={`black-key note white ${activeBlackNote === "F#3s" ? "active" : ""}`} 
                    style={{color: NoteToColor["F#"], border:"solid",borderColor:NoteToColor["F#"]}}                    >
                    F#3
                </div>
                F3
            </li>
            <li data-note="G3"
                className={`key note white ${activeWhiteNote === "G3" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["G"], border:"solid", borderWidth:"medium", 
                    }}
                >
                <div data-note="G#3s"
                    className={`black-key note white ${activeBlackNote === "G#3s" ? "active" : ""}`} 
                    style={{color: NoteToColor["G#"], border:"solid",borderColor:NoteToColor["G#"]}}                    >
                    G#3
                </div>
                G3
            </li>
            <li data-note="A3"
                className={`key note white ${activeWhiteNote === "A3" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["A"], border:"solid", borderWidth:"medium", 
                    }}
                >
                <div data-note="A#3s"
                    className={`black-key note white ${activeBlackNote === "A#3s" ? "active" : ""}`} 
                    style={{color: NoteToColor["A#"], border:"solid",borderColor:NoteToColor["A#"]}}                    >
                    A#3
                </div>
                A3
            </li>
            <li data-note="B3" className={`key note white ${activeWhiteNote === "A3" ? "active" : ""}`} 
            style={{
                color: NoteToColor["B"], border:"solid", borderWidth:"medium", 
                }}
            >
                B3
            </li>
            <li data-note="C4"
                className={`key note white ${activeWhiteNote === "C4" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["C"], border:"solid", borderWidth:"medium",
                }}
                >
                <div data-note="C#4s"
                    className={`black-key note white ${activeBlackNote === "C#4s" ? "active" : ""}`} 
                    style={{color: NoteToColor["C#"], border:"solid",borderColor:NoteToColor["C#"]}}
                    >
                    C#4
                </div>
                C4
            </li>
            <li data-note="D4"
                className={`key note white ${activeWhiteNote === "D4" ? "active" : ""}`} 
                style={{color: NoteToColor["D"], border:"solid", borderWidth:"medium", }}                
                >
                <div data-note="D#4s"
                    className={`black-key note white ${activeBlackNote === "D#4s" ? "active" : ""}`} 
                    style={{color: NoteToColor["D#"], border:"solid",borderColor:NoteToColor["D#"]}}
                    >
                    D#4
                </div>
                D4
            </li>
            <li data-note="E4"
                className={`key note white ${activeWhiteNote === "E4" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["E"], border:"solid", borderWidth:"medium",
                }}
                >
                E4
            </li>
            <li data-note="F4"
                className={`key note white ${activeWhiteNote === "F4" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["F"], border:"solid", borderWidth:"medium",
                    }}
                >
                <div data-note="F#4s"
                    className={`black-key note white ${activeBlackNote === "F#4s" ? "active" : ""}`} 
                    style={{color: NoteToColor["F#"], border:"solid",borderColor:NoteToColor["F#"]}}                    >
                    F#4
                </div>
                F4
            </li>
            <li data-note="G4"
                className={`key note white ${activeWhiteNote === "G4" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["G"], border:"solid", borderWidth:"medium", 
                    }}
                >
                <div data-note="G#4s"
                    className={`black-key note white ${activeBlackNote === "G#4s" ? "active" : ""}`} 
                    style={{color: NoteToColor["G#"], border:"solid",borderColor:NoteToColor["G#"]}}                    >
                    G#4
                </div>
                G4
            </li>
            <li data-note="A4"
                className={`key note white ${activeWhiteNote === "A4" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["A"], border:"solid", borderWidth:"medium", 
                    }}
                >
                <div data-note="A#4s"
                    className={`black-key note white ${activeBlackNote === "A#4s" ? "active" : ""}`} 
                    style={{color: NoteToColor["A#"], border:"solid",borderColor:NoteToColor["A#"]}}                    >
                    A#4
                </div>
                A4
            </li>
            <li data-note="B4" className={`key note white ${activeWhiteNote === "A4" ? "active" : ""}`} 
            style={{
                color: NoteToColor["B"], border:"solid", borderWidth:"medium", 
                }}
            >
                B4
            </li>
            <li data-note="C5"
                className={`key note white ${activeWhiteNote === "C5" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["C"], border:"solid", borderWidth:"medium",
                }}
                >
                <div data-note="C#5s"
                    className={`black-key note white ${activeBlackNote === "C#5s" ? "active" : ""}`} 
                    style={{color: NoteToColor["C#"], border:"solid",borderColor:NoteToColor["C#"]}}
                    >
                    C#5
                </div>
                C5
            </li>
            <li data-note="D5"
                className={`key note white ${activeWhiteNote === "D5" ? "active" : ""}`} 
                style={{color: NoteToColor["D"], border:"solid", borderWidth:"medium", }}                
                >
                <div data-note="D#5s"
                    className={`black-key note white ${activeBlackNote === "D#5s" ? "active" : ""}`} 
                    style={{color: NoteToColor["D#"], border:"solid",borderColor:NoteToColor["D#"]}}
                    >
                    D#5
                </div>
                D5
            </li>
            <li data-note="E5"
                className={`key note white ${activeWhiteNote === "E5" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["E"], border:"solid", borderWidth:"medium",
                }}
                >
                E5
            </li>
            <li data-note="F5"
                className={`key note white ${activeWhiteNote === "F5" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["F"], border:"solid", borderWidth:"medium",
                    }}
                >
                <div data-note="F#5s"
                    className={`black-key note white ${activeBlackNote === "F#5s" ? "active" : ""}`} 
                    style={{color: NoteToColor["F#"], border:"solid",borderColor:NoteToColor["F#"]}}                    >
                    F#5
                </div>
                F5
            </li>
            <li data-note="G5"
                className={`key note white ${activeWhiteNote === "G5" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["G"], border:"solid", borderWidth:"medium", 
                    }}
                >
                <div data-note="G#5s"
                    className={`black-key note white ${activeBlackNote === "G#5s" ? "active" : ""}`} 
                    style={{color: NoteToColor["G#"], border:"solid",borderColor:NoteToColor["G#"]}}                    >
                    G#5
                </div>
                G5
            </li>
            <li data-note="A5"
                className={`key note white ${activeWhiteNote === "A5" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["A"], border:"solid", borderWidth:"medium", 
                    }}
                >
                <div data-note="A#5s"
                    className={`black-key note white ${activeBlackNote === "A#5s" ? "active" : ""}`} 
                    style={{color: NoteToColor["A#"], border:"solid",borderColor:NoteToColor["A#"]}}                    >
                    A#5
                </div>
                A5
            </li>
            <li data-note="B5" className={`key note white ${activeWhiteNote === "A5" ? "active" : ""}`} 
            style={{
                color: NoteToColor["B"], border:"solid", borderWidth:"medium", 
                }}
            >
                B5
            </li>
            <li data-note="C6"
                className={`key note white ${activeWhiteNote === "C6" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["C"], border:"solid", borderWidth:"medium",
                }}
                >
                <div data-note="C#6s"
                    className={`black-key note white ${activeBlackNote === "C#6s" ? "active" : ""}`} 
                    style={{color: NoteToColor["C#"], border:"solid",borderColor:NoteToColor["C#"]}}
                    >
                    C#6
                </div>
                C6
            </li>
            <li data-note="D6"
                className={`key note white ${activeWhiteNote === "D6" ? "active" : ""}`} 
                style={{color: NoteToColor["D"], border:"solid", borderWidth:"medium", }}                
                >
                <div data-note="D#6s"
                    className={`black-key note white ${activeBlackNote === "D#6s" ? "active" : ""}`} 
                    style={{color: NoteToColor["D#"], border:"solid",borderColor:NoteToColor["D#"]}}
                    >
                    D#6
                </div>
                D6
            </li>
            <li data-note="E6"
                className={`key note white ${activeWhiteNote === "E6" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["E"], border:"solid", borderWidth:"medium",
                }}
                >
                E6
            </li>
            <li data-note="F6"
                className={`key note white ${activeWhiteNote === "F6" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["F"], border:"solid", borderWidth:"medium",
                    }}
                >
                <div data-note="F#6s"
                    className={`black-key note white ${activeBlackNote === "F#6s" ? "active" : ""}`} 
                    style={{color: NoteToColor["F#"], border:"solid",borderColor:NoteToColor["F#"]}}                    >
                    F#6
                </div>
                F6
            </li>
            <li data-note="G6"
                className={`key note white ${activeWhiteNote === "G6" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["G"], border:"solid", borderWidth:"medium", 
                    }}
                >
                <div data-note="G#6s"
                    className={`black-key note white ${activeBlackNote === "G#6s" ? "active" : ""}`} 
                    style={{color: NoteToColor["G#"], border:"solid",borderColor:NoteToColor["G#"]}}                    >
                    G#6
                </div>
                G6
            </li>
            <li data-note="A6"
                className={`key note white ${activeWhiteNote === "A6" ? "active" : ""}`} 
                style={{
                    color: NoteToColor["A"], border:"solid", borderWidth:"medium", 
                    }}
                >
                <div data-note="A#6s"
                    className={`black-key note white ${activeBlackNote === "A#6s" ? "active" : ""}`} 
                    style={{color: NoteToColor["A#"], border:"solid",borderColor:NoteToColor["A#"]}}                    >
                    A#6
                </div>
                A6
            </li>
            <li data-note="B6" className={`key note white ${activeWhiteNote === "A6" ? "active" : ""}`} 
            style={{
                color: NoteToColor["B"], border:"solid", borderWidth:"medium", 
                }}
            >
                B6
            </li>                        

        </ul>
        
    );
}

export default Piano;