import React, { useState, useEffect, useRef } from 'react'
import * as Tone from "tone"
import "./MusicInterface.css"
import NotetoMIDI from "./NotetoMIDI.json"
import MIDItoNote from "./MIDItoNote.json"

const Piano = (props) => {

    // let { textSearch, setTextSearch } = props;
    const { onKeyPress } = props;

    const synth = useRef(new Tone.Synth());
    // Set the tone to sine
    synth.current.oscillator.type = "sine";
    // connect it to the master output (your speakers)
    synth.current.toDestination();

    const [activeWhiteNote, setActiveWhiteNote] = useState(null);
    const [activeBlackNote, setActiveBlackNote] = useState(null);

    const handleNoteDown = (note) => {
        if (note.endsWith("s")) {
            setActiveBlackNote(note);
        } else if (activeBlackNote === null) {
            setActiveWhiteNote(note);
        }
        console.log(`Note ${note} down. activeBlackNote: ${activeBlackNote}. activeWhiteNote: ${activeWhiteNote}`);
        console.log("NotetoMIDI[note]: ", NotetoMIDI[note]); // This is correct. We thus need for the piano to somehow call the function that fills in the search

        // console.log("textSearch: ",textSearch ,", typeof textSearch: ",(typeof textSearch)  ,", setTextSearch: ",setTextSearch)
        // setTextSearch(textSearch+= (textSearch.length===0)? NotetoMIDI[note] :  "-"+NotetoMIDI[note])
        onKeyPress(note);
    };

    const handleNoteUp = (note) => {
        if (note.endsWith("s")) {
            setActiveBlackNote(null);
        } else {
            setActiveWhiteNote(null);
        }
        console.log(`Note ${note} up. activeBlackNote: ${activeBlackNote}. activeWhiteNote: ${activeWhiteNote}`);
    };

    useEffect(() => {
        const handleKeyUp = (event) => {
            const note = event.target.dataset.note;
            handleNoteUp(note);
        };

        const handleKeyDown = (event) => {
            const note = event.target.dataset.note;
            console.log("note: ", note);
            const now = Tone.now();
            synth.current.triggerAttackRelease(note, "8n", now + 0.25);
            Tone.Transport.stop();
            handleNoteDown(note);
        };

        document.querySelectorAll(".key").forEach((key) => {
            key.addEventListener("mousedown", handleKeyDown);
            key.addEventListener("mouseup", handleKeyUp);
        });

        return () => {
            document.querySelectorAll(".key").forEach((key) => {
                key.removeEventListener("mousedown", handleKeyDown);
                key.removeEventListener("mouseup", handleKeyUp);
            });
        };
    }, [activeWhiteNote, activeBlackNote]);

    return (
        <ul id="piano" className='keys'>
            {/* <li data-note="C0"
                className={`key note white ${activeWhiteNote === "C0" ? "active" : ""}`} >
                <div data-note="C#0s"
                    className={`black-key note white ${activeBlackNote === "C#0s" ? "active" : ""}`} >
                    C#0
                </div>
                C0
            </li>
            <li data-note="D0"
                className={`key note white ${activeWhiteNote === "D0" ? "active" : ""}`} >
                <div data-note="D#0s"
                    className={`black-key note white ${activeBlackNote === "D#0s" ? "active" : "" }`} >
                    D#0
                </div>
                D0
            </li>
            <li data-note="E0"
                className={`key note white ${activeWhiteNote === "E0" ? "active" : ""}`} >
                E0
            </li>
            <li data-note="F0"
                className={`key note white ${activeWhiteNote === "F0" ? "active" : ""}`} >
                <div data-note="F#0s"
                    className={`black-key note white ${activeBlackNote === "F#0s" ? "active" : "" }`} >
                    F#0
                </div>
                F0
            </li>
            <li data-note="G0"
                className={`key note white ${activeWhiteNote === "G0" ? "active" : ""}`} >
                <div data-note="G#0s"
                    className={`black-key note white ${activeBlackNote === "G#0s" ? "active" : "" }`} >
                    G#0
                </div>
                G0
            </li>
            <li data-note="A0"
                className={`key note white ${activeWhiteNote === "A0" ? "active" : ""}`} >
                <div data-note="A#0s"
                    className={`black-key note white ${activeBlackNote === "A#0s" ? "active" : "" }`} >
                    A#0
                </div>
                A0
            </li>
            <li data-note="B0" className={`key note white ${activeWhiteNote === "A0" ? "active" : ""}`} >
                B0
            </li>             */}
            {/* <li data-note="C1"
                className={`key note white ${activeWhiteNote === "C1" ? "active" : ""}`} >
                <div data-note="C#1s"
                    className={`black-key note white ${activeBlackNote === "C#1s" ? "active" : ""}`} >
                    C#1
                </div>
                C1
            </li>
            <li data-note="D1"
                className={`key note white ${activeWhiteNote === "D1" ? "active" : ""}`} >
                <div data-note="D#1s"
                    className={`black-key note white ${activeBlackNote === "D#1s" ? "active" : "" }`} >
                    D#1
                </div>
                D1
            </li>
            <li data-note="E1"
                className={`key note white ${activeWhiteNote === "E1" ? "active" : ""}`} >
                E1
            </li>
            <li data-note="F1"
                className={`key note white ${activeWhiteNote === "F1" ? "active" : ""}`} >
                <div data-note="F#1s"
                    className={`black-key note white ${activeBlackNote === "F#1s" ? "active" : "" }`} >
                    F#1
                </div>
                F1
            </li>
            <li data-note="G1"
                className={`key note white ${activeWhiteNote === "G1" ? "active" : ""}`} >
                <div data-note="G#1s"
                    className={`black-key note white ${activeBlackNote === "G#1s" ? "active" : "" }`} >
                    G#1
                </div>
                G1
            </li>
            <li data-note="A1"
                className={`key note white ${activeWhiteNote === "A1" ? "active" : ""}`} >
                <div data-note="A#1s"
                    className={`black-key note white ${activeBlackNote === "A#1s" ? "active" : "" }`} >
                    A#1
                </div>
                A1
            </li>
            <li data-note="B1" className={`key note white ${activeWhiteNote === "A1" ? "active" : ""}`} >
                B1
            </li>             */}
            {/* <li data-note="C2"
                className={`key note white ${activeWhiteNote === "C2" ? "active" : ""}`} >
                <div data-note="C#2s"
                    className={`black-key note white ${activeBlackNote === "C#2s" ? "active" : ""}`} >
                    C#2
                </div>
                C2
            </li>
            <li data-note="D2"
                className={`key note white ${activeWhiteNote === "D2" ? "active" : ""}`} >
                <div data-note="D#2s"
                    className={`black-key note white ${activeBlackNote === "D#2s" ? "active" : "" }`} >
                    D#2
                </div>
                D2
            </li>
            <li data-note="E2"
                className={`key note white ${activeWhiteNote === "E2" ? "active" : ""}`} >
                E2
            </li>
            <li data-note="F2"
                className={`key note white ${activeWhiteNote === "F2" ? "active" : ""}`} >
                <div data-note="F#2s"
                    className={`black-key note white ${activeBlackNote === "F#2s" ? "active" : "" }`} >
                    F#2
                </div>
                F2
            </li>
            <li data-note="G2"
                className={`key note white ${activeWhiteNote === "G2" ? "active" : ""}`} >
                <div data-note="G#2s"
                    className={`black-key note white ${activeBlackNote === "G#2s" ? "active" : "" }`} >
                    G#2
                </div>
                G2
            </li>
            <li data-note="A2"
                className={`key note white ${activeWhiteNote === "A2" ? "active" : ""}`} >
                <div data-note="A#2s"
                    className={`black-key note white ${activeBlackNote === "A#2s" ? "active" : "" }`} >
                    A#2
                </div>
                A2
            </li>
            <li data-note="B2" className={`key note white ${activeWhiteNote === "A2" ? "active" : ""}`} >
                B2
            </li>             */}
            <li data-note="C3"
                className={`key note white ${activeWhiteNote === "C3" ? "active" : ""}`} >
                <div data-note="C#3s"
                    className={`black-key note white ${activeBlackNote === "C#3s" ? "active" : ""}`} >
                    C#3
                </div>
                C3
            </li>
            <li data-note="D3"
                className={`key note white ${activeWhiteNote === "D3" ? "active" : ""}`} >
                <div data-note="D#3s"
                    className={`black-key note white ${activeBlackNote === "D#3s" ? "active" : ""}`} >
                    D#3
                </div>
                D3
            </li>
            <li data-note="E3"
                className={`key note white ${activeWhiteNote === "E3" ? "active" : ""}`} >
                E3
            </li>
            <li data-note="F3"
                className={`key note white ${activeWhiteNote === "F3" ? "active" : ""}`} >
                <div data-note="F#3s"
                    className={`black-key note white ${activeBlackNote === "F#3s" ? "active" : ""}`} >
                    F#3
                </div>
                F3
            </li>
            <li data-note="G3"
                className={`key note white ${activeWhiteNote === "G3" ? "active" : ""}`} >
                <div data-note="G#3s"
                    className={`black-key note white ${activeBlackNote === "G#3s" ? "active" : ""}`} >
                    G#3
                </div>
                G3
            </li>
            <li data-note="A3"
                className={`key note white ${activeWhiteNote === "A3" ? "active" : ""}`} >
                <div data-note="A#3s"
                    className={`black-key note white ${activeBlackNote === "A#3s" ? "active" : ""}`} >
                    A#3
                </div>
                A3
            </li>
            <li data-note="B3" className={`key note white ${activeWhiteNote === "A3" ? "active" : ""}`} >
                B3
            </li>
            <li data-note="C4"
                className={`key note white ${activeWhiteNote === "C4" ? "active" : ""}`} >
                <div data-note="C#4s"
                    className={`black-key note white ${activeBlackNote === "C#4s" ? "active" : ""}`} >
                    C#4
                </div>
                C4
            </li>
            <li data-note="D4"
                className={`key note white ${activeWhiteNote === "D4" ? "active" : ""}`} >
                <div data-note="D#4s"
                    className={`black-key note white ${activeBlackNote === "D#4s" ? "active" : ""}`} >
                    D#4
                </div>
                D4
            </li>
            <li data-note="E4"
                className={`key note white ${activeWhiteNote === "E4" ? "active" : ""}`} >
                E4
            </li>
            <li data-note="F4"
                className={`key note white ${activeWhiteNote === "F4" ? "active" : ""}`} >
                <div data-note="F#4s"
                    className={`black-key note white ${activeBlackNote === "F#4s" ? "active" : ""}`} >
                    F#4
                </div>
                F4
            </li>
            <li data-note="G4"
                className={`key note white ${activeWhiteNote === "G4" ? "active" : ""}`} >
                <div data-note="G#4s"
                    className={`black-key note white ${activeBlackNote === "G#4s" ? "active" : ""}`} >
                    G#4
                </div>
                G4
            </li>
            <li data-note="A4"
                className={`key note white ${activeWhiteNote === "A4" ? "active" : ""}`} >
                <div data-note="A#4s"
                    className={`black-key note white ${activeBlackNote === "A#4s" ? "active" : ""}`} >
                    A#4
                </div>
                A4
            </li>
            <li data-note="B4" className={`key note white ${activeWhiteNote === "A4" ? "active" : ""}`} >
                B4
            </li>
            <li data-note="C5"
                className={`key note white ${activeWhiteNote === "C5" ? "active" : ""}`} >
                <div data-note="C#5s"
                    className={`black-key note white ${activeBlackNote === "C#5s" ? "active" : ""}`} >
                    C#5
                </div>
                C5
            </li>
            <li data-note="D5"
                className={`key note white ${activeWhiteNote === "D5" ? "active" : ""}`} >
                <div data-note="D#5s"
                    className={`black-key note white ${activeBlackNote === "D#5s" ? "active" : ""}`} >
                    D#5
                </div>
                D5
            </li>
            <li data-note="E5"
                className={`key note white ${activeWhiteNote === "E5" ? "active" : ""}`} >
                E5
            </li>
            <li data-note="F5"
                className={`key note white ${activeWhiteNote === "F5" ? "active" : ""}`} >
                <div data-note="F#5s"
                    className={`black-key note white ${activeBlackNote === "F#5s" ? "active" : ""}`} >
                    F#5
                </div>
                F5
            </li>
            <li data-note="G5"
                className={`key note white ${activeWhiteNote === "G5" ? "active" : ""}`} >
                <div data-note="G#5s"
                    className={`black-key note white ${activeBlackNote === "G#5s" ? "active" : ""}`} >
                    G#5
                </div>
                G5
            </li>
            <li data-note="A5"
                className={`key note white ${activeWhiteNote === "A5" ? "active" : ""}`} >
                <div data-note="A#5s"
                    className={`black-key note white ${activeBlackNote === "A#5s" ? "active" : ""}`} >
                    A#5
                </div>
                A5
            </li>
            <li data-note="B5" className={`key note white ${activeWhiteNote === "A5" ? "active" : ""}`} >
                B5
            </li>
            <li data-note="C6"
                className={`key note white ${activeWhiteNote === "C6" ? "active" : ""}`} >
                <div data-note="C#6s"
                    className={`black-key note white ${activeBlackNote === "C#6s" ? "active" : ""}`} >
                    C#6
                </div>
                C6
            </li>
            <li data-note="D6"
                className={`key note white ${activeWhiteNote === "D6" ? "active" : ""}`} >
                <div data-note="D#6s"
                    className={`black-key note white ${activeBlackNote === "D#6s" ? "active" : ""}`} >
                    D#6
                </div>
                D6
            </li>
            <li data-note="E6"
                className={`key note white ${activeWhiteNote === "E6" ? "active" : ""}`} >
                E6
            </li>
            <li data-note="F6"
                className={`key note white ${activeWhiteNote === "F6" ? "active" : ""}`} >
                <div data-note="F#6s"
                    className={`black-key note white ${activeBlackNote === "F#6s" ? "active" : ""}`} >
                    F#6
                </div>
                F6
            </li>
            <li data-note="G6"
                className={`key note white ${activeWhiteNote === "G6" ? "active" : ""}`} >
                <div data-note="G#6s"
                    className={`black-key note white ${activeBlackNote === "G#6s" ? "active" : ""}`} >
                    G#6
                </div>
                G6
            </li>
            <li data-note="A6"
                className={`key note white ${activeWhiteNote === "A6" ? "active" : ""}`} >
                <div data-note="A#6s"
                    className={`black-key note white ${activeBlackNote === "A#6s" ? "active" : ""}`} >
                    A#6
                </div>
                A6
            </li>
            <li data-note="B6" className={`key note white ${activeWhiteNote === "A6" ? "active" : ""}`} >
                B6
            </li>
            {/* <li data-note="C7"
                className={`key note white ${activeWhiteNote === "C7" ? "active" : ""}`} >
                <div data-note="C#7s"
                    className={`black-key note white ${activeBlackNote === "C#7s" ? "active" : ""}`} >
                    C#7
                </div>
                C7
            </li>
            <li data-note="D7"
                className={`key note white ${activeWhiteNote === "D7" ? "active" : ""}`} >
                <div data-note="D#7s"
                    className={`black-key note white ${activeBlackNote === "D#7s" ? "active" : "" }`} >
                    D#7
                </div>
                D7
            </li>
            <li data-note="E7"
                className={`key note white ${activeWhiteNote === "E7" ? "active" : ""}`} >
                E7
            </li>
            <li data-note="F7"
                className={`key note white ${activeWhiteNote === "F7" ? "active" : ""}`} >
                <div data-note="F#7s"
                    className={`black-key note white ${activeBlackNote === "F#7s" ? "active" : "" }`} >
                    F#7
                </div>
                F7
            </li>
            <li data-note="G7"
                className={`key note white ${activeWhiteNote === "G7" ? "active" : ""}`} >
                <div data-note="G#7s"
                    className={`black-key note white ${activeBlackNote === "G#7s" ? "active" : "" }`} >
                    G#7
                </div>
                G7
            </li>
            <li data-note="A7"
                className={`key note white ${activeWhiteNote === "A7" ? "active" : ""}`} >
                <div data-note="A#7s"
                    className={`black-key note white ${activeBlackNote === "A#7s" ? "active" : "" }`} >
                    A#7
                </div>
                A7
            </li>
            <li data-note="B7" className={`key note white ${activeWhiteNote === "A7" ? "active" : ""}`} >
                B7
            </li>             */}
        </ul>
    );
}

export default Piano;