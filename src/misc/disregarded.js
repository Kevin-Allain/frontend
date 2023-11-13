// create two monophonic synths
// const synthA = new Tone.FMSynth().toDestination();
// const synthB = new Tone.AMSynth().toDestination();
const [synthPoly, setSynthPoly] = useState(new Tone.PolySynth(Tone.Synth).toDestination());
function playSinth() {
  const now = Tone.now();
  synth2.current.triggerAttackRelease("C#4", "8n", now + 0.25); // synth2.triggerAttackRelease("E4", "8n", now + 0.5); // synth2.triggerAttackRelease("G4", "8n", now + 1); // synth2.triggerAttackRelease(440, "800n", now + 1.5);
  synth2.current.triggerAttackRelease("C#4s", "8n", now + 0.5);
  synth2.current.triggerAttackRelease(360, 1, now + 1); synth2.current.triggerAttackRelease(360, 1, now + 2); synth2.current.triggerAttackRelease(360, 5, now + 3);
  synthPoly.triggerAttack("D4", now + 3); synthPoly.triggerAttack("F4", now + 0.5 + 3); // synthPoly.triggerAttack("A4", now + 1); // synthPoly.triggerAttack("C5", now + 1.5); // synthPoly.triggerAttack("E5", now + 2); // synthPoly.triggerAttack("G6", now + 3); // synthPoly.triggerAttack("D3", now + 4); 
  synthPoly.triggerRelease(["D4", "F4", "A4", "C5", "E5"], now + 1 + 3);
  // Tone.loaded().then(() => { sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], "16n", now+5);  })
}

const [playingMIDI, setPlayingMIDI] = useState(false);

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


// // This is a tetris theme transposed from https://musescore.com/user/16693/scores/38133
// const tetris = [ [76, 4], [71, 8], [72, 8], [74, 4], [72, 8], [71, 8], [69, 4], [69, 8], [72, 8], [76, 4], [74, 8], [72, 8], [71, 4], [71, 8], [72, 8], [74, 4], [76, 4], [72, 4], [69, 4], [69, 4], [0,  4], [74, 3], [77, 8],[81, 4], [79, 8], [77, 8], [76, 3], [72, 8], [76, 4], [74, 8], [72, 8], [71, 4], [71, 8], [72, 8], [74, 4], [76, 4], [72, 4], [69, 4], [69, 4], [0, 4], ]

const oldMainMelody = [
  { 'time': 0, 'note': Math.pow(2, (76 - 69) / 12) * 440, 'duration': 5 },
  // {'time': 6, 'note': Math.pow(2, (100 - 69) / 12) * 440, 'duration': 10},
  { 'time': '0:1', 'note': Math.pow(2, (72 - 69) / 12) * 440, 'duration': '8n.' },
  { 'time': '0:2', 'note': Math.pow(2, (74 - 69) / 12) * 440, 'duration': '8n' },
  { 'time': '0:2:2', 'note': Math.pow(2, (72 - 69) / 12) * 440, 'duration': '8n.' },
  { 'time': '0:2:4', 'note': Math.pow(2, (71 - 69) / 12) * 440, 'duration': '8n.' },
  { 'time': '0:3', 'note': 440, 'duration': '8n' }, { 'time': '0:3:2', 'note': 'A4', 'duration': '2n' },
  // {'time': '2:0', 'note': 'A4', 'duration': '8n'}, {'time': '2:0:2', 'note': 'G4', 'duration': '8n'}, {'time': '2:1', 'note': 'F4', 'duration': '8n'}, {'time': '2:2', 'note': 'A4', 'duration': '8n'}, {'time': '2:2:2', 'note': 'G4', 'duration': '8n'}, {'time': '2:3', 'note': 'E4', 'duration': '8n'}, {'time': '2:3:2', 'note': 'F4', 'duration': '2n'}, {'time': '4:0', 'note': 'G4', 'duration': '8n'}, {'time': '4:0:2', 'note': 'F4', 'duration': '8n'}, {'time': '4:1', 'note': 'D4', 'duration': '8n'}, {'time': '4:2', 'note': 'F4', 'duration': '8n'}, {'time': '4:2:2', 'note': 'A4', 'duration': '8n'}, {'time': '4:3', 'note': 'G4', 'duration': '8n'}, {'time': '4:3:2', 'note': 'A4', 'duration': '2n'}, {'time': '5:2:2', 'note': 'G4', 'duration': '8n'}, {'time': '5:3', 'note': 'A4', 'duration': '8n'}, {'time': '5:3:2', 'note': 'B4', 'duration': '8n'}, {'time': '6:0', 'note': 'C5', 'duration': '8n'}, {'time': '6:1', 'note': 'B4', 'duration': '8n'}, {'time': '6:1:2', 'note': 'A4', 'duration': '8n'}, {'time': '6:2', 'note': 'B4', 'duration': '8n'}, {'time': '6:2:2', 'note': 'A4', 'duration': '8n'}, {'time': '6:3', 'note': 'G4', 'duration': '8n'}, {'time': '6:3:2', 'note': 'A4', 'duration': 2},
];

const mainMelody = [
  { 'time': 0, 'note': Math.pow(2, (76 - 69) / 12) * 440, 'duration': 5 },
  // {'time': 6, 'note': Math.pow(2, (100 - 69) / 12) * 440, 'duration': 10},
  { 'time': 0.1, 'note': Math.pow(2, (72 - 69) / 12) * 440, 'duration': '8n.' },
  { 'time': 0.2, 'note': Math.pow(2, (74 - 69) / 12) * 440, 'duration': '8n' },
  { 'time': 2.2, 'note': Math.pow(2, (72 - 69) / 12) * 440, 'duration': '8n.' },
  { 'time': 2.4, 'note': Math.pow(2, (71 - 69) / 12) * 440, 'duration': '8n.' },
  { 'time': 3, 'note': 440, 'duration': '8n' }, { 'time': 3.2, 'note': 'A4', 'duration': '2n' },
  // {'time': '2:0', 'note': 'A4', 'duration': '8n'}, {'time': '2:0:2', 'note': 'G4', 'duration': '8n'}, {'time': '2:1', 'note': 'F4', 'duration': '8n'}, {'time': '2:2', 'note': 'A4', 'duration': '8n'}, {'time': '2:2:2', 'note': 'G4', 'duration': '8n'}, {'time': '2:3', 'note': 'E4', 'duration': '8n'}, {'time': '2:3:2', 'note': 'F4', 'duration': '2n'}, {'time': '4:0', 'note': 'G4', 'duration': '8n'}, {'time': '4:0:2', 'note': 'F4', 'duration': '8n'}, {'time': '4:1', 'note': 'D4', 'duration': '8n'}, {'time': '4:2', 'note': 'F4', 'duration': '8n'}, {'time': '4:2:2', 'note': 'A4', 'duration': '8n'}, {'time': '4:3', 'note': 'G4', 'duration': '8n'}, {'time': '4:3:2', 'note': 'A4', 'duration': '2n'}, {'time': '5:2:2', 'note': 'G4', 'duration': '8n'}, {'time': '5:3', 'note': 'A4', 'duration': '8n'}, {'time': '5:3:2', 'note': 'B4', 'duration': '8n'}, {'time': '6:0', 'note': 'C5', 'duration': '8n'}, {'time': '6:1', 'note': 'B4', 'duration': '8n'}, {'time': '6:1:2', 'note': 'A4', 'duration': '8n'}, {'time': '6:2', 'note': 'B4', 'duration': '8n'}, {'time': '6:2:2', 'note': 'A4', 'duration': '8n'}, {'time': '6:3', 'note': 'G4', 'duration': '8n'}, {'time': '6:3:2', 'note': 'A4', 'duration': 2},
];


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


// const beginningRecord =  [
//   {"time":4.017052154,"note":69,"duration":4.82975056},{"time":7.140136054,"note":77,"duration":1.114557824},{"time":8.997732426,"note":85,"duration":0.185759632},{"time":9.102222222,"note":80,"duration":0.37151928},{"time":10.73922902,"note":72,"duration":5.20126984},{"time":10.73922902,"note":72,"duration":5.20126984},{"time":15.29034014,"note":69,"duration":4.272471648},{"time":16.8460771,"note":67,"duration":13.374693872},{"time":17.8677551,"note":67,"duration":0.185759632},{"time":19.73696145,"note":67,"duration":13.746213152}
// ]


const kickDrum = new Tone.MembraneSynth({
  volume: 6
}).toDestination();
const kicks = [{ time: 0 }, { time: 0.32 },
{ time: 0.51 }, { time: 0.52 }, { time: 1.1 }, { time: 1.2 },
  // { time: '3:0:2' }, { time: '3:1:' }, { time: '4:0' }, { time: '4:3:2' }, { time: '5:1' }, { time: '6:0' }, { time: '6:1:2' }, { time: '6:3:2' }, { time: '7:0:2' }, { time: '7:1:' }, 
];

/**
 * Seems like this is the right approach to play any types of notes. (unnecessary)
 */
function playTestMidi() {
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
  Tone.Transport.bpm.value = 180; // Not necessary, but good to have... // normal bpm is slower

  // let musicPart = new Tone.Part(function (time, note) {
  //   synth2.triggerAttackRelease(note.note, note.duration, time );
  // }, mainMelody).start(0); // used to start at 0 but would bug

  mainMelody.forEach(tune => {
    const now = Tone.now()
    synth2.current.triggerAttackRelease(tune.note, tune.duration, now + tune.time)
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

function playMidiDatabase() {
  Tone.Transport.stop();
  if (Tone.context.state !== "running") {
    Tone.start();
    console.log("audio is ready");
  }

  var d = getMusicMIDI("BGR0082-T1", localStorage?.username, transformToPlayfulFormat, playFormattedMusic);
  console.log("---- playMidiDatabase. d: ", d);
}

function playSampleMidiDatabase() {
  Tone.Transport.stop();
  if (Tone.context.state !== "running") {
    Tone.start();
    console.log("audio is ready");
  }

  var d = getSampleMIDI("BGR0082-T1", 0, 10, localStorage?.username, transformToPlayfulFormat, playFormattedMusic);
  console.log("---- playSampleMidiDatabase. d: ", d);
}



{/* <div
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
        </div> */}
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

{/* {(listSearchRes.map((item, i) => {
              return (
                <div className='resMusicSearch'
                  key={i + '' + item.recording + '_' + item.arrNotes.toString().replaceAll(',', '-')} >
                  Recording: {item.recording}. Notes: {item.arrNotes.toString().replaceAll(',', '-')}. Distance match: {item.distCalc}
                </div>)
            })
            )}  */}


// ------------------
{/* Test Scrolling. Works but need to be updated for work with... recording. */ }
// const catNames = ['Tom', 'Maru', 'Jellylorum', 'Whiskers', 'Mittens'];
// const catRefs = useRef(catNames.map(() => React.createRef()));    
// const handleScrollToCat = (index) => {
//   catRefs.current[index].current.scrollIntoView({
//     behavior: 'smooth', block: 'nearest', inline: 'center'
//   });
// }          
{/* 
      <nav>
        {catNames.map((name, index) => (
          <button key={index+'catButton'} onClick={() => handleScrollToCat(index)}>
            {name}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {catNames.map((name, index) => (
            <li key={'catNames'+index}>
              <img
                src={`https://placekitten.com/g/200/200`}
                alt={name}
                ref={catRefs.current[index]}
              />
            </li>
          ))}
        </ul>
      </div> 
      */}


// #### Color schemes ####
// - 1
// {
//   "C": "#003f5c",
//   "C#":"#0084c2",
//   "D": "#2c4875",
//   "D#":"#4e78bc",
//   "E": "#58508d",
//   "F": "#bc5090",
//   "F#":"#d99bc0",
//   "G": "#de5a79",
//   "G#":"#efaebd",
//   "A": "#ff6361",
//   "A#":"#ffc8c7",
//   "B": "#ffa600"
// }      

// - 2 (in progress)
// {
//   "C": "#9ab9ed",
//   "C#":"#0084c2",
//   "D": "#bdf796",
//   "D#":"#4e78bc",
//   "E": "#f9ae7f",
//   "F": "#ef7c91",
//   "F#":"#d99bc0",
//   "G": "#a3a3ff",
//   "G#":"#efaebd",
//   "A": "#c89ff4",
//   "A#":"#ffc8c7",
//   "B": "#AA3E13"
// }

// ######## MIGHT BE USEFUL LATER
// ---- Cleaning some code from MusicInterface
function handleScroll() {
  const buttonListLogsNumbers = buttonListLogsNumbersRef.current;
  if (buttonListLogsNumbers) {
    const buttonListLogsNumbersPosition = buttonListLogsNumbers.offsetTop;
    if (window.pageYOffset > buttonListLogsNumbersPosition) {
      // Move the buttonListLogsNumbers to the left when scroll position is lower than its position
      buttonListLogsNumbers.style.position = 'fixed';
      buttonListLogsNumbers.style.left = '10px'; // Adjust the left position as needed
    } else {
      // Reset the position when scroll position is above its position
      buttonListLogsNumbers.style.position = 'static';
      buttonListLogsNumbers.style.left = 'auto';
    }
  }
}


function getResultsInfo(lognumbers, infoMusicList, setInfoMusicList) {
  console.log("getResultsInfo, lognumbers: ", lognumbers, { infoMusicList, setInfoMusicList });
  getTracksMetadata(
    lognumbers,
    infoMusicList,
    setInfoMusicList
  );
}


function playMp3() {
  console.log("---- playMp3. playing: ", playingMp3)
  if (playingMp3) {
    audioMp3.pause();
    setIconPlayMp3(<AiFillPlayCircle className='icon'></AiFillPlayCircle>)
  } else {
    audioMp3.play();
    setIconPlayMp3(<AiFillPauseCircle className='icon'></AiFillPauseCircle>)
  }
  setPlayingMp3(!playingMp3);
}

function resetMp3() {
  if (playingMp3) {
    audioMp3.pause();
    setIconPlayMp3(<AiFillPlayCircle></AiFillPlayCircle>)
    setPlayingMp3(!playingMp3);
  }
  setAudioMp3(new Audio("https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"));
}

// Function for distance : strings
function calcLevenshteinDistance_str(s1, s2) {
  // Create two-dimensional array of distances
  const distances = [];
  for (let i = 0; i <= s1.length; i++) { distances[i] = [i]; }
  for (let j = 0; j <= s2.length; j++) { distances[0][j] = j; }
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

// TODO use for note playing!!! https://tonejs.github.io/
// const sampler = new Tone.Sampler({
// 	urls: { "C4": "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", "A4": "A4.mp3", },
// 	release: 1,
// 	baseUrl: "https://tonejs.github.io/audio/salamander/",
// }).toDestination();


// ---- Piano disregarded
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

// -- Previous part of useEffect in Piano
// document.querySelectorAll(".key").forEach((key) => {
//   key.addEventListener("pointerdown", handlePointerDown);
//   key.addEventListener("pointerup", handlePointerUp);
// });

// return () => {
//   document.querySelectorAll(".key").forEach((key) => {
//     key.removeEventListener("pointerdown", handlePointerDown);
//     key.removeEventListener("pointerup", handlePointerUp);
//   });
// };


// previously part of ResultsComponent
// trackElements.forEach((element) => { observer.observe(element);  });

//       // trackElements.forEach((element) => { observer.unobserve(element); });


// useEffect(() => {
//   const observer = new IntersectionObserver((entries) => {
//     const newVisibleTracks = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target.getAttribute('data-track')); setVisibleTracks(newVisibleTracks);
//   });
//   if (tracksContainerRef.current) {
//     const trackElements = tracksContainerRef.current.querySelectorAll('.trackItem');
//     trackElements.forEach((element, index) => { const track = listTracks[index]; element.setAttribute('data-track', track); observer.observe(element); });
//   }
//   return () => {
//     if (tracksContainerRef.current) { const trackElements = tracksContainerRef.current.querySelectorAll('.trackItem');
//       trackElements.forEach((element) => { observer.unobserve(element); });
//     }};
// }, [listTracks]);


// Removed from MusicInfo
// Global variables addition for workflow -> Might be changed to call an EmbeddedWorkflowManager
// import { useSelector, useDispatch } from 'react-redux';
// import { setWorkflows } from '../Reducers/WorkflowReducer';


// ------ Removed from App.js
<div className="info">
  <hr /><br />
  <p>
    <font face="Helvetica, sans-serif" color="ghostwhite">
      <b>
        A NEH-AHRC New Directions for Digital Scholarship in Cultural
        Institutions project
      </b>
    </font>
  </p>
  <div className="textInfo">
    <span>
      <font size="3">
        <font color="#dce0cd">
          New Directions in Digital Jazz Studies uses state of the art
          music information retrieval and artificial intelligence
          algorithms for the analysis of jazz recordings and linked data
          to enable novel approaches to co-creative use of materials in
          the archival collections of the Institute of Jazz Studies and
          Scottish Jazz Archive. This trans-Atlantic collaboration between
          jazz historians, technologists, and jazz archivists will expand
          access to unique materials held in archives and illuminate their
          musical relationships to more widely studied recordings. This
          project will create, analyse, and visualize relationships
          between audio and other materials and create rich research
          workflows to be shared within the scholarly community as a novel
          way to support co-creation with cultural institutions. We
          envision a disciplinary transformation through the discovery of
          new models for jazz historiography, and a broader,
          interdisciplinary transformation in methodology for digital
          humanities
        </font>
      </font>
    </span>
  </div>

  <br />
  <hr />
  <br />

  <ul>
    <p>
      <span>
        <font color="ghostwhite">
          <font size="3">
            <strong>Investigators</strong>
          </font>
        </font>
      </span>
    </p>
    <div className="textInfo">
      <p>
        <span>
          <font size="3">
            <font color="#dce0cd">
              <a
                className="externalLink"
                href="http://www.city.ac.uk/people/academics/tillman-weyde"
              >
                Tillman Weyde
              </a>{" "}
              (PI{" "}
            </font>
          </font>
          <font size="3">
            <font color="#dce0cd">UK</font>
          </font>
          <font size="3">
            <font color="#dce0cd">
              ),
              <a className="externalLink" href="http://www.city.ac.uk/">
                City University of London
              </a>
              , UK
            </font>
          </font>
        </span>
      </p>
      <p>
        <span>
          <font size="3">
            <font color="#dce0cd">
              <a
                className="externalLink"
                href="https://music.illinois.edu/faculty/gabriel-solis"
              >
                Gabriel Solis
              </a>{" "}
            </font>
          </font>
          <font size="3">
            <font color="#dce0cd">(PI US)</font>
          </font>
          <font size="3">
            <font color="#dce0cd">
              ,
              <a className="externalLink" href="http://illinois.edu/">
                University of Illinois Champaign Urbana
              </a>
              , USA
            </font>
          </font>
        </span>
      </p>
      <p>
        <span>
          <font size="3">
            <font color="#dce0cd">
              <a
                className="externalLink"
                href="http://www.eecs.qmul.ac.uk/%7Esimond"
              >
                Simon Dixon
              </a>
              ,{" "}
              <a className="externalLink" href="http://www.qmul.ac.uk/">
                Queen Mary University of London
              </a>
              , UK
            </font>
          </font>
        </span>
      </p>
      <p>
        <span>
          <font size="3">
            <font color="#dce0cd">
              <a
                className="externalLink"
                href="https://www.napier.ac.uk/people/haftor-medboe"
              >
                Haftor Medboe
              </a>
              ,{" "}
              <a
                className="externalLink"
                href="https://www.napier.ac.uk/"
              >
                Edinburgh Napier University
              </a>
              , UK
            </font>
          </font>
        </span>
      </p>
      <p>
        <span>
          <font size="3">
            <font color="#dce0cd">
              <a
                className="externalLink"
                href="https://www.bcu.ac.uk/research/our-people/a-e/pedro-cravinho"
              >
                Pedro Cravinho
              </a>
              ,{" "}
              <a className="externalLink" href="https://www.bcu.ac.uk/">
                Birmingham City University
              </a>
              , UK
            </font>
          </font>
        </span>
      </p>
      <p>
        <span>
          <font size="3">
            <font color="#dce0cd">
              <a
                className="externalLink"
                href="https://www.libraries.rutgers.edu/directory/adriana-cuervo"
              >
                Adriana Cuervo
              </a>
              ,{" "}
              <a className="externalLink" href="https://www.rutgers.edu/">
                Rutgers University
              </a>
              , USA
            </font>
          </font>
        </span>
      </p>
    </div>
    <br />
    <hr />
    <br />
    <p>
      <span>
        <font color="ghostwhite">
          <font size="3">
            <strong>Partners</strong>
          </font>
        </font>
      </span>
    </p>
    <div className="textInfo">
      <p>
        <span>
          <font size="3">
            <font color="#dce0cd">
              <a
                className="externalLink"
                href="http://scottishjazzarchive.org/"
              >
                Scottish Jazz Archive
              </a>
              , UK
            </font>
          </font>
        </span>
      </p>
    </div>
    <br />
    <hr />
    <br />
    <p>
      <span>
        <font color="ghostwhite">
          <font size="3">
            <b>Duration and Funding</b>
          </font>
        </font>
      </span>
    </p>
    <div className="textInfo">
      <p>
        <span>
          <font size="3">
            <font color="#dce0cd">
              The project is an ongoing collaboration between six
              different universities across four countries, which started
              in Feb 2021 and is funded until July 2024 by the NEH/AHRC
              New Directions for Digital Scholarship in Cultural
              Institutions Call (see announcement
              <a
                className="externalLink"
                href="https://webarchive.nationalarchives.gov.uk/ukgwa/20200619160542/https://ahrc.ukri.org/funding/apply-for-funding/current-opportunities/neh-ahrc-new-directions-for-digital-scholarship-in-cultural-institutions-call/"
              >
                here
              </a>
              ) via the support of the Arts and Humanities Research
              Council (UK) and the National Endowment for the Humanities
              (USA).
            </font>
          </font>
        </span>
      </p>
    </div>
    <br />
    <div className="footer">
      <p>
        <span>
          <font color="#72aee6">
            <a
              className="externalLink"
              href="https://mirg.city.ac.uk/blog/wp-content/uploads/2021/11/logo.png"
            >
              <font color="#000080"> </font>
              <img
                src="https://mirg.city.ac.uk/blog/wp-content/uploads/2021/11/logo.png"
                className="imageFooter"
                alt="some value"
                name="Image2"
                align="bottom"
                width="280"
                height="71"
                border="1"
              />
            </a>
          </font>
          <a
            className="externalLink"
            href="https://mirg.city.ac.uk/blog/wp-content/uploads/2021/11/logo.png"
          ></a>
          <a
            className="externalLink"
            href="https://mirg.city.ac.uk/blog/wp-content/uploads/2021/11/logo-us-neh.png"
          >
            <font color="#000080">
              <img
                src="https://mirg.city.ac.uk/blog/wp-content/uploads/2021/11/logo-us-neh.png"
                className="imageFooter"
                alt="some value"
                name="Image3"
                align="bottom"
                width="280"
                height="67"
                border="1"
              />
            </font>
          </a>
          <a
            className="externalLink"
            href="https://mirg.city.ac.uk/blog/wp-content/uploads/2021/11/logo-us-neh.png"
          ></a>
        </span>
      </p>
    </div>
  </ul>
</div>


// from App.js
{/* <div className="container">
            <div className="jazzdapInput">
              <input
                type="text"
                placeholder="Add Jazzdap"
                name="AddJazzDap"
                id="AddJazzDap"
                value={textInputJazzDAP}
                onChange={(e) => setTextInputJazzDAP(e.target.value)}
              />
              <div className="add" onClick={
                isUpdating
                  ? () =>
                    updateJazzDap(
                      jazzDapId,
                      textInputJazzDAP,
                      setListJazzDap,
                      setTextInputJazzDAP,
                      setIsUpdating,
                      localStorage.username ? localStorage.username : null)
                  : () =>
                    addJazzDap(
                      textInputJazzDAP,
                      setTextInputJazzDAP,
                      setListJazzDap,
                      localStorage.username ? localStorage.username : null
                    )
              }
              >
                {isUpdating ? "Update" : "Add"}
              </div>
            </div>
            <div className="list">
              {listJazzDap.map((item) => (
                <JazzDap
                  key={item._id}
                  text={item.text}
                  updateMode={() => updateMode(item._id, item.text, localStorage?.username)}
                  deleteJazzDap={() => deleteJazzDap(item._id, setListJazzDap)}
                />
              ))}
            </div>
          </div> */}



// -------- From ResultsComponent
// let tracksIdsInRange = Array.from(document.getElementsByClassName('trackItem'))
//   .filter((a, ndx) => indexBegObserver + ndx < indexEndObserver)
//   .map(a => a.id);
// console.log("tracksIdsInRange: ",tracksIdsInRange,", indexBegObserver: ",indexBegObserver,", indexEndObserver: ",indexEndObserver,", visibleTracks: ",visibleTracks);
// const observer = new IntersectionObserver((entries) => {
//   console.log('trackElementsDocument[0]: ', trackElementsDocument[0], ", trackElementsDocument.length: ", trackElementsDocument.length,", entries: ", entries,", #: ", entries.length);
//   let entriesId = entries.map(a => a.target.id); console.log("entriesId: ",entriesId);
//   let entriesVisibility = {};
//   let indexesObservers = [];
//   let countEntriesListed = 0;
//   entries.forEach((entry, index) => {
//     const track = entry.target.getAttribute('data-track');
//     const isVisible = entry.isIntersecting;
//     // Set CSS visibility based on intersection
//     // TODO later: draw content, rather than just change css
//     if (isVisible) { entry.target.style.visibility = 'visible'; }
//     else { entry.target.style.visibility = 'hidden'; }
//     entriesVisibility[entry.target.id] = entry.isIntersecting;
//     indexesObservers.push(index);
//     console.log('Track:', track, 'Is Visible:', isVisible);
//     countEntriesListed++;
//   });
//   console.log('entriesVisibility: ', entriesVisibility,", indexesObservers: ", indexesObservers,", countEntriesListed: ",countEntriesListed);
//   // start loading from middle (direction to consider later, start loading down)
//   // cases to consider:
//   // - beginning of track items
//   // - end of track items
//   // - middle of tracks
//   let indexOfIndexIntersect = tracksIdsInRange.indexOf(entriesId[0]);
//   console.log("}}} indexOfIndexIntersect: ", indexOfIndexIntersect, ", entriesId: ", entriesId, ", tracksIdsInRange: ", tracksIdsInRange);
//   if (entriesId.length === 1) {
//     // almost certainly wrong approach...
//     if (indexOfIndexIntersect === 5) {
//       console.log("Changing attributes for selection of tracks");
//       setIndexBegObserver(indexBegObserver + 5); setIndexEndObserver(indexEndObserver + 5);
//     }
//   }
//   // Other console logs...      
//   const newVisibleTracks = entries.map((entry) => ({
//     track: entry.target.getAttribute('data-track'),
//     isVisible: entry.isIntersecting,
//   }));
//   setVisibleTracks(newVisibleTracks);
// });
// console.log("tracksQuerySelection: ",tracksQuerySelection,", tracksQuerySelection.length: ",tracksQuerySelection.length);
// let trackElementsDocument =
//   Array.from(document.getElementsByClassName('trackItem'))
//     .filter((a, ndx) => indexBegObserver+ndx < indexEndObserver); // For test. Will need to change it to another way based on... which elements are visible
// console.log("selection of trackElementsDocument: ", trackElementsDocument,
//   ", indexBegObserver: ", indexBegObserver,
//   ", indexEndObserver: ", indexEndObserver);
// trackElementsDocument.forEach((element) => {
//   observer.observe(element);
// });
// // Clean up the observer when the component is unmounted
// return () => {
//   trackElementsDocument.forEach((element) => {
//     observer.unobserve(element);
//   });
// };          

// -------- From MusicInterface testing tabbed interface
{/* <div className="row">
        <div className="col-4">
          <div className="list-group" id="list-tab" role="tablist">
            <a className="list-group-item list-group-item-action active" id="list-home-list" data-toggle="list" href="#list-home" role="tab" aria-controls="home">Home</a>
            <a className="list-group-item list-group-item-action" id="list-profile-list" data-toggle="list" href="#list-profile" role="tab" aria-controls="profile">Profile</a>
            <a className="list-group-item list-group-item-action" id="list-messages-list" data-toggle="list" href="#list-messages" role="tab" aria-controls="messages">Messages</a>
            <a className="list-group-item list-group-item-action" id="list-settings-list" data-toggle="list" href="#list-settings" role="tab" aria-controls="settings">Settings</a>
          </div>
        </div>
        <div className="col-8">
          <div className="tab-content" id="nav-tabContent">
            <div className="tab-pane fade show active" id="list-home" role="tabpanel" aria-labelledby="list-home-list"> Home text</div>
            <div className="tab-pane fade" id="list-profile" role="tabpanel" aria-labelledby="list-profile-list">Profile text</div>
            <div className="tab-pane fade" id="list-messages" role="tabpanel" aria-labelledby="list-messages-list">Messages text</div>
            <div className="tab-pane fade" id="list-settings" role="tabpanel" aria-labelledby="list-settings-list">Settings text</div>
          </div>
        </div>
    </div> */}
{/* <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
      <Row>
        <Col sm={1}>
          <ListGroup>
            <ListGroup.Item action href="#link1">
              Recoding 1
            </ListGroup.Item>
            <ListGroup.Item action href="#link2">
              Recording 2
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col sm={2}>
          <ListGroup>
            <ListGroup.Item action href="#link1">
              Track alpha
            </ListGroup.Item>
            <ListGroup.Item action href="#link2">
            Track beta
            </ListGroup.Item>
            <ListGroup.Item action href="#link2">
            Track gamma
            </ListGroup.Item>
            <ListGroup.Item action href="#link2">
            Track delta
            </ListGroup.Item>
            <ListGroup.Item action href="#link2">
            Track I don't know greek alphabet
            </ListGroup.Item>
            <ListGroup.Item action href="#link2">
            Track Dragon Ball
            </ListGroup.Item>
            <ListGroup.Item action href="#link2">
            Track Zion
            </ListGroup.Item>                                                            
          </ListGroup>
        </Col>
        <Col sm={8}>
          <Tab.Content>
            <Tab.Pane className='icon bg-white h-96' eventKey="#link1">Tab pane content 1</Tab.Pane>
            <Tab.Pane className='icon bg-white h-[32rem]' eventKey="#link2">Tab pane content 2</Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container> */}

{/* Approach with ResultsComponent */ }
{/* <div className='wrapperMusicSearch'>
        {(listSearchRes.length <= 0) ? (<></>) :
          <div className='outputMusicSearch'>
            <p className='text-lg'>List of results for your search: <h4>{oldSearch}</h4></p>
            <div className='annotationIndication'> Annotations <AnnotationSystem type={"search"} info={oldSearch} /> </div>
            <div id='buttonListLogsNumbers' ref={buttonListLogsNumbersRef}>
              <p className='titleRecMatched'>Recordings:</p>
              <nav> {listLogNumbers.map((a, index) =>( <div className='buttonRefLogNumber' key={index + 'lognumberButton'} onClick={() => handleScrollToRecording(index)}> {a} </div> ))} </nav>
            </div>
            <div className='musicInterfaceContent'>
              <ResultsComponent
                listLogNumbers={listLogNumbers} lognumbersRefs={lognumbersRefs} scrollToButtonListLogsNumbers={scrollToButtonListLogsNumbers} findMatchRecording={findMatchRecording} infoMusicList={infoMusicList} listTracks={listTracks}
                scrollToButtonListRecordingsFollowing={scrollToButtonListRecordingsFollowing} scrollToButtonListTracksFollowing={scrollToButtonListTracksFollowing} listSearchRes={listSearchRes}
                formatAndPlay={formatAndPlay} getMusicInfo={getMusicInfo} setInfoMusicList={setInfoMusicList} testPerformances={false} />
            </div>
          </div>
        }
      </div> */}


// ---- From MyTabbedInterface
{/* <ul> {trackData[activeTrack].map((sample) => ( <li key={sample} className="mb-2"> {sample} </li> ))} </ul> */ }

{/* {(!visibleTracks[activeTrack]) &&  <AiOutlineLoading className="spin"/> } */ }
{/* TODO beforePrivateBeta Adapt content of TrackRes...  */ }
{/* {visibleTracks[activeTrack] && ( */ } {/* )} */ }

{/* Zone for recordings. */ }
{/* <div className='metadataRecording border p-[0.25rem]'>
              <div>Recording content and interaction</div> {infoMusicList.length === 0 ? (<AiOutlineLoading className='spin' size={'20px'} />) :
                findMatchRecording(activeRecording) !== -1 ? ( <div className='detailResultMeta'> <u>Info about recording:</u> {Object.entries(infoMusicList[findMatchRecording(activeRecording)]).map(([key, value]) => ( <p key={key}> {key}: {value} </p> ))} </div> )
                  : (<><div className='text-left'>No metadata about the recording</div><br /></>) }
              <AnnotationSystem type={"recording"} info={activeRecording} /> <EmbeddedWorkflowInteraction idCaller={listSearchRes[0].arrIdNotes[0]} typeCaller={"recording"} />
            </div> */}

{/* Zone for tracks... or directly samples? */ }
{/* <div className='border p-[0.25rem]'>
              <div>Track content and interaction</div> <div className='iconTracksInteractions'> <AnnotationSystem type={"track"} info={activeTrack} /> <EmbeddedWorkflowInteraction idCaller={listSearchRes[0].arrIdNotes[0]} typeCaller={"track"} /> </div>
            </div> */}


// ---- from MyTabbedInterface
// useEffect(() => {
//   console.log("||| useEffect >>> MyTabbedInterface. useEffect - listLogNumbers: ",listLogNumbers,", infoMusicList: ",infoMusicList, ", listSearchRes: ",listSearchRes);
//   // We will need a new structure!
//   // -> Merge by event name if the lognumber has SJA?
//   // -> Problem: lognumber is unique for same event if different time. We should not fix this. It is how the data is set... and that's it.
//   // Or: the display of the recording displays the event and year, as based per lognumber. Still sounds confusing for the workflow.
//   const mergedData = {};
//   infoMusicList.forEach((item) => {
//     const eventName = item["(E) Event Name"]; const trackNumber = item["Track #"]; const lognumber = item["lognumber"];
//     if (eventName) {
//       if (!mergedData[eventName]) { mergedData[eventName] = { tracks: [] }; }
//       if (!mergedData[eventName].tracks[trackNumber]) { mergedData[eventName].tracks[trackNumber] = []; }
//       mergedData[eventName].tracks[trackNumber].push(item);
//     } else if (lognumber) {
//       if (!mergedData[lognumber]) { mergedData[lognumber] = { tracks: [] }; }
//       // Calculate the trackNumber based on the number of existing tracks
//       const nextTrackNumber = mergedData[lognumber].tracks.length;
//       if (!mergedData[lognumber].tracks[nextTrackNumber]) { mergedData[lognumber].tracks[nextTrackNumber] = []; }
//       mergedData[lognumber].tracks[nextTrackNumber].push(item);
//     }
//   });
//   const result = Object.values(mergedData);
//   console.log("result: ", result);
//   let keysEvents = Object.keys(mergedData);
//   for (var d in mergedData) {
//     const tracks = mergedData[d].tracks.filter( (a) => typeof a !== "undefined" );
//     // Use concat to flatten the second level arrays
//     const flattenedTracks = [].concat(...tracks);
//     tracksForEvent.push(flattenedTracks);
//   }
//   keysEvents.map((a, i) => newStruct.push({ recordingName: a, content: tracksForEvent[i] }) );
//   // Sort newStruct (here according to recording)
//   newStruct = newStruct.sort((a, b) => a.recording > b.recording ? 1 : b.recording > a.recording ? -1 : 0 );
//   console.log("newStruct: ", newStruct, ", listTracks: ", listTracks);
//   // infoMusicList = new Set(infoMusicList.map(a => a.lognumber))
//   console.log("unique lognumber from infoMusicList: ", new Set(infoMusicList.map(a => a.lognumber)));
//   listLogNumbers.forEach(lognumber => {
//     infoMusicList.map( a=> 
//       (a.lognumber === lognumber &&  !lognumber.includes("BGR") )?
//       prettyNamesLogNumber[lognumber]=(a["(E) Event Name"]+' '+a["Event Year"]+'/'+a["Event Month"]+'/'+a["Event Day"])
//       :prettyNamesLogNumber[lognumber]=lognumber);
//   })
//   let uniqueListLogNumbers = [...new Set(listLogNumbers)];
//   console.log("|| uniqueListLogNumbers: ",uniqueListLogNumbers,", prettyNamesLogNumber: ",prettyNamesLogNumber);
// });            

// useEffect(() => {
//   console.log(
//     "||| useEffect >>> MyTabbedInterface. useEffect - listLogNumbers: ",listLogNumbers,
//     ", infoMusicList: ",infoMusicList, // empty?!
//     ", listSearchRes: ",listSearchRes
//   );
//   // We will need a new structure!
//   // -> Merge by event name if the lognumber has SJA?
//   // -> Problem: lognumber is unique for same event if different time. We should not fix this. It is how the data is set... and that's it.
//   // Or: the display of the recording displays the event and year, as based per lognumber. Still sounds confusing for the workflow.

//   const mergedData = {};
//   infoMusicList.forEach((item) => {
//     const eventName = item["(E) Event Name"];
//     const trackNumber = item["Track #"];
//     const lognumber = item["lognumber"];
//     if (eventName) {
//       if (!mergedData[eventName]) { mergedData[eventName] = { tracks: [] }; }
//       if (!mergedData[eventName].tracks[trackNumber]) { mergedData[eventName].tracks[trackNumber] = []; }
//       mergedData[eventName].tracks[trackNumber].push(item);
//     } else if (lognumber) {
//       if (!mergedData[lognumber]) { mergedData[lognumber] = { tracks: [] }; }
//       // Calculate the trackNumber based on the number of existing tracks
//       const nextTrackNumber = mergedData[lognumber].tracks.length;
//       if (!mergedData[lognumber].tracks[nextTrackNumber]) { mergedData[lognumber].tracks[nextTrackNumber] = []; }
//       mergedData[lognumber].tracks[nextTrackNumber].push(item);
//     }
//   });
//   const result = Object.values(mergedData);
//   console.log("result: ", result);

//   let keysEvents = Object.keys(mergedData);
//   for (var d in mergedData) {
//     const tracks = mergedData[d].tracks.filter(
//       (a) => typeof a !== "undefined"
//     );
//     // Use concat to flatten the second level arrays
//     const flattenedTracks = [].concat(...tracks);
//     tracksForEvent.push(flattenedTracks);
//   }
//   keysEvents.map((a, i) =>
//     newStruct.push({ recordingName: a, content: tracksForEvent[i] })
//   );
//   // Sort newStruct (here according to recording)
//   newStruct = newStruct.sort((a, b) =>
//     a.recording > b.recording ? 1 : b.recording > a.recording ? -1 : 0
//   );
//   console.log("newStruct: ", newStruct, ", listTracks: ", listTracks);

//   // infoMusicList = new Set(infoMusicList.map(a => a.lognumber))
//   console.log("unique lognumber from infoMusicList: ", new Set(infoMusicList.map(a => a.lognumber)));

//   listLogNumbers.forEach(lognumber => {
//     infoMusicList.map( a=> 
//       (a.lognumber === lognumber &&  !lognumber.includes("BGR") )?
//       prettyNamesLogNumber[lognumber]=(a["(E) Event Name"]+' '+a["Event Year"]+'/'+a["Event Month"]+'/'+a["Event Day"])
//       :prettyNamesLogNumber[lognumber]=lognumber);
//   })
//   let uniqueListLogNumbers = [...new Set(listLogNumbers)];
//   console.log("|| uniqueListLogNumbers: ",uniqueListLogNumbers,", prettyNamesLogNumber: ",prettyNamesLogNumber);
// });  

//
{/* {tracksForEvent && activeRecording &&
            newStruct.findIndex((a) => a.recordingName === activeRecording) !== -1 && newStruct[ newStruct.findIndex((a) => a.recordingName === activeRecording) ].content &&
            newStruct[ newStruct.findIndex((a) => a.recordingName === activeRecording) ].content.length > 0 &&
            newStruct[ newStruct.findIndex((a) => a.recordingName === activeRecording) ].content.map((c, i) =>
              typeof c["(E) Event Name"] === "undefined" ? (
                <li
                  // TODO CRITICAL: WRONG SELECTION OF TRACK!!!
                  key={c + "" + i}
                  className={`text-sm cursor-pointer mb-2 ${
                    activeTrack === c.lognumber + "-T" + i ? "text-orange-500" : ""
                  }`}
                  onClick={() => handleTrackClick(c.lognumber + "-T" + i)}
                >
                  Unnamed Track, for {activeRecording}
                </li>
              ) : (
                <li
                  key={c["Track Title"]}
                  className={`text-sm cursor-pointer mb-2 ${
                    activeRecording === c["Track Title"]
                      ? "text-orange-500"
                      : ""
                  }`}
                  onClick={() => handleTrackClick(c["Track Title"])}
                >
                  {c["Track Title"]}
                  <hr />
                </li>
              )
            )} */}

//
// &&
//   filteredUniqueSearchResTracks.map(a =>
//     a.includes('SJA') ?
//       <li
//         key={a}
//         className={`cursor-pointer mb-2 ${activeTrack === a ? "text-orange-500" : ""}`}
//         onClick={() => handleTrackClick(a)} > {trackToTitles[a]}
//       </li>
//       : <li
//         key={a}
//         className={`cursor-pointer mb-2 ${activeTrack === a ? "text-orange-500" : ""}`}
//         onClick={() => handleTrackClick(a)} > {a}
//       </li>
//   )


// ----- Previously in GraphsResults.js
// const GraphsResults = ({ infoMusicList, oldSearch, listSearchRes }) => {
//   console.log( "GraphsResults - infoMusicList: ", infoMusicList, ", oldSearch: ", oldSearch, ", listSearchRes: ", listSearchRes );
//   // TODO change later on, we will want to consider the melodies and outputs of melodies as well.
//   const dataInput = infoMusicList;
//   ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);
//   const axisOptions = [ "Release Year", "Release Month", "Track Title", "Recording", "Artists" ];
//   // Set a "" for month 0... (might be better to offset value by 1 if selection is month...)
//   const months = [
//     "",
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];
//   const options = { scales: { x: { beginAtZero: false }, y: { beginAtZero: false } }, };
//   const [typeGraph, setTypeGraph] = useState("scatter");
//   const [selectedAxisX, setSelectedAxisX] = useState("Release Year");
//   const [selectedAxisY, setSelectedAxisY] = useState("Release Month");
//   const handleChangeAxisX = (axis) => { setSelectedAxisX(axis); };
//   const handleChangeAxisY = (axis) => { setSelectedAxisY(axis); };
//   // const uniqueValues = (key) => {
//   //   return [...new Set(dataInput.map((item) => item[key]))];
//   // };
//   // const categoricalToNumeric = (key) => {
//   //   const categories = uniqueValues(key);
//   //   const numericValues = {};
//   //   categories.forEach((category, index) => {
//   //     numericValues[category] = index;
//   //   });
//   //   return numericValues;
//   // };
//   // const chartData = {
//   //   datasets: [
//   //     {
//   //       label: "Dot Chart",
//   //       data: dataInput.map((item) => ({
//   //         x: item[selectedAxisX],
//   //         y: item[selectedAxisY],
//   //       })),
//   //       backgroundColor: "rgba(75,192,192,1)",
//   //       pointRadius: 6,
//   //     },
//   //   ],
//   // };
//   const dataChart = useRef(
//     {
//     datasets: [
//       {
//         label: `${selectedAxisX} and ${selectedAxisY}`,
//         data: dataInput
//           .map((item, i) =>
//             selectedAxisX !== "Release Year" ||
//             ((selectedAxisX === "Release Year" ||
//               selectedAxisX === "Release Month") &&
//               Number(item[selectedAxisX]) !== 0) ||
//             ((selectedAxisY === "Release Year" ||
//               selectedAxisY === "Release Month") &&
//               Number(item[selectedAxisX]) !== 0)
//               ? {
//                   x: Number(item[selectedAxisX]),
//                   y: Number(item[selectedAxisY]),
//                 }
//               : null
//           )
//           .filter((a) => a)
//           .filter((a) => !isNaN(a.x) && !isNaN(a.y)),
//         backgroundColor: "rgb(255, 99, 132)",
//       },
//     ],
//   }
//   );
//   useEffect(() => {
//     // Update using setTypeGraph based on selectedAxisX and selectedAxisY
//     // TODO update properly
//     (selectedAxisX==="Release Year"||selectedAxisX==="Release Month"||selectedAxisY==="Release Year"||selectedAxisY==="Release Month")
//     ?setTypeGraph("scatter")
//     :setTypeGraph("bar");
//     // Update the dataChart.current when selectedAxisX or selectedAxisY changes
//     dataChart.current =
//       typeGraph === "scatter"
//         ? {
//             datasets: [
//               {
//                 label: `${selectedAxisX} and ${selectedAxisY}`,
//                 data: dataInput
//                   .map((item) =>
//                     selectedAxisX === "Release Year" ||
//                     selectedAxisX === "Release Month" ||
//                     ((selectedAxisX === "Release Year" ||
//                       selectedAxisX === "Release Month") &&
//                       Number(item[selectedAxisX]) !== 0) ||
//                     ((selectedAxisY === "Release Year" ||
//                       selectedAxisY === "Release Month") &&
//                       Number(item[selectedAxisX]) !== 0)
//                       ? {
//                           x: Number(item[selectedAxisX]),
//                           y: Number(item[selectedAxisY]),
//                         }
//                       : null
//                   )
//                   .filter((a) => a)
//                   .filter((a) => !isNaN(a.x) && !isNaN(a.y)),
//                 backgroundColor: "rgb(255, 99, 132)",
//               },
//             ],
//           }
//         : {
//             datasets: [
//               {
//                 label: `${selectedAxisX} and ${selectedAxisY}`,
//                 data: [],
//                 backgroundColor: "rgb(255, 99, 132)",
//               },
//             ],
//           };
//   }, [selectedAxisX, selectedAxisY, dataInput, typeGraph]);
//   return (
//     <div>
//     <h1 className="text-black">Attribute selection</h1>
//       <p>The graph will adapt based on your selection.</p>
//       <div>
//         <label>Axis X </label>
//         <select
//           onChange={(e) => handleChangeAxisX(e.target.value)}
//           value={selectedAxisX}
//         >
//           {axisOptions.map((option) => (
//             <option key={option} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div>
//         <label>Axis Y </label>
//         <select
//           onChange={(e) => handleChangeAxisY(e.target.value)}
//           value={selectedAxisY}
//         >
//           {axisOptions.map((option) => (
//             <option key={option} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* TODO consider adaptation of graph based on type of data input...? */}
//       {/* {typeGraph === "scatter" ? (
//         <Scatter options={options} data={dataChart.current} />
//       ) : (
//         <>
//           {typeGraph === "bar" ? (
//             <>Work in progress for {typeGraph}</>
//           ) : (
//             <>Work in progress, unexpected type asked</>
//           )}
//         </>
//       )} */}
      
//     </div>
//   );
// };

// const xyValues = [ {x:50, y:7}, {x:60, y:8}, {x:70, y:8}, {x:80, y:9}, {x:90, y:9}, {x:100, y:9}, {x:110, y:10}, ];
// const scatterPlot = new chartjs.Chart("myChart", { type: "scatter", data: { datasets: [{ pointRadius: 4, pointBackgroundColor: "rgba(0,0,255,1)", data: xyValues }] }, options:{} });
// return (<>GraphsResults has { infoMusicList? infoMusicList.length : 0 } elements to work with.</>)
