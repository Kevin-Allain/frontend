import React, { useRef, useState, useEffect, useContext, useMemo, useCallback  } from 'react';
import * as Tone from "tone"
import {
  getMusicMIDI,
  getSampleMIDI,
  getMatchLevenshteinDistance,
  getTrackMetadata,
  getTracksMetadata,
  addAnnotation,
  getAnnotations,
  deleteAnnotation,
  updateAnnotation
} from "../../utils/HandleApi";
import SampleRes from "./SampleRes"
import MusicInfo from "./MusicInfo"
import ResultsComponent from './ResultsComponent';
import Piano from "./Piano"
import NotetoMIDI from "./NotetoMIDI.json"
import MIDItoNote from "./MIDItoNote.json"
import Annotation from '../Annotation/Annotation';
import AnnotationSystem from '../Annotation/AnnotationSystem';
import { AiFillPlayCircle, AiFillPauseCircle, AiOutlineArrowRight, AiOutlineLoading } from 'react-icons/ai'
import {BsFillInfoCircleFill} from 'react-icons/bs'
import {ImCross} from 'react-icons/im'
import {
  MdKeyboardDoubleArrowUp, MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight
} from 'react-icons/md'
import { ImLoop2 } from 'react-icons/im'
import { BiDotsHorizontalRounded, BiWrench } from 'react-icons/bi'
import { BsInfoCircleFill } from 'react-icons/bs'
import TrackRes from './TrackRes';
import PianoRoll from '../VisComponents/PianoRoll';
import Title from '../Presentation/Title';
import EmbeddedWorkflowInteraction from '../Workflow/EmbeddedWorkflowInteraction'

// beforePrivateBeta
/** Potentially useful, but messes up the bits of code provided by the designers. 
 * Need to see if it is possible to use this and limit the scope of the... influence of the import. 
 * Otherwise, we can consider how to get a similar display without using React Bootstrap... It is not a design that complex.*/
// ---- React Bootstrap imports
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Col from 'react-bootstrap/Col';
// import ListGroup from 'react-bootstrap/ListGroup';
// import Row from 'react-bootstrap/Row';
// import Tab from 'react-bootstrap/Tab';
import MyTabbedInterface from './MyTabbedInterface'

const PITCH_QUERY_REGEX = /^$|(^(?!.*--)(?!-)([0-9]{1,2}|1[01][0-9]|12[0-7])(-([0-9]{1,2}|1[01][0-9]|12[0-7]))*(-?)$)/;
// Test attributes
const notes = [60, 61, 62, 63, 64, 65, 66, 59, 67, 68, 69, 55, 77, 89, 90, 82];
const occurrences = [5, 6, 6.5, 7, 8, 8, 9, 10, 10.5, 11.5, 11.5, 12, 13, 13, 14, 15.25];
const durations = [0.5, 1, 1, 1, 2, 3, 1, 1, 4, 5, 2, 1, 1, 1, 0.5, 1.82];

  const sampler = new Tone.Sampler({
  	urls: { "C4": "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", "A4": "A4.mp3", },
  	release: 1,
  	baseUrl: "https://tonejs.github.io/audio/salamander/",
  }).toDestination();

const MusicInterface = () => {

  // TODO consider whether useref would make more sense? We don't intend to change it according to render... // const [synth2, setSynth2] =  useState(new Tone.Synth());
  // TODO we might create a component for the synth...
  const synth2 = useRef(new Tone.Synth());
  synth2.current.oscillator.type = "sine";
  synth2.current.toDestination();

  const [playingMp3, setPlayingMp3] = useState(false);
  const [iconPlayMp3, setIconPlayMp3] = useState(<AiFillPlayCircle className='icon'></AiFillPlayCircle>)
  const [audioMp3, setAudioMp3] = useState(new Audio("https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"))


  const [notesTranslate, setNotesTranslate] = useState('');
  const [showNotesTranslate, setShowNotesTranslate] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const textSearchRef = useRef('');
  const [validPitchQuery, setValidPitchQuery] = useState(false);
  const [oldSearch, setOldSearch] = useState('');

  const [infoMusicList, setInfoMusicList] = useState([]);
  const [listTracks, setListTracks] = useState([]);
  const [listSearchRes, setListSearchRes] = useState([]);
  const [listLogNumbers, setListLogNumbers] = useState([]);

  const [showExplanation, setShowExplanation] = useState(false);

  // References for scrolling
  const lognumbersRefs = useRef([]);
  const buttonListLogsNumbersRef = useRef(null);
  const tracksRefs = useRef([]);

  const scrollToButtonListLogsNumbers = () => {
    const buttonListLogsNumbers = document.getElementById('buttonListLogsNumbers');
    if (buttonListLogsNumbers) { buttonListLogsNumbers.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start', }); }
  };

  const scrollToButtonListTracksFollowing = (e, indexButton, track, direction='next') => {
    const prevTrack = listTracks[Math.max( 0, indexButton-1)];
    const nextTrack = listTracks[Math.min( listTracks.length, indexButton+1)];
    const buttonTrack = (direction==='next')?document.getElementById(nextTrack) : document.getElementById(prevTrack);
    if (buttonTrack) { 
      // Temporarily set 'overflow' to 'visible' on .musicInterface to allow the scrolling
      const outputMusicSearch = document.querySelector('.outputMusicSearch');
      const originalOverflow = outputMusicSearch.style.overflow;
      outputMusicSearch.style.overflow = 'visible';

      // Calculate the offset of the buttonTrack relative to the .musicInterface div
      const outputMusicSearchRect = outputMusicSearch.getBoundingClientRect();
      const buttonTrackRect = buttonTrack.getBoundingClientRect();
      const relativeOffset = buttonTrackRect.top - outputMusicSearchRect.top;

      // Calculate the desired scrollTop to ensure the element is visible in the .musicInterface div
      const scrollTop = outputMusicSearch.scrollTop + relativeOffset;

      // Perform the scroll on .outputMusicSearch
      outputMusicSearch.scrollTo({ top: scrollTop, behavior: 'smooth', });

      // Reset 'overflow' back to its original value after the scrolling
      outputMusicSearch.style.overflow = originalOverflow;
      buttonTrack.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start', });       
    }
  }
  const scrollToButtonListRecordingsFollowing = (e, recording, direction='next') => {
    // console.log("scrollToButtonListRecordingsFollowing | e: ",e,", recording: ", recording,", direction: ",direction);
    const curIndex = listLogNumbers.indexOf(recording);
    const prevSelecIndex = Math.max( 0, curIndex-1);
    const nextSelecIndex = Math.min( listLogNumbers.length, curIndex+1);
    const selecIndex = (direction==='next')?nextSelecIndex:prevSelecIndex;
    // console.log("selecIndex: ",selecIndex," | lognumbersRefs: ",lognumbersRefs);
    
      // Temporarily set 'overflow' to 'visible' on .musicInterface to allow the scrolling
      const outputMusicSearch = document.querySelector('.outputMusicSearch');
      const originalOverflow = outputMusicSearch.style.overflow;
      outputMusicSearch.style.overflow = 'visible';

      // Calculate the offset of the buttonTrack relative to the .musicInterface div
      const outputMusicSearchRect = outputMusicSearch.getBoundingClientRect();
      const buttonTrackRect = lognumbersRefs.current[curIndex].getBoundingClientRect();
      const relativeOffset = buttonTrackRect.top - outputMusicSearchRect.top;

      // Calculate the desired scrollTop to ensure the element is visible in the .musicInterface div
      const scrollTop = outputMusicSearch.scrollTop + relativeOffset;

      // Perform the scroll on .outputMusicSearch
      outputMusicSearch.scrollTo({ top: scrollTop, behavior: 'smooth', });

      // Reset 'overflow' back to its original value after the scrolling
      outputMusicSearch.style.overflow = originalOverflow;
    lognumbersRefs.current[selecIndex].scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }
  const handleScrollToRecording = (index) => { lognumbersRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }
  const handleScrollToTrack = (index) => { tracksRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); }

  // ---- React functions
  useEffect(() => {
    setValidPitchQuery(PITCH_QUERY_REGEX.test(textSearch))
    console.log("useEffect textSearch, validPitchQuery: ", validPitchQuery,", textSearch: ",textSearch,", typeof textSearch", typeof textSearch,", length>0: ",(''+textSearch).length>0,", -?: ",(''+textSearch).indexOf('-')===-1);
    console.log("showNotesTranslate: ",showNotesTranslate,", notesTranslate: ",notesTranslate);
    setNotesTranslate(  ((''+textSearch).indexOf('-')===-1)
      ? (''+MIDItoNote[''+textSearch]).replaceAll('s','')
      : (''+textSearch).split('-').map((a,i) => (i===(''+textSearch).split('-').length-1)? 
        MIDItoNote[a].replaceAll('s','')
        : (MIDItoNote[a]+'-').replaceAll('s','')
      ));
    setShowNotesTranslate((''+textSearch).length>0);
  }, [textSearch, validPitchQuery])

  useEffect(() => {
    // new approach: sorting based on alphabet
    const sorted = listLogNumbers.sort();
    setListLogNumbers(sorted);

    lognumbersRefs.current = 
      lognumbersRefs.current.slice(0, listLogNumbers.length).map(
        (ref, index) => ref || React.createRef()
      );
  }, [listLogNumbers]);

  useEffect(() => {
    // new approach: sorting based on alphabet
    const sorted = listTracks.sort();
    setListTracks(sorted);
    tracksRefs.current = 
    tracksRefs.current.slice(0, listTracks.length).map(
        (ref, index) => ref || React.createRef()
      );
  }, [listTracks]);

  const findMatchRecording = (lln) => {
    const matchIndex = infoMusicList.findIndex(item => item.lognumber === lln);
    return matchIndex;
  }
  
  // ---- Functions handle
  // const handleChangeQueryPitch = (event) => {
  //   const value = event.target.value;
  //   if (PITCH_QUERY_REGEX.test(value) || value[value.length - 1] === '-') { setTextSearch(value) }
  // }
  const handleChangeQueryPitch = useCallback((event) => {
    const value = event.target.value;
    if (PITCH_QUERY_REGEX.test(value) || value[value.length - 1] === '-') { 
      setTextSearch(value); 
    }
  }, [setTextSearch]);

  // const handleClickTextSearch = async (e) => {
  //   e.preventDefault();
  //   // make a call to the database, then set string back to ''
  //   if (textSearch !== '') { findMatchLevenshteinDistance(textSearch); }
  // };
  const handleClickTextSearch = useCallback(async (e) => {
    e.preventDefault();
    console.log("", textSearch, ", (typeof textSearch): ", (typeof textSearch));
    if (textSearch !== '') { findMatchLevenshteinDistance(textSearch); }
  }, [textSearch, findMatchLevenshteinDistance]);
  

  // ######## TEST FOR PERFORMANCES ########
  const handleClickTextSearchTEST = async(e) => {
    console.log("We do nothing. T: ",new Date());
    setTextSearch('');
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

  function playToneSalamander() {
    const now = Tone.now();
    // Tone.loaded().then(() => {
    //   // sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 4);
    //   sampler.triggerAttackRelease(["Eb4"], 1,now);
    //   // sampler.triggerAttackRelease(["Bb4"], 4);
    //   // sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 4);
    //   sampler.triggerAttackRelease(["F6"], 1, now+1);
    // })
    Tone.loaded().then(() => {
      for(var i = 0; i < 3; i++){
          sampler.triggerAttackRelease([`E${i+4}`,`F${i+4}`, `C${i+4}`,`G${i+4}`, `B${i+4}`,`A${i+4}`, `A#${i+4}`], 1,now+i);
        }
    })
  }
  
  function resetMp3() {
    if (playingMp3) {
      audioMp3.pause();
      setIconPlayMp3(<AiFillPlayCircle></AiFillPlayCircle>)
      setPlayingMp3(!playingMp3);
    }
    setAudioMp3(new Audio("https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"));
  }
  // #######

  function handleKeyPress(keyName) {
    setTextSearch((prevText) => (prevText === '') ? NotetoMIDI[keyName] : prevText + '-' + NotetoMIDI[keyName]);
    textSearchRef.current.value += NotetoMIDI[keyName];
  }

  // // Memoize the value of textSearch
  // const memoizedTextSearch = useMemo(() => textSearch, [textSearch]);


  // ---- Functions
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

  // We keep the consideration that it makes sense to do: Math.pow(2, (76 - 69) / 12) * 440
  // Note: To shift by an octave you just have to add 12. // Apparenlty supposed to use that: Math.pow(2, (m-69)/12)*440, with m being the pitch
  // We set time to the value of the onset property of the input item, note to the value of the pitch property, and duration to the value of the duration property multiplied by 16 to convert from seconds to sixteenth notes (you can adjust this factor as needed depending on your use case).
  function transformToPlayfulFormat(d) {
    const outputArray = d.map(item => ({
      time: item.onset,
      note: Math.pow(2, (item.pitch - 69) / 12) * 440,
      duration: item.duration * 16 // Assuming duration is in seconds and you want it in sixteenth notes
    }));
    return outputArray;
  }

  function playFormattedMusic(music) {
    // TODO fix the issue with sound getting a lot of distortion and then stopping!
    // ---- Logics for potential fixes:
    // - Track times of input, manually set timers before next song can be played and then played one by one
    // - Modify the notes times to ensure they have enough time to be played (avoid several notes at the same time with a single synth player?)

    synth2.current.dispose(); // this may be something good, but really unsure!
    synth2.current = new Tone.Synth();
    synth2.current.toDestination();

    console.log("-1- Tone.Transport.state |", Tone.Transport.state, '|, Tone.Transport.state !== "started" ', (Tone.Transport.state !== "started"), ", typeof (Tone.Transport.state): ", (typeof Tone.Transport.state));
    // const now = Tone.now(); // const synth3 = new Tone.MembraneSynth().toDestination();
    // for (var i in Tone.Transport.state) { console.log(i, ": ", Tone.Transport.state[i]); }
    Tone.Transport.stop();
    if (Tone.Transport.state !== "started") {
      Tone.Transport.start();
      console.log("Tone.Transport.start / How is the test now: ", Tone.Transport.state !== "started");
    } else {
      Tone.Transport.stop();
      console.log("Tone.Transport.stop / How is the test now: ", Tone.Transport.state !== "started");
    }
    // else { Tone.Transport.stop(); console.log("Tone.Transport.stop");  }
    // if (Tone.context.state !== "running") {  Tone.start();  console.log("audio is ready");  }
    console.log("-2- Tone.Transport.state ", Tone.Transport.state, ', Tone.Transport.state !== "started" ', (Tone.Transport.state !== "started"));  // Tone.Transport.bpm.value = 180; // Not necessary, but good to have... // normal bpm is slower

    const offsetTest = 0.1;

    const now = Tone.now() + offsetTest;
    music.forEach(tune => {
      // console.log("now: ", now, ", tune.time: ", tune.time, ", sum: ", (now + tune.time),", tune.note: ", tune.note,", MIDItoNote[tune.note]: ",MIDItoNote[tune.note]);
      // synth3.triggerAttackRelease(tune.note, tune.duration, now + tune.time)
      // synthPoly.triggerAttackRelease(tune.note, tune.duration, now + tune.time)
      // synth2.triggerAttackRelease(tune.note, tune.duration, now + tune.time)
      synth2.current.triggerAttackRelease(MIDItoNote[tune.note], tune.duration, now + tune.time)
    })

    // Tone.Transport.dispose();
    // Tone.Transport.cancel();
    // Tone.Transport.clear();

    Tone.Transport.stop();
    // synth2.current.dispose(now + music[music.length-1].time +  music[music.length-1].duration)

    // console.log("Asking to stop after time: ", (music[music.length-1].duration + music[music.length-1].time))
    // Tone.Transport.stop(music[music.length-1].duration + music[music.length-1].time);
    console.log("-3- Tone.Transport.state ", Tone.Transport.state, ', Tone.Transport.state !== "started" ', (Tone.Transport.state !== "started"));
  }

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

  function getMusicInfo(track, infoMusicList, setInfoMusicList = null) {
    console.log("getMusicInfo -- infoMusicList: ",infoMusicList);
    const lognumber = track.split("-")[0];
    getTrackMetadata(lognumber, infoMusicList, setInfoMusicList);
  }

  function findMatchLevenshteinDistance(strNotes = "69-76-76-74-76") {
    console.log("---- findMatchLevenshteinDistance.")
    setInfoMusicList([]);
    setOldSearch(strNotes);
    setTextSearch('');    
    getMatchLevenshteinDistance(
      strNotes,
      1,
      localStorage?.username,
      transformToPlayfulFormat,
      playFormattedMusic,
      calcLevenshteinDistance_int,
      setListSearchRes,
      setListLogNumbers,
      setListTracks,
      // Additions for loading of metadata after the loading of tracks
      getTracksMetadata,
      infoMusicList, 
      setInfoMusicList
    )
  }

  return (
    <div className="musicInterface">
      <BsFillInfoCircleFill className='icon infoMusicInterface w-[2rem] h-[2rem]' onClick={() => setShowExplanation(!showExplanation)} />
      {showExplanation && (
        <div className='explanation'>
          <ImCross className='icon' onClick={() => setShowExplanation(!showExplanation)} />
          <h1 className='title'>How to Use the Music Interface</h1>
          <div className='detailsExplanation'>
            <p>
              The Music Interface is designed to search for samples that match the melodies you enter in our system.
              To do so, simply click on the piano keys for the notes you wish and submit your search.
            </p>
            <p>
              The results will be displayed in a structured format indicating where the matching samples were found.
              The system will provide information about the sample and allow you to play it.
            </p>
            <p>
              You can also read the annotations made by other users and their associated comments.
            </p>
            <p>
              More functionalities are available if you register an account and log in. These functionalities include:
            </p>
            <ul className='functionality-list'>
              <li>Writing annotations and comments.</li>
              <li>
                Creating workflows, which are structures similar to notebooks where you can save elements of interest
                and note your thoughts. Workflows can be found in the workflow manager.
              </li>
            </ul>
            <p className='development-info'>
              More functionalities are in development. <BiWrench />
            </p>
          </div>
        </div>
      )}
      <Title firstLine="Music" secondLine="Interface" />
      {/* ==== Test diffeent presentation of results ==== */}
      {/* <MyTabbedInterface/> */}
      {/* ==== Test Mp3 playing ==== */}
      {/* <div className="playMusic" onClick={(c) => { playMp3(); }} > Play Test Mp3 </div>
      <div className='playMusic' onClick={(c)=>{playToneSalamander();}}> Play from tone loaded </div> */}
      {/* ==== Test Piano Roll === */}
        {/* <div className='pianoArea'>
          <h1>Piano Roll</h1>
          <PianoRoll notes={notes} occurrences={occurrences} durations={durations} width={600} height={200} />
        </div> */}
      {/* ==== PIANO INPUT ==== */}
      <Piano onKeyPress={handleKeyPress} />
      {/* ==== SEARCH INPUT ==== */}
      <div className="topTextSearch">
        <div className='disclaimerSearchPitch'>Play the piano keys or enter a query based on pitch notes (from 0 to 127) separated with - characters.</div>
        <input
          type="text"
          className='inputMusicSearch'
          placeholder="Enter melody here"
          ref={textSearchRef}
          autoComplete="off"
          required
          value={textSearch}
          onChange={handleChangeQueryPitch}
        />
        <button className='mx-[0.5rem] my-[0.25rem]' onClick={handleClickTextSearch}>Submit search</button>
        {/* <button onClick={handleClickTextSearchTEST}>Submit search</button> */}
        { (''+textSearch).length>0 &&  <div className="bg-slate-200 text-center mx-64 opacity-75 max-w-80%">Notes: ({notesTranslate})</div> }
      </div>

      {/* ==== OUTPUT SEARCH ==== */}
      {/* Approach with MyTabbedInterface */}
      {(listSearchRes.length <= 0) ? (<></>) :
        <div className='outputMusicSearch'>
          {/* beforePrivateBeta -> Display BOTH pitches and notes */}
          <p className='text-xl'>List of results for your search:</p><h4>{oldSearch} ({(('' + oldSearch).indexOf('-') === -1)
            ? ('' + MIDItoNote['' + oldSearch]).replaceAll('s', '')
            : ('' + oldSearch).split('-').map((a, i) => (i === ('' + oldSearch).split('-').length - 1) ?
              MIDItoNote[a].replaceAll('s', '')
              : (MIDItoNote[a] + '-').replaceAll('s', '')
            )})</h4>
          {/* beforePrivateBeta adapt the text and its style */}
          <div className='text-left'>
            <AnnotationSystem type={"search"} info={oldSearch} />
            {/* TODO beforePrivateBeta update the workflow system so that it can save searches!!! */}
            {/* <EmbeddedWorkflowInteraction idCaller={null} typeCaller={"search"} /> */}
          </div>
        <MyTabbedInterface
          listLogNumbers={listLogNumbers}
          lognumbersRefs={lognumbersRefs}
          scrollToButtonListLogsNumbers={scrollToButtonListLogsNumbers}
          findMatchRecording={findMatchRecording}
          infoMusicList={infoMusicList}
          listTracks={listTracks}
          scrollToButtonListRecordingsFollowing={scrollToButtonListRecordingsFollowing}
          scrollToButtonListTracksFollowing={scrollToButtonListTracksFollowing}
          listSearchRes={listSearchRes}
          formatAndPlay={formatAndPlay}
          getMusicInfo={getMusicInfo}
          setInfoMusicList={setInfoMusicList}
          testPerformances={false}
        />
        </div>
        }

    </div>
  );
}


export default MusicInterface;