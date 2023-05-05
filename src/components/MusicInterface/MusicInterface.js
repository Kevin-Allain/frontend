import { useRef, useState, useEffect, useContext } from 'react';
import * as Tone from "tone"
import {
  getMusicMIDI,
  getSampleMIDI,
  getMatchLevenshteinDistance
} from "../../utils/HandleApi";
import MusicRes from "./MusicRes"
import {AiFillPlayCircle, AiFillPauseCircle, AiOutlineArrowRight} from 'react-icons/ai'
import {ImLoop2} from 'react-icons/im'
import {BiDotsHorizontalRounded} from 'react-icons/bi'

const PITCH_QUERY_REGEX = /^$|(^(?!.*--)(?!-)([0-9]{1,2}|1[01][0-9]|12[0-7])(-([0-9]{1,2}|1[01][0-9]|12[0-7]))*(-?)$)/;


// Note: To shift by an octave you just have to add 12.
// Apparenlty supposed to use that: Math.pow(2, (m-69)/12)*440, with m being the pitch
const MusicInterface = () => {

  // const synth = new Tone.Synth().toDestination()
  const [synth2, setSynth2] =  useState(new Tone.MembraneSynth().toDestination());
  // create two monophonic synths
  // const synthA = new Tone.FMSynth().toDestination();
  // const synthB = new Tone.AMSynth().toDestination();
  const [synthPoly, setSynthPoly] = useState(new Tone.PolySynth(Tone.Synth).toDestination());

  const [playingMp3, setPlayingMp3] = useState(false);
  const [iconPlayMp3, setIconPlayMp3] = useState(<AiFillPlayCircle className='icon'></AiFillPlayCircle>)
  const [audioMp3, setAudioMp3] = useState(new Audio("https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"))


  const [playingMIDI, setPlayingMIDI] = useState(false);
  const [iconSearchTest, setIconSearchTest] = useState(<AiOutlineArrowRight className='icon'></AiOutlineArrowRight>)

  const [textSearch, setTextSearch] = useState('');
  const textSearchRef = useRef();
  const [validPitchQuery, setValidPitchQuery] = useState(false);


  const handleClickTextSearch = async (e) => {
    e.preventDefault();
    console.log("", textSearch, ", (typeof textSearch): ", (typeof textSearch));
    
    // make a call to the database, then set string back to ''
    findMatchLevenshteinDistance(textSearch);
  };

  // // TODO change to a useRef instead?!
  // // Only accept input for this variable if it is a number or a -
  // const handleChangeTextSearch = async (event) => {
  //   event.preventDefault();
  //   // console.log("event.target.value: ",event.target.value)
  //   // console.log("event: ",event)
  //   let val = (/^[0-9-]*$/.test(event.target.value)) ? event.target.value : '';
  //   if (val !== '') {
  //     setTextSearch(val);
  //   }
  // };

  useEffect(() => {
    setValidPitchQuery(PITCH_QUERY_REGEX.test(textSearch))
    console.log("useEffect textSearch, validPitchQuery: ",validPitchQuery)
  }, [textSearch, validPitchQuery])

  const handleChangeQueryPitch = (event) => {
    const value = event.target.value;

    if (PITCH_QUERY_REGEX.test(value) || value[value.length-1]==='-' ) {
      setTextSearch(value)
    }
  }


const [listSearchRes, setListSearchRes] = useState([]);

// const sampler = new Tone.Sampler({
// 	urls: { "C4": "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", "A4": "A4.mp3", },
// 	release: 1,
// 	baseUrl: "https://tonejs.github.io/audio/salamander/",
// }).toDestination();

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

// // This is a tetris theme transposed from https://musescore.com/user/16693/scores/38133
// const tetris = [ [76, 4], [71, 8], [72, 8], [74, 4], [72, 8], [71, 8], [69, 4], [69, 8], [72, 8], [76, 4], [74, 8], [72, 8], [71, 4], [71, 8], [72, 8], [74, 4], [76, 4], [72, 4], [69, 4], [69, 4], [0,  4], [74, 3], [77, 8],[81, 4], [79, 8], [77, 8], [76, 3], [72, 8], [76, 4], [74, 8], [72, 8], [71, 4], [71, 8], [72, 8], [74, 4], [76, 4], [72, 4], [69, 4], [69, 4], [0, 4], ]

const oldMainMelody = [
  {'time': 0, 'note': Math.pow(2, (76 - 69) / 12) * 440, 'duration': 5},
  // {'time': 6, 'note': Math.pow(2, (100 - 69) / 12) * 440, 'duration': 10},
  {'time': '0:1', 'note': Math.pow(2, (72 - 69) / 12) * 440, 'duration': '8n.'},
  {'time': '0:2', 'note': Math.pow(2, (74 - 69) / 12) * 440, 'duration': '8n'},
  {'time': '0:2:2', 'note': Math.pow(2, (72 - 69) / 12) * 440, 'duration': '8n.'},
  {'time': '0:2:4', 'note': Math.pow(2, (71 - 69) / 12) * 440, 'duration': '8n.'},
  {'time': '0:3', 'note': 440, 'duration': '8n'}, {'time': '0:3:2', 'note': 'A4', 'duration': '2n'}, 
  // {'time': '2:0', 'note': 'A4', 'duration': '8n'}, {'time': '2:0:2', 'note': 'G4', 'duration': '8n'}, {'time': '2:1', 'note': 'F4', 'duration': '8n'}, {'time': '2:2', 'note': 'A4', 'duration': '8n'}, {'time': '2:2:2', 'note': 'G4', 'duration': '8n'}, {'time': '2:3', 'note': 'E4', 'duration': '8n'}, {'time': '2:3:2', 'note': 'F4', 'duration': '2n'}, {'time': '4:0', 'note': 'G4', 'duration': '8n'}, {'time': '4:0:2', 'note': 'F4', 'duration': '8n'}, {'time': '4:1', 'note': 'D4', 'duration': '8n'}, {'time': '4:2', 'note': 'F4', 'duration': '8n'}, {'time': '4:2:2', 'note': 'A4', 'duration': '8n'}, {'time': '4:3', 'note': 'G4', 'duration': '8n'}, {'time': '4:3:2', 'note': 'A4', 'duration': '2n'}, {'time': '5:2:2', 'note': 'G4', 'duration': '8n'}, {'time': '5:3', 'note': 'A4', 'duration': '8n'}, {'time': '5:3:2', 'note': 'B4', 'duration': '8n'}, {'time': '6:0', 'note': 'C5', 'duration': '8n'}, {'time': '6:1', 'note': 'B4', 'duration': '8n'}, {'time': '6:1:2', 'note': 'A4', 'duration': '8n'}, {'time': '6:2', 'note': 'B4', 'duration': '8n'}, {'time': '6:2:2', 'note': 'A4', 'duration': '8n'}, {'time': '6:3', 'note': 'G4', 'duration': '8n'}, {'time': '6:3:2', 'note': 'A4', 'duration': 2},
];

const mainMelody = [
  {'time': 0, 'note': Math.pow(2, (76 - 69) / 12) * 440, 'duration': 5},
  // {'time': 6, 'note': Math.pow(2, (100 - 69) / 12) * 440, 'duration': 10},
  {'time': 0.1, 'note': Math.pow(2, (72 - 69) / 12) * 440, 'duration': '8n.'},
  {'time': 0.2, 'note': Math.pow(2, (74 - 69) / 12) * 440, 'duration': '8n'},
  {'time': 2.2, 'note': Math.pow(2, (72 - 69) / 12) * 440, 'duration': '8n.'},
  {'time': 2.4, 'note': Math.pow(2, (71 - 69) / 12) * 440, 'duration': '8n.'},
  {'time': 3, 'note': 440, 'duration': '8n'}, {'time': 3.2, 'note': 'A4', 'duration': '2n'}, 
  // {'time': '2:0', 'note': 'A4', 'duration': '8n'}, {'time': '2:0:2', 'note': 'G4', 'duration': '8n'}, {'time': '2:1', 'note': 'F4', 'duration': '8n'}, {'time': '2:2', 'note': 'A4', 'duration': '8n'}, {'time': '2:2:2', 'note': 'G4', 'duration': '8n'}, {'time': '2:3', 'note': 'E4', 'duration': '8n'}, {'time': '2:3:2', 'note': 'F4', 'duration': '2n'}, {'time': '4:0', 'note': 'G4', 'duration': '8n'}, {'time': '4:0:2', 'note': 'F4', 'duration': '8n'}, {'time': '4:1', 'note': 'D4', 'duration': '8n'}, {'time': '4:2', 'note': 'F4', 'duration': '8n'}, {'time': '4:2:2', 'note': 'A4', 'duration': '8n'}, {'time': '4:3', 'note': 'G4', 'duration': '8n'}, {'time': '4:3:2', 'note': 'A4', 'duration': '2n'}, {'time': '5:2:2', 'note': 'G4', 'duration': '8n'}, {'time': '5:3', 'note': 'A4', 'duration': '8n'}, {'time': '5:3:2', 'note': 'B4', 'duration': '8n'}, {'time': '6:0', 'note': 'C5', 'duration': '8n'}, {'time': '6:1', 'note': 'B4', 'duration': '8n'}, {'time': '6:1:2', 'note': 'A4', 'duration': '8n'}, {'time': '6:2', 'note': 'B4', 'duration': '8n'}, {'time': '6:2:2', 'note': 'A4', 'duration': '8n'}, {'time': '6:3', 'note': 'G4', 'duration': '8n'}, {'time': '6:3:2', 'note': 'A4', 'duration': 2},
];


// const beginningRecord =  [
//   {"time":4.017052154,"note":69,"duration":4.82975056},{"time":7.140136054,"note":77,"duration":1.114557824},{"time":8.997732426,"note":85,"duration":0.185759632},{"time":9.102222222,"note":80,"duration":0.37151928},{"time":10.73922902,"note":72,"duration":5.20126984},{"time":10.73922902,"note":72,"duration":5.20126984},{"time":15.29034014,"note":69,"duration":4.272471648},{"time":16.8460771,"note":67,"duration":13.374693872},{"time":17.8677551,"note":67,"duration":0.185759632},{"time":19.73696145,"note":67,"duration":13.746213152}
// ]


const kickDrum = new Tone.MembraneSynth({
  volume: 6
}).toDestination();
const kicks = [ { time: 0 }, { time: 0.32 }, 
{ time: 0.51 }, { time: 0.52 }, { time: 1.1 }, { time: 1.2 }, 
// { time: '3:0:2' }, { time: '3:1:' }, { time: '4:0' }, { time: '4:3:2' }, { time: '5:1' }, { time: '6:0' }, { time: '6:1:2' }, { time: '6:3:2' }, { time: '7:0:2' }, { time: '7:1:' }, 
];


// Function for distance : strings
function calcLevenshteinDistance_str(s1, s2) {
  // Create two-dimensional array of distances
  const distances = [];
  for (let i = 0; i <= s1.length; i++) {
    distances[i] = [i];
  }
  for (let j = 0; j <= s2.length; j++) {
    distances[0][j] = j;
  }

  // Calculate Levenshtein distance
  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      if (s1.charAt(i - 1) === s2.charAt(j - 1)) {
        distances[i][j] = distances[i - 1][j - 1];
      } else {
        const deletion = distances[i - 1][j] + 1;
        const insertion = distances[i][j - 1] + 1;
        const substitution = distances[i - 1][j - 1] + 1;
        distances[i][j] = Math.min(deletion, insertion, substitution);
      }
    }
  }
  return distances[s1.length][s2.length];
}

// Function for distance: arrays of int
function calcLevenshteinDistance_int(arr1, arr2) {
  const m = arr1.length;
  const n = arr2.length;
  const dp = Array.from({ length: m + 1 }, () => Array.from({ length: n + 1 }, () => 0));

  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

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


// We keep the consideration that it makes sense to do: Math.pow(2, (76 - 69) / 12) * 440
// We set time to the value of the onset property of the input item, note to the value of the pitch property, and duration to the value of the duration property multiplied by 16 to convert from seconds to sixteenth notes (you can adjust this factor as needed depending on your use case).
// TODO Considering the music doesn't start at time 0, it might make sense to later do some modifications where everything is offset
function transformToPlayfulFormat(d){
  const outputArray = d.map(item => ({
    time: item.onset,
    note: Math.pow(2, (item.pitch - 69) / 12) * 440 ,
    duration: item.duration * 16 // Assuming duration is in seconds and you want it in sixteenth notes
  }));
  return outputArray;    
}

function playFormattedMusic(music){  
  console.log("-1- Tone.Transport.state ", Tone.Transport.state);
  // const now = Tone.now();
  // const synth3 = new Tone.MembraneSynth().toDestination();
  Tone.Transport.stop();

  if (Tone.Transport.state !== "started") {
    // Tone.Transport.start();
    Tone.Transport.start("+0.1")
    console.log("Tone.Transport.start");
  } 
  // else {
  //   Tone.Transport.stop();
  //   console.log("Tone.Transport.stop");
  // }

  // if (Tone.context.state !== "running") {
    // Tone.start();
    // console.log("audio is ready");
  // }
  console.log("-2- Tone.Transport.state ", Tone.Transport.state);

  // Tone.Transport.bpm.value = 180; // Not necessary, but good to have... // normal bpm is slower

  console.log("music: ",music);

  const now = Tone.now();
  music.forEach(tune => {
    console.log("now: ", now, ", tune.time: ", tune.time, ", sum: ", (now + tune.time));
    // synth3.triggerAttackRelease(tune.note, tune.duration, now + tune.time)
    synthPoly.triggerAttackRelease(tune.note, tune.duration, now + tune.time)
  })

  // Tone.Transport.dispose();
  // Tone.Transport.cancel();
  // Tone.Transport.clear();


  // console.log("Asking to stop after time: ", (music[music.length-1].duration + music[music.length-1].time))
  // Tone.Transport.stop(music[music.length-1].duration + music[music.length-1].time);
  console.log("-3- Tone.Transport.state ", Tone.Transport.state);
}

/**
 * Seems like this is the right approach to play any types of notes. (unnecessary)
 */
function playTestMidi(){
    console.log("---- playTestMidi")
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

    let now = Tone.now();
    Tone.Transport.bpm.value = 180; // Not necessary, but good to have... // normal bpm is slower

    // let musicPart = new Tone.Part(function (time, note) {
    //   synth2.triggerAttackRelease(note.note, note.duration, time );
    // }, mainMelody).start(0); // used to start at 0 but would bug

    // *** Seems like there was an issue that is fixed by putting the calculation of now inside the loop
    mainMelody.forEach(tune => {
      const now = Tone.now()
      synth2.triggerAttackRelease(tune.note, tune.duration, now + tune.time)
    })


    // const testRecDB = new Tone.Part(function (time,note){
    //   synth2.triggerAttackRelease(note.note,note.duration,time);
    // },beginningRecord).start(now);

    // const kickPart = new Tone.Part(function (time) {
    //   const now = Tone.now()
    //   kickDrum.triggerAttackRelease("C1", "8n", now + time);
    // }, kicks).start(now);
    
    kicks.forEach(tune => {
      const now = Tone.now()
      kickDrum.triggerAttackRelease("C1", "8n", now + tune.time)
    })

    // *** Trying to stop the transport after playing
    // console.log("mainMelody[mainMelody.length-1].time: ",mainMelody[mainMelody.length-1].time)
    // console.log("now: ",now);
    // // console.log("now + mainMelody[mainMelody.length-1].time: "+ now + mainMelody[mainMelody.length-1].time)
    // // let [minutes, seconds, milliseconds] = mainMelody[mainMelody.length-1].time.split(":").map(Number);
    // // let totalSeconds = (minutes * 60) + seconds + (milliseconds / 1000);
    // // console.log("totalSeconds: ", totalSeconds,", now + totalSeconds: ", (now + totalSeconds));
    // const totalSeconds = mainMelody[mainMelody.length-1].time  ; // need to consider duration
    // console.log("now + totalSeconds: ",(now + totalSeconds));
    // Tone.Transport.stop(now + totalSeconds);
}

function playMidiDatabase(){
  Tone.Transport.stop();
  if (Tone.context.state !== "running") {
    Tone.start();
    console.log("audio is ready");
  }

  var d = getMusicMIDI("BGR0082-T1", localStorage?.username,transformToPlayfulFormat,playFormattedMusic);
  console.log("---- playMidiDatabase. d: ",d);
}

function playSampleMidiDatabase(){
  Tone.Transport.stop();
  if (Tone.context.state !== "running") {
    Tone.start();
    console.log("audio is ready");
  }

  var d = getSampleMIDI("BGR0082-T1", 0, 10,localStorage?.username, transformToPlayfulFormat,playFormattedMusic);
  console.log("---- playSampleMidiDatabase. d: ",d);
}

function formatAndPlay(item){
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

function findMatchLevenshteinDistance(strNotes="69-76-76-74-76"){
  console.log("---- findMatchLevenshteinDistance.")

  getMatchLevenshteinDistance(
    strNotes,
    1, 
    localStorage?.username, 
    transformToPlayfulFormat,
    playFormattedMusic, 
    calcLevenshteinDistance_int,
    setListSearchRes
  );

  setTextSearch('');
}

function playMp3(){
  console.log("---- playMp3. playing: ",playingMp3)
  if (playingMp3){
    audioMp3.pause();
    setIconPlayMp3(<AiFillPlayCircle className='icon'></AiFillPlayCircle>)
  } else {
    audioMp3.play();
    setIconPlayMp3(<AiFillPauseCircle className='icon'></AiFillPauseCircle>)
  }
  setPlayingMp3(!playingMp3);
}

function resetMp3(){
  if (playingMp3){
    audioMp3.pause();
    setIconPlayMp3(<AiFillPlayCircle></AiFillPlayCircle>)
    setPlayingMp3(!playingMp3);
  }
  setAudioMp3(new Audio("https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"));
}

  return (
    <div className="musicInterface">
      <h1>Music Interface</h1>
      <br />

      {/* ==== SEARCH INPUT ==== */}
      <div className="topTextSearch">
        <div className='disclaimerSearchPitch'>Enter a query based on pitch notes (from 0 to 127) separated with - characters.</div>
          <input 
            type="text"  
            ref={textSearchRef}
            autoComplete="off"
            required
            value={textSearch} 
            // onChange={ (e) => PITCH_QUERY_REGEX.test(e.target.value)? setTextSearch(e.target.value) : '' } 
            // onChange={ (e) => setTextSearch(e.target.value) } 
            onChange={handleChangeQueryPitch}
          />
          <button onClick={handleClickTextSearch}>Submit search</button>
        </div>


      {/* ==== BUTTONS ====  */}
      <div className="buttonsMusicInterface">
        <div className='playMusic' >
          Test Search
          <hr />
          69-76-76-74-76
          <hr />
          <div className='iconPlayPause'
            onClick={(c) => {
              console.log("about to play search");
              findMatchLevenshteinDistance();
              console.log("done with play search");
            }}
          >
            {iconSearchTest}
          </div>
        </div>
        <div className='playMusic' >
          Play Test Link Mp3
          <hr />
          <div className='iconPlayPause'
            onClick={(c) => {
              console.log("about to play mp3");
              playMp3();
              console.log("done with mp3");
            }}
          >
            {iconPlayMp3}
          </div>
          <div className='iconResetSong'
            onClick={(c) => { console.log("resetMp3"); resetMp3(); console.log("done with resetMp3"); }} >
            <ImLoop2 className='icon' />
          </div>
        </div>
        <div
          className="playMusic"
          onClick={(c) => {
            console.log("about to play sample from database");
            playSampleMidiDatabase();
            console.log("done with sample from database");
          }}
        >
          Play Test Sample Database Music
        </div>
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

      {/* ==== OUTPUT SEARCH ==== */}
      <div className='wrapperMusicSearch'>
        {(listSearchRes.length <= 0) ? (<></>) :
          <div className='outputMusicSearch'>
            <h2>List of results for your search</h2>
            {listSearchRes.map((item, i ) => (
              <MusicRes
                key={i + '' + item.recording + '_' + item.arrNotes.toString().replaceAll(',', '-')}
                text={i + '_' + item.recording }
                length = {  item.arrTime[item.arrTime.length-1] + item.arrDurations[item.arrDurations.length-1] -  item.arrTime[0] }
                notes={ item.arrNotes.toString().replaceAll(',', '-') }
                durations={ item.arrDurations.toString().replaceAll(',', '-') }
                times={ item.arrTime.toString().replaceAll(',', '-') }
                distance = { item.distCalc }
                /** Need to format the structure */
                // funcPlayMIDI= {() => playFormattedMusic(item.arrNotes) }
                funcPlayMIDI = { () => formatAndPlay(item) }

                // updateMode={() => updateMode(item._id, item.text, localStorage?.username)}
                // deleteJazzDap={() => deleteJazzDap(item._id, setJazzDap)}
              />
            ))}
            
             {/* {(listSearchRes.map((item, i) => {
              return (
                <div className='resMusicSearch'
                  key={i + '' + item.recording + '_' + item.arrNotes.toString().replaceAll(',', '-')} >
                  Recording: {item.recording}. Notes: {item.arrNotes.toString().replaceAll(',', '-')}. Distance match: {item.distCalc}
                </div>)
            })
            )}  */}
          </div>
        }
      </div>

    </div>
  );
}


export default MusicInterface;