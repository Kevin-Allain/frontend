import { useRef, useState, useEffect, useContext } from 'react';
import * as Tone from "tone"


// Note: To shift by an octave you just have to add 12.
// Apparenlty supposed to use that: Math.pow(2, (m-69)/12)*440
  
export default function MusicInterface() {

const [ contextMusic, setContextMusic ] = useState();
const [ test, setTest ] = useState(0);
const [oscillator, setOscilator] = useState();

const synth2 = new Tone.MembraneSynth().toDestination();
// create two monophonic synths
const synthA = new Tone.FMSynth().toDestination();
const synthB = new Tone.AMSynth().toDestination();
let synthPoly = new Tone.PolySynth(Tone.Synth).toDestination();

const sampler = new Tone.Sampler({
	urls: {
		"C4": "C4.mp3",
		"D#4": "Ds4.mp3",
		"F#4": "Fs4.mp3",
		"A4": "A4.mp3",
	},
	release: 1,
	baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();



function playSinth() {
  const now = Tone.now();
  // synth2.triggerAttackRelease("C4", "8n", now+0.25);
  // synth2.triggerAttackRelease("E4", "8n", now + 0.5);
  // synth2.triggerAttackRelease("G4", "8n", now + 1);
  // synth2.triggerAttackRelease(440, "800n", now + 1.5);

  synthPoly.triggerAttack("D4", now);
  // synthPoly.triggerAttack("F4", now + 0.5);
  // synthPoly.triggerAttack("A4", now + 1);
  // synthPoly.triggerAttack("C5", now + 1.5);
  synthPoly.triggerAttack("E5", now + 2);
  synthPoly.triggerAttack("G6", now + 3);
  synthPoly.triggerAttack("D3", now + 4);

  synthPoly.triggerRelease(["D4", "F4", "A4", "C5", "E5"], now + 4);

  // Tone.loaded().then(() => {
  //   sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], "16n", now+5);
  // })

}

useEffect(() => {
  // getOrCreateContext()
  console.log("useEffect for contextMusic: ",contextMusic)
  // setContextMusic(new AudioContext());
  if (!contextMusic){setContextMusic(new AudioContext())}
});


function getOrCreateContext() {
  console.log("getOrCreateContext. test: ",test)
  if (!contextMusic) {
    console.log("!contextMusic")
    setContextMusic(new AudioContext());
    setTest(1);
    console.log("contextMusic: ", contextMusic,", test: ",test)
    setOscilator(contextMusic.createOscillator());
    oscillator.connect(contextMusic.destination);
  }
  return contextMusic;
}


// //attach a click listener to a play button
// document.addEventListener('click', async () => {
// 	await Tone.start()
// 	console.log('audio is ready')
// })
// document.addEventListener('keydown', async (e) => {
// 	await Tone.start()
// 	console.log('audio is ready')
// })
document
  .querySelector(".MusicInterface-wrapper")
  ?.addEventListener("click", async () => {
    if (Tone.context.state !== "running") {
      await Tone.start();
      console.log("audio is ready");
    }
    // player.start(1);
  });



// This is a tetris theme transposed from https://musescore.com/user/16693/scores/38133
const tetris = [
  [76, 4], [71, 8], [72, 8], [74, 4], [72, 8], [71, 8], [69, 4], [69, 8], [72, 8], [76, 4], [74, 8], [72, 8], [71, 4], [71, 8], [72, 8], [74, 4], [76, 4], [72, 4], [69, 4], [69, 4], [0,  4], [74, 3], [77, 8],[81, 4], [79, 8], [77, 8], [76, 3], [72, 8], [76, 4], [74, 8], [72, 8], [71, 4], [71, 8], [72, 8], [74, 4], [76, 4], [72, 4], [69, 4], [69, 4], [0, 4],
]

function playMusic(contextMusic,oscillator,music = tetris, lengthNote=2, eps=0.01) {
  // getOrCreateContext();
  console.log("playMusic. contextMusic:",contextMusic," ,oscillator: ",oscillator)
  if (oscillator.context.state!=="running") {oscillator.start(0);}
  var time = contextMusic.currentTime + eps;
  music.forEach((note) => {
    const freq = Math.pow(2, (note[0] - 69) / 12) * 440;
    console.log(time);
    oscillator.frequency.setTargetAtTime(0, time - eps, 0.001);
    oscillator.frequency.setTargetAtTime(freq, time, 0.001);
    time += lengthNote / note[1];
  });
  // line added ourselves, unsure if it makes perfect sense
  oscillator.stop(tetris.length / lengthNote);
}

// var ac = new AudioContext();
// var osc = ac.createOscillator();
// osc.connect(ac.destination);
// const tetris = [ [76, 4], [71, 8], [72, 8], [74, 4], [72, 8], [71, 8], [69, 4], [69, 8], [72, 8], [76, 4], [74, 8], [72, 8], [71, 4], [71, 8], [72, 8], [74, 4], [76, 4], [72, 4], [69, 4], [69, 4], [0,  4], [74, 3], [77, 8],[81, 4], [79, 8], [77, 8], [76, 3], [72, 8], [76, 4], [74, 8], [72, 8], [71, 4], [71, 8], [72, 8], [74, 4], [76, 4], [72, 4], [69, 4], [69, 4], [0, 4],]

// const player = new Tone.Player({
//   url: "https://tonejs.github.io/audio/loop/FWDL.mp3",
//   loop: true,
//   loopStart: 0.5,
//   loopEnd: 0.7,
// }).toDestination();



// ui({
//   tone: player,
//   parent: document.querySelector("#content")
// });

// bind the interface
// document.querySelector("tone-play-toggle")?.addEventListener("start", () => player.start());
// document.querySelector("tone-play-toggle")?.addEventListener("stop", () => player.stop());




  return (
    <div className="musicInterface">
      <h1>Music Interface</h1>
      {/* <div id="content">
	  		<tone-play-toggle>Van Halen</tone-play-toggle>
  		</div> */}
      {/* <div className='stopMusic' 
      onClick={ (c) => { player.stop(); } } >
        Stop auto music
      </div> */}
      <br/>

      <div className='buttonsMusicInterface'>

      <div
        className="playMusic"
        onClick={(c) => {
          // setTest(test+1);
          // console.log("test: ", test,", c: ",c);
          // setContextMusic(new AudioContext());
          // console.log("contextMusic: ", contextMusic)
          // const oscillator = contextMusic.createOscillator();
          // console.log("oscillator: ", oscillator);
          // playMusic(contextMusic,oscillator)
          console.log("about to play music")
          playSinth();
          console.log("done with music")
        }}
      >
        Play Test MIDI Music
      </div>

      <div
        className="stopMusic"
        onClick={(c) => {
          console.log("trying to stop music")
          console.log( Tone );
          // console.log( synth );
          // synthPoly.stop();
          // sampler.stop();

          // synth = synth || new Tone.Synth().toMaster();
          // synth.triggerAttackRelease();
          // synthPoly.triggerAttackRelease();
          // sampler.triggerAttackRelease();

          const now = Tone.now();
          // synthPoly.triggerRelease(["D4", "F4", "A4", "C5", "E5"], now); // This will only release triggers, not really stop sound...
          // synthPoly = new Tone.PolySynth(Tone.Synth).toDestination();
          // synthPoly.triggerAttackRelease();
          synthPoly.triggerRelease(["D4", "F4", "A4", "C5", "E5", "G6", "D3"], now); // This will only release triggers, not really stop sound...
          console.log("synthPoly: ",synthPoly)
          
          Tone.Transport.stop();
          Tone.Transport.cancel();
          // Tone.Transport.off();
          Tone.Transport.dispose();

          const osc = new Tone.Oscillator().toDestination();
          osc.start().stop();

        }}
      >
        Stop Music
      </div>      

      <div
        className="reloadPage"
        onClick={(c) => {
          console.log("reload the page")
          window.location.reload();
        }}
      >
        Reload Page
      </div>      

    </div>
        <br/>
    </div>
  );
}
