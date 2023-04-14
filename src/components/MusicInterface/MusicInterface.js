import { useRef, useState, useEffect, useContext } from 'react';
import * as Tone from "tone"
import {
  getMusicMIDI
} from "../../utils/HandleApi";


// Note: To shift by an octave you just have to add 12.
// Apparenlty supposed to use that: Math.pow(2, (m-69)/12)*440, with m being the pitch
export default function MusicInterface() {

// const [ contextMusic, setContextMusic ] = useState(); // const [ test, setTest ] = useState(0); // const [oscillator, setOscilator] = useState();

const synth = new Tone.Synth().toDestination()
const synth2 = new Tone.MembraneSynth().toDestination();
// create two monophonic synths
const synthA = new Tone.FMSynth().toDestination();
const synthB = new Tone.AMSynth().toDestination();
let synthPoly = new Tone.PolySynth(Tone.Synth).toDestination();

const sampler = new Tone.Sampler({
	urls: { "C4": "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", "A4": "A4.mp3", },
	release: 1,
	baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

/* // Previously set Tone.start by a click
document
  .querySelector(".musicInterface")
  ?.addEventListener("click", () => {
    // if (Tone.context.state !== "running") {
    //   Tone.start();
    //   console.log("audio is ready");
    // }
  });
  */

function playSinth() {
  const now = Tone.now();
  synth2.triggerAttackRelease("C4", "8n", now+0.25); // synth2.triggerAttackRelease("E4", "8n", now + 0.5); // synth2.triggerAttackRelease("G4", "8n", now + 1); // synth2.triggerAttackRelease(440, "800n", now + 1.5);
  synth2.triggerAttackRelease(360, 1, now + 1); synth2.triggerAttackRelease(360, 1, now + 2); synth2.triggerAttackRelease(360, 5, now + 3);
  synthPoly.triggerAttack("D4", now + 3); synthPoly.triggerAttack("F4", now + 0.5 + 3); // synthPoly.triggerAttack("A4", now + 1); // synthPoly.triggerAttack("C5", now + 1.5); // synthPoly.triggerAttack("E5", now + 2); // synthPoly.triggerAttack("G6", now + 3); // synthPoly.triggerAttack("D3", now + 4); 
  synthPoly.triggerRelease(["D4", "F4", "A4", "C5", "E5"], now + 1 + 3);
  // Tone.loaded().then(() => { sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], "16n", now+5);  })
}

// This is a tetris theme transposed from https://musescore.com/user/16693/scores/38133
const tetris = [
  [76, 4], [71, 8], [72, 8], [74, 4], [72, 8], [71, 8], [69, 4], [69, 8], [72, 8], [76, 4], [74, 8], [72, 8], [71, 4], [71, 8], [72, 8], [74, 4], [76, 4], [72, 4], [69, 4], [69, 4], [0,  4], [74, 3], [77, 8],[81, 4], [79, 8], [77, 8], [76, 3], [72, 8], [76, 4], [74, 8], [72, 8], [71, 4], [71, 8], [72, 8], [74, 4], [76, 4], [72, 4], [69, 4], [69, 4], [0, 4],
]

const mainMelody = [
  {'time': 0, 'note': Math.pow(2, (76 - 69) / 12) * 440, 'duration': 5},
  // {'time': 6, 'note': Math.pow(2, (100 - 69) / 12) * 440, 'duration': 10},
  {'time': '0:1', 'note': Math.pow(2, (72 - 69) / 12) * 440, 'duration': '8n.'},
  {'time': '0:2', 'note': Math.pow(2, (74 - 69) / 12) * 440, 'duration': '8n'},
  {'time': '0:2:2', 'note': Math.pow(2, (72 - 69) / 12) * 440, 'duration': '8n.'},
  {'time': '0:2:4', 'note': Math.pow(2, (71 - 69) / 12) * 440, 'duration': '8n.'},
  {'time': '0:3', 'note': 440, 'duration': '8n'},
  {'time': '0:3:2', 'note': 'A4', 'duration': '2n'},
  {'time': '2:0', 'note': 'A4', 'duration': '8n'},
  {'time': '2:0:2', 'note': 'G4', 'duration': '8n'},
  {'time': '2:1', 'note': 'F4', 'duration': '8n'},
  {'time': '2:2', 'note': 'A4', 'duration': '8n'},
  {'time': '2:2:2', 'note': 'G4', 'duration': '8n'},
  {'time': '2:3', 'note': 'E4', 'duration': '8n'},
  {'time': '2:3:2', 'note': 'F4', 'duration': '2n'},
  {'time': '4:0', 'note': 'G4', 'duration': '8n'},
  {'time': '4:0:2', 'note': 'F4', 'duration': '8n'},
  {'time': '4:1', 'note': 'D4', 'duration': '8n'},
  {'time': '4:2', 'note': 'F4', 'duration': '8n'},
  {'time': '4:2:2', 'note': 'A4', 'duration': '8n'},
  {'time': '4:3', 'note': 'G4', 'duration': '8n'},
  {'time': '4:3:2', 'note': 'A4', 'duration': '2n'},
  {'time': '5:2:2', 'note': 'G4', 'duration': '8n'},
  {'time': '5:3', 'note': 'A4', 'duration': '8n'},
  {'time': '5:3:2', 'note': 'B4', 'duration': '8n'},
  {'time': '6:0', 'note': 'C5', 'duration': '8n'},
  {'time': '6:1', 'note': 'B4', 'duration': '8n'},
  {'time': '6:1:2', 'note': 'A4', 'duration': '8n'},
  {'time': '6:2', 'note': 'B4', 'duration': '8n'},
  {'time': '6:2:2', 'note': 'A4', 'duration': '8n'},
  {'time': '6:3', 'note': 'G4', 'duration': '8n'},
  {'time': '6:3:2', 'note': 'A4', 'duration': 2},
];

const kickDrum = new Tone.MembraneSynth({
  volume: 6
}).toDestination();
const kicks = [
  { time: '0:0' }, { time: '0:3:2' }, { time: '1:1' }, { time: '2:0' }, { time: '2:1:2' }, { time: '2:3:2' }, { time: '3:0:2' }, { time: '3:1:' }, { time: '4:0' }, { time: '4:3:2' }, { time: '5:1' }, { time: '6:0' }, { time: '6:1:2' }, { time: '6:3:2' }, { time: '7:0:2' }, { time: '7:1:' },
];

// function playMusic(contextMusic,oscillator,music = tetris, lengthNote=2, eps=0.01) {
//   // getOrCreateContext();
//   if (oscillator.context.state!=="running") {oscillator.start(0);}
//   var time = contextMusic.currentTime + eps;
//   music.forEach((note) => {
//     const freq = Math.pow(2, (note[0] - 69) / 12) * 440;
//     oscillator.frequency.setTargetAtTime(0, time - eps, 0.001);
//     oscillator.frequency.setTargetAtTime(freq, time, 0.001);
//     time += lengthNote / note[1];
//   });
//   // line added ourselves, unsure if it makes perfect sense
//   oscillator.stop(tetris.length / lengthNote);
// }


function playTestMidi(){
    Tone.Transport.stop();
    if (Tone.context.state !== "running") {
      Tone.start();
      console.log("audio is ready");
    }

    if (Tone.Transport.state !== "started") {
      Tone.Transport.start();
      console.log("Tone.Transport.start");
    } else {
      Tone.Transport.stop();
      console.log("Tone.Transport.stop");
    }

    const now = Tone.now();
    Tone.Transport.bpm.value = 180; // Not necessary, but good to have... // normal bpm is slower

    const musicPart = new Tone.Part(function (time, note) {
      synth2.triggerAttackRelease(note.note, note.duration, time);
    }, mainMelody).start(now); // used to start at 0 but would bug

    const kickPart = new Tone.Part(function (time) {
      kickDrum.triggerAttackRelease("C1", "8n", time);
    }, kicks).start(now);
  

}

function playMidiDatabase(){
  // TODO
  getMusicMIDI( "BGR0082-T1");

}


  return (
    <div className="musicInterface">
      <h1>Music Interface</h1>
      <br />
      <div className="buttonsMusicInterface">
      <div
          className="playMusic"
          onClick={(c) => {
            console.log("about to play music from database");
            playMidiDatabase();
            console.log("done with music from database");
          }}
        >
          Play Test Database Music
        </div>

        <div
          className="playMusic"
          onClick={(c) => {
            console.log("about to play music");
            playTestMidi();
            console.log("done with music");
          }}
        >
          Play Test MIDI Music
        </div>
        <div
          className="playMusic"
          onClick={(c) => {
            console.log("about to play synth");
            playSinth();
            console.log("done with synth");
          }}
        >
          Play Test Synthetizers
        </div>
        {/* <div
          className="stopMusic"
          onClick={(c) => {
            console.log("trying to stop music");
            console.log(Tone);
            // synthPoly.stop(); // sampler.stop(); // synth = synth || new Tone.Synth().toMaster();
            // synth.triggerAttackRelease(); // synthPoly.triggerAttackRelease(); // sampler.triggerAttackRelease();
            const now = Tone.now();
            // synthPoly.triggerRelease(["D4", "F4", "A4", "C5", "E5"], now); // This will only release triggers, not really stop sound...
            // synthPoly = new Tone.PolySynth(Tone.Synth).toDestination();
            // synthPoly.triggerAttackRelease();
            synthPoly.triggerRelease(
              ["D4", "F4", "A4", "C5", "E5", "G6", "D3"],
              now
            ); // This will only release triggers, not really stop sound...
            // Tone.Transport.stop(); // Tone.Transport.cancel(); // Tone.Transport.off(); // Tone.Transport.dispose();
            // const osc = new Tone.Oscillator().toDestination(); // osc.start().stop();
          }}
        >
          Stop Music
        </div> */}
        <div
          className="reloadPage"
          onClick={(c) => {
            console.log("reload the page");
            window.location.reload();
          }}
        >
          Reload Page
        </div>
      </div>
      <br />
    </div>
  );
}
