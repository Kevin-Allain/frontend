import React, { useState, useEffect } from 'react'
import * as Tone from "tone"
import "./MusicInterface.css"

const Piano = () => {

    const [synth, setSynth] = useState(new Tone.Synth());
    // Set the tone to sine
    synth.oscillator.type = "sine";
    // connect it to the master output (your speakers)
    synth.toDestination();
    const piano = document.getElementById("piano");
    // piano.addEventListener("mousedown", e => {
    //     // fires off a note continously until trigger is released
    //     synth.triggerAttack(e.target.dataset.note);
    // });
    // piano.addEventListener("mouseup", e => {
    //     // stops the trigger
    //     synth.triggerRelease();
    // });

    // // handles keyboard events
    // document.addEventListener("keydown", e => {
    //     // e object has the key property to tell which key was pressed
    //     switch (e.key) {
    //         case "d":
    //             return synth.triggerAttack("C4");
    //         case "r":
    //             return synth.triggerAttack("C#4");
    //         case "f":
    //             return synth.triggerAttack("D4");
    //         case "t":
    //             return synth.triggerAttack("D#4");
    //         case "g":
    //             return synth.triggerAttack("E4");
    //         case "h":
    //             return synth.triggerAttack("F4");
    //         case "u":
    //             return synth.triggerAttack("F#4");
    //         case "j":
    //             return synth.triggerAttack("G4");
    //         case "i":
    //             return synth.triggerAttack("G#4");
    //         case "k":
    //             return synth.triggerAttack("A4");
    //         case "o":
    //             return synth.triggerAttack("A#4");
    //         case "l":
    //             return synth.triggerAttack("B4");
    //         default:
    //             return;
    //     }
    // });
    // // when the key is released, audio is released as well
    // document.addEventListener("keyup", e => {
    //     switch (e.key) {
    //         case "d":
    //             synth.triggerRelease();
    //             return;
    //         case "r":
    //             synth.triggerRelease();
    //             return;
    //         case "f":
    //             synth.triggerRelease();
    //             return;
    //         case "t":
    //             synth.triggerRelease();
    //             return;
    //         case "g":
    //             synth.triggerRelease();
    //             return;
    //         case "h":
    //             synth.triggerRelease();
    //             return;
    //         case "u":
    //             synth.triggerRelease();
    //             return;
    //         case "j":
    //             synth.triggerRelease();
    //             return;
    //         case "i":
    //             synth.triggerRelease();
    //             return;
    //         case "k":
    //             synth.triggerRelease();
    //             return;
    //         case "o":
    //             synth.triggerRelease();
    //             return;
    //         case "l":
    //             synth.triggerRelease();
    //             return;
    //         default:
    //             return;
    //     }
    // });

    const [activeWhiteNote, setActiveWhiteNote] = useState(null);
    const [activeBlackNote, setActiveBlackNote] = useState(null);

    const handleNoteDown = (note) => {
        if (note.endsWith("s")) {
            setActiveBlackNote(note);
        } else if (activeBlackNote === null) {
            setActiveWhiteNote(note);
        }
        console.log(`Note ${note} down. activeBlackNote: ${activeBlackNote}. activeWhiteNote: ${activeWhiteNote}`);
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
            const now = Tone.now();
            synth.triggerAttackRelease(note, "8n", now+0.25);
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
                    className={`black-key note white ${activeBlackNote === "D#4s" ? "active" : "" }`} >
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
                    className={`black-key note white ${activeBlackNote === "F#4s" ? "active" : "" }`} >
                    F#4
                </div>
                F4
            </li>
            <li data-note="G4"
                className={`key note white ${activeWhiteNote === "G4" ? "active" : ""}`} >
                <div data-note="G#4s"
                    className={`black-key note white ${activeBlackNote === "G#4s" ? "active" : "" }`} >
                    G#4
                </div>
                G4
            </li>
            <li data-note="A4"
                className={`key note white ${activeWhiteNote === "A4" ? "active" : ""}`} >
                <div data-note="A#4s"
                    className={`black-key note white ${activeBlackNote === "A#4s" ? "active" : "" }`} >
                    A#4
                </div>
                A4
            </li>
            <li data-note="B4" className={`key note white ${activeWhiteNote === "A4" ? "active" : ""}`} >
                B4
            </li>
        </ul>
    );
}

export default Piano;