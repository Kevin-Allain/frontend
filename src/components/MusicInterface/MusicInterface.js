import React, { useRef, useState, useEffect, useContext, useMemo, useCallback  } from 'react';
import * as Tone from "tone"
import {
  getMusicMIDI,
  getSampleMIDI,
  getMatchLevenshteinDistance,
  getTrackMetadata,
  addAnnotation,
  getAnnotations,
  deleteAnnotation,
  updateAnnotation,
  getListFuzzyScores,
  getAllFuzzyScores,
  getListFuzzyDist,
  getFuzzyLevenshtein
} from "../../utils/HandleApi";
import ToggleSwitch from "../Button/ToggleSwitch";
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

import MyTabbedInterface from './MyTabbedInterface'
import GraphsResults from '../VisComponents/GraphsResults';
import AutoComplete from './AutoComplete';

// For the filters
import artistNames from "./artists_names.json"
import recordings from "./recordings.json"
import trackTitles from "./tracks_titles.json"

// Trying to have better performances
const MemoizedGraphsResults = React.memo(GraphsResults);

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
  console.log("~~~~ MusicInterface");
  const synth2 = useRef(new Tone.Synth());
  synth2.current.oscillator.type = "sine";
  synth2.current.toDestination();

  const [playingMp3, setPlayingMp3] = useState(false);
  const [iconPlayMp3, setIconPlayMp3] = useState( <AiFillPlayCircle className="icon"></AiFillPlayCircle> );
  // const [audioMp3, setAudioMp3] = useState( new Audio( "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3" ) );

  const [notesTranslate, setNotesTranslate] = useState("");
  const [showNotesTranslate, setShowNotesTranslate] = useState(false);
  const [textSearch, setTextSearch] = useState("");
  const textSearchRef = useRef("");
  const [validPitchQuery, setValidPitchQuery] = useState(false);
  const [oldSearch, setOldSearch] = useState("");

  const [infoMusicList, setInfoMusicList] = useState([]);
  const [listTracks, setListTracks] = useState([]);
  const [listLogNumbers, setListLogNumbers] = useState([]);
  const [listSearchRes, setListSearchRes] = useState([]);

  const [showExplanation, setShowExplanation] = useState(false);
  const [percMatch, setPercMatch] = useState(1);
  const [searchFilterArtist, setSearchFilterArtist] = useState('artistName');
  const textFilterArtistRef = useRef('');
  const textFilterTrackRef = useRef('');
  const textFilterRecordingRef = useRef('');

  const [isFilterMode, setFilterMode] = useState(false);
  // const [textFilterArtist, setTextFilterArtist] = useState("");
  const [textFilterTrack, setTextFilterTrack] = useState("");
  const [textFilterRecording, setTextFilterRecording] = useState("");


  const [textFilterArtist, setTextFilterArtist] = useState('');
  const arrArtistName = ["Artist1", "Artist2", "Artist3", /* ... */];
  // const handleChangeFilterSearchArtist = (e) => { setTextFilterArtist(e.target.value); };


  // References for scrolling
  const lognumbersRefs = useRef([]);
  const buttonListLogsNumbersRef = useRef(null);
  const tracksRefs = useRef([]);

  const handleToggle = () => {setFilterMode(!isFilterMode);};

  const handleChangeSearchFilterArtist = (event) => {
    setSearchFilterArtist(event.target.value);
  }
  const scrollToButtonListLogsNumbers = () => {
    const buttonListLogsNumbers = document.getElementById(
      "buttonListLogsNumbers"
    );
    if (buttonListLogsNumbers) {
      buttonListLogsNumbers.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };
  const scrollToButtonListTracksFollowing = (
    e,
    indexButton,
    track,
    direction = "next"
  ) => {
    const prevTrack = listTracks[Math.max(0, indexButton - 1)];
    const nextTrack = listTracks[Math.min(listTracks.length, indexButton + 1)];
    const buttonTrack =
      direction === "next"
        ? document.getElementById(nextTrack)
        : document.getElementById(prevTrack);
    if (buttonTrack) {
      // Temporarily set 'overflow' to 'visible' on .musicInterface to allow the scrolling
      const outputMusicSearch = document.querySelector(".outputMusicSearch");
      const originalOverflow = outputMusicSearch.style.overflow;
      outputMusicSearch.style.overflow = "visible";

      // Calculate the offset of the buttonTrack relative to the .musicInterface div
      const outputMusicSearchRect = outputMusicSearch.getBoundingClientRect();
      const buttonTrackRect = buttonTrack.getBoundingClientRect();
      const relativeOffset = buttonTrackRect.top - outputMusicSearchRect.top;

      // Calculate the desired scrollTop to ensure the element is visible in the .musicInterface div
      const scrollTop = outputMusicSearch.scrollTop + relativeOffset;

      // Perform the scroll on .outputMusicSearch
      outputMusicSearch.scrollTo({ top: scrollTop, behavior: "smooth" });

      // Reset 'overflow' back to its original value after the scrolling
      outputMusicSearch.style.overflow = originalOverflow;
      buttonTrack.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  };
  const scrollToButtonListRecordingsFollowing = (
    e,
    recording,
    direction = "next"
  ) => {
    // console.log("scrollToButtonListRecordingsFollowing | e: ",e,", recording: ", recording,", direction: ",direction);
    const curIndex = listLogNumbers.indexOf(recording);
    const prevSelecIndex = Math.max(0, curIndex - 1);
    const nextSelecIndex = Math.min(listLogNumbers.length, curIndex + 1);
    const selecIndex = direction === "next" ? nextSelecIndex : prevSelecIndex;
    // console.log("selecIndex: ",selecIndex," | lognumbersRefs: ",lognumbersRefs);

    // Temporarily set 'overflow' to 'visible' on .musicInterface to allow the scrolling
    const outputMusicSearch = document.querySelector(".outputMusicSearch");
    const originalOverflow = outputMusicSearch.style.overflow;
    outputMusicSearch.style.overflow = "visible";

    // Calculate the offset of the buttonTrack relative to the .musicInterface div
    const outputMusicSearchRect = outputMusicSearch.getBoundingClientRect();
    const buttonTrackRect =
      lognumbersRefs.current[curIndex].getBoundingClientRect();
    const relativeOffset = buttonTrackRect.top - outputMusicSearchRect.top;

    // Calculate the desired scrollTop to ensure the element is visible in the .musicInterface div
    const scrollTop = outputMusicSearch.scrollTop + relativeOffset;

    // Perform the scroll on .outputMusicSearch
    outputMusicSearch.scrollTo({ top: scrollTop, behavior: "smooth" });

    // Reset 'overflow' back to its original value after the scrolling
    outputMusicSearch.style.overflow = originalOverflow;
    lognumbersRefs.current[selecIndex].scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  };
  const handleScrollToRecording = (index) => {
    lognumbersRefs.current[index].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };
  const handleScrollToTrack = (index) => {
    tracksRefs.current[index].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const handleChangePercMatch = (event) => {
    setPercMatch(event.target.value);
  }


  const calculate_fuzzy_score = (pitch_notes) => {
    let score = 0;
    for (let i = 0; i < pitch_notes.length - 1; i++) {
      score += pitch_notes[i] - pitch_notes[i + 1];
    }
    return score;
  };
  const map_to_fuzzy_score = (score) => {
    if (score < -7) { return -4;} 
    else if (score >= -7 && score <= -5) { return -3; } 
    else if (score >= -4 && score <= -3) { return -2; } 
    else if (score >= -2 && score <= -1) { return -1; } 
    else if (score === 0) { return 0; } 
    else if (score >= 1 && score <= 2) { return 1; } 
    else if (score >= 3 && score <= 4) { return 2; } 
    else if (score >= 5 && score <= 7) { return 3; } 
    else { return 4; }
  };

// ---- React functions
  useEffect(() => {
    setValidPitchQuery(PITCH_QUERY_REGEX.test(textSearch));
    console.log(
      "useEffect textSearch, validPitchQuery: ",
      validPitchQuery,
      ", textSearch: ",
      textSearch,
      ", typeof textSearch",
      typeof textSearch,
      ", length>0: ",
      ("" + textSearch).length > 0,
      ", -?: ",
      ("" + textSearch).indexOf("-") === -1
    );
    console.log(
      "showNotesTranslate: ",
      showNotesTranslate,
      ", notesTranslate: ",
      notesTranslate
    );
    let strTextSearch = "" + textSearch;
    console.log("strTextSearch: ", strTextSearch);
    let curTxtSearch =
      strTextSearch[strTextSearch.length - 1] === "-"
        ? strTextSearch.substring(0, strTextSearch.length - 1)
        : strTextSearch;
    if (curTxtSearch.indexOf("-") === -1) {
      setNotesTranslate(curTxtSearch);
    } else {
      setNotesTranslate(
        ("" + curTxtSearch)
          .split("-")
          .map((a, i) =>
            i === ("" + curTxtSearch).split("-").length - 1
              ? Number(a) < 21
                ? ""
                : MIDItoNote[a].replaceAll("s", "")
              : (MIDItoNote[a] + "-").replaceAll("s", "")
          )
      );
    }
    setShowNotesTranslate(strTextSearch.length > 0);
  }, [textSearch, validPitchQuery]);

  useEffect(() => {
    // new approach: sorting based on alphabet
    const sorted = listLogNumbers.sort();
    setListLogNumbers(sorted);

    lognumbersRefs.current = lognumbersRefs.current
      .slice(0, listLogNumbers.length)
      .map((ref, index) => ref || React.createRef());
  }, [listLogNumbers]);

  useEffect(() => {
    // new approach: sorting based on alphabet
    const sorted = listTracks.sort();
    setListTracks(sorted);
    tracksRefs.current = tracksRefs.current
      .slice(0, listTracks.length)
      .map((ref, index) => ref || React.createRef());
  }, [listTracks]);

  const findMatchRecording = (recording) => {
    console.log(
      "~~~~ findMatchRecording | recording: ", recording, ", infoRecordingTrackList: ", infoMusicList
    );
    // Not a great approach... but should work okay.
    if (recording.includes("SJA")) {
      const matchIndex = infoMusicList.findIndex(
        (item) =>
          item.lognumber.substring(0, item.lognumber.lastIndexOf("_")) ===
          recording
      );
      return matchIndex;
    } else {
      const matchIndex = infoMusicList.findIndex(
        (item) => item.lognumber === recording
      );
      return matchIndex;
    }
  };

  // ---- Functions handle
  const handleChangeQueryPitch = useCallback(
    (event) => {
      const value = event.target.value;
      if (PITCH_QUERY_REGEX.test(value) || value[value.length - 1] === "-") {
        setTextSearch(value);
      }
    },
    [setTextSearch]
  );
  const handleChangeFilterSearchArtist = useCallback(
    (event) => {
      const value = event.target.value;
      setTextFilterArtist(value);
    },
    [setTextFilterArtist]
  );
  const handleChangeFilterSearchTrack = useCallback(
    (event) => {
      const value = event.target.value;
      setTextFilterTrack(value);
    },
    [setTextFilterTrack]
  );
  const handleChangeFilterSearchRecording = useCallback(
    (event) => {
      const value = event.target.value;
      console.log("value handleChangeFilterSearchRecording: ", value);
      setTextFilterRecording(value);
    },
    [setTextFilterRecording]
  );

  const handleClickTextSearchFuzzyLevenshtein = async (e) => {
    e.preventDefault();
    console.log("handleClickTextSearchFuzzyLevenshtein: ", new Date());    
    if (textSearch!== ''){
      setInfoMusicList([]);
      setOldSearch(textSearch);
      // setTextSearch("");
      getFuzzyLevenshtein(
        textSearch,
        percMatch,
        localStorage?.username,
        setListSearchRes,
        setListLogNumbers,
        setListTracks,
        infoMusicList, 
        setInfoMusicList,
        textFilterArtist, textFilterTrack, textFilterRecording
      )
    }
  }  

  // ######## TEST FOR PERFORMANCES ########
  const handleClickTextSearchTEST_getListFuzzyDist = async (e) => {
    e.preventDefault();
    console.log("handleClickTextSearchTEST_getListFuzzyDist: ", new Date());
    if (textSearch !== "") {
      let valsNotes = textSearch.split('-').map(a => Number(a));
      console.log("valsNotes: ",valsNotes);
      let score =  map_to_fuzzy_score (calculate_fuzzy_score(valsNotes))  // need function
      console.log("score: ",score);
      let distance = textSearch.split('-').length;
      console.log("distance: ",distance);
      getListFuzzyDist(score, distance);
      setTextSearch("");
    }
  };


  // function playMp3() {
  //   if (playingMp3) { audioMp3.pause(); setIconPlayMp3(<AiFillPlayCircle className="icon"></AiFillPlayCircle>); } else { audioMp3.play(); setIconPlayMp3(<AiFillPauseCircle className="icon"></AiFillPauseCircle>); }
  //   setPlayingMp3(!playingMp3);
  // }
  // function playToneSalamander() {
  //   const now = Tone.now();
  //   Tone.loaded().then(() => {
  //     for (var i = 0; i < 3; i++) {
  //       sampler.triggerAttackRelease( 
  //         [ `E${i + 4}`, `F${i + 4}`, `C${i + 4}`, `G${i + 4}`, `B${i + 4}`, `A${i + 4}`, `A#${i + 4}`, ],
  //         1,
  //         now + i
  //       );}
  //   });
  // }
  // function resetMp3() {
  //   if (playingMp3) { audioMp3.pause(); setIconPlayMp3(<AiFillPlayCircle></AiFillPlayCircle>); setPlayingMp3(!playingMp3); }
  //   setAudioMp3( new Audio("https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3") );
  // }

  function handleKeyPress(keyName) {
    setTextSearch((prevText) =>
      prevText === ""
        ? NotetoMIDI[keyName]
        : prevText + "-" + NotetoMIDI[keyName]
    );
    textSearchRef.current.value += NotetoMIDI[keyName];
  }

  // ---- Functions
  // Function for distance: arrays of int
  function calcLevenshteinDistance_int(arr1, arr2) {
    const m = arr1.length;
    const n = arr2.length;
    const dp = Array.from({ length: m + 1 }, () =>
      Array.from({ length: n + 1 }, () => 0)
    );
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
    const outputArray = d.map((item) => ({ time: item.onset, note: Math.pow(2, (item.pitch - 69) / 12) * 440, duration: item.duration * 16, }));
    return outputArray; }

  function playFormattedMusic(music) {
    synth2.current.dispose(); // this may be something good, but really unsure!
    synth2.current = new Tone.Synth();
    synth2.current.toDestination();

    Tone.Transport.stop();
    if (Tone.Transport.state !== "started") { Tone.Transport.start(); } 
    else { Tone.Transport.stop(); }
    const offsetTest = 0.1;

    const now = Tone.now() + offsetTest;
    music.forEach((tune) => {
      synth2.current.triggerAttackRelease(
        MIDItoNote[tune.note], tune.duration, now + tune.time
      );
    });
    Tone.Transport.stop();
  }

  function formatAndPlay(item) {
    // Reformat
    const arrNotes = item.arrNotes;
    const arrTime = item.arrTime;
    const arrDurations = item.arrDurations;
    const firstTime = arrTime[0];
    const combinedArray = arrNotes.map((note, index) => ({
      note,
      time: arrTime[index] - firstTime,
      duration: arrDurations[index],
    }));
    playFormattedMusic(combinedArray);
  }

  function getMusicInfo(track, infoMusicList, setInfoMusicList = null) {
    console.log("getMusicInfo -- infoMusicList: ", infoMusicList);
    const lognumber = track.split("-")[0];
    getTrackMetadata(lognumber, infoMusicList, setInfoMusicList);
  }

  return (
    <div className="musicInterface">
      <BsFillInfoCircleFill
        className="icon infoMusicInterface w-[2rem] h-[2rem]"
        onClick={() => setShowExplanation(!showExplanation)}
      />
      {showExplanation && (
        <div className="explanation">
          <ImCross
            className="icon"
            onClick={() => setShowExplanation(!showExplanation)}
          />
          <h1 className="title">How to Use the Search Interface</h1>
          <div className="detailsExplanation">
            <p>
              The Search Interface is designed to search for samples that match
              the melodies you enter in our system. To do so, simply click on
              the piano keys for the notes you wish and submit your search.
            </p>
            <p>
              The results will be displayed in a structured format indicating
              where the matching samples were found. The system will provide
              information about the sample and allow you to play it.
            </p>
            <p>
              You can also read the annotations made by other users and their
              associated comments.
            </p>
            <p>
              More functionalities are available if you register an account and
              log in. These functionalities include:
            </p>
            <ul className="functionality-list">
              <li key="list1Explanation">Writing annotations and comments.</li>
              <li key="list2Explanation">
                Creating workflows, which are structures similar to notebooks
                where you can save elements of interest and note your thoughts.
                Workflows can be found in the workflow manager.
              </li>
              <li key="list3Explanation">
                Search for workflows based on attributes of the content used to
                populate the workflow.
              </li>
            </ul>
            <p className="development-info">
              More functionalities are in development. <BiWrench />
            </p>
          </div>
        </div>
      )}
      <Title firstLine="Search" secondLine="Interface" />
      {/* ==== Test Mp3 playing ==== */}
      {/* <div className="playMusic" onClick={(c) => { playMp3(); }} > Play Test Mp3 </div>
      <div className='playMusic' onClick={(c)=>{playToneSalamander();}}> Play from tone loaded </div> */}
      {/* ==== Test Piano Roll === */}
      {/* <div className='pianoArea'> <h1>Piano Roll</h1> <PianoRoll notes={notes} occurrences={occurrences} durations={durations} width={600} height={200} /> </div> */}
      {/* ==== PIANO INPUT ==== */}
      <Piano onKeyPress={handleKeyPress} />
      {/* ==== SEARCH INPUT ==== */}
      <div className="topTextSearch">
        <div className="disclaimerSearchPitch">
          Play the piano keys or enter a query based on pitch notes (from 0 to
          127) separated with - characters. Enter between 4 and 10 notes.
        </div>
        <input
          type="text"
          className="inputMusicSearch"
          placeholder="Enter melody here"
          ref={textSearchRef}
          autoComplete="off"
          required
          value={textSearch}
          onChange={handleChangeQueryPitch}
        />
        <p className="text-white">
          Select threshold for percentage of match:
          <select
            className="selectPercMatch"
            value={percMatch}
            onChange={handleChangePercMatch}
          >
            {/* <option value={0.1}>10%</option> <option value={0.2}>20%</option>{" "}
            <option value={0.3}>30%</option> <option value={0.4}>40%</option>{" "} */}
            <option value={0.5}>50%</option>
            <option value={0.6}>60%</option> <option value={0.7}>70%</option>{" "}
            <option value={0.8}>80%</option> <option value={0.9}>90%</option>{" "}
            <option value={1}>100%</option>
          </select>
        </p>
          
          {/* This works, but we should focus on having other parameters first.
        <AutoComplete title={"Fruits"} potentialInputs={["Apple", "Banan7a","Bana44na","Banan4a","Orange35", "Orange", "Grapes", "Cherry"]}/> */}
        
        <p className="text-white">
          Show filters:
          <ToggleSwitch checked={isFilterMode} onChange={handleToggle} />
        </p>
        {isFilterMode && (
          <>
            <p className="text-white">
              Leave input empty for parameters you don't want to filter.
            </p>
            <div className="text-white">
              <AutoComplete
                title="Artist Search"
                potentialInputs={ artistNames }
                inputValue={textFilterArtist}
                onInputChange={handleChangeFilterSearchArtist}
              />
              {/* <p>Artist name:</p>
              <input
                type="text"
                className="inputMusicSearch mx-[0.5rem]" // could/should use a different className
                placeholder=""
                ref={textFilterArtistRef}
                autoComplete="off"
                required
                value={textFilterArtist}
                onChange={handleChangeFilterSearchArtist}
              /> */}
              <AutoComplete
                title="Track Search"
                potentialInputs={trackTitles}
                inputValue={textFilterTrack}
                onInputChange={handleChangeFilterSearchTrack}
              />
              {/* <p>Track name:</p>
              <input
                type="text"
                className="inputMusicSearch mx-[0.5rem]" // could/should use a different className
                placeholder=""
                ref={textFilterTrackRef}
                autoComplete="off"
                required
                value={textFilterTrack}
                onChange={handleChangeFilterSearchTrack}
              /> */}
              <AutoComplete
                title="Recording Search"
                potentialInputs={recordings}
                inputValue={textFilterRecording}
                onInputChange={handleChangeFilterSearchRecording}
              />
              {/* <p>Recording name:</p>
              <input
                type="text"
                className="inputMusicSearch mx-[0.5rem]" // could/should use a different className
                placeholder=""
                ref={textFilterRecordingRef}
                autoComplete="off"
                required
                value={textFilterRecording}
                onChange={handleChangeFilterSearchRecording}
              /> */}
            </div>
          </>
        )}
        <button onClick={handleClickTextSearchFuzzyLevenshtein}> Submit search </button>
        {("" + textSearch).length > 0 && (
          <div className="bg-slate-200 text-center mx-64 opacity-75 max-w-80%">
            Notes: ({notesTranslate})
          </div>
        )}
      </div>

      {/* ==== OUTPUT SEARCH ==== */}
      {/* Approach with MyTabbedInterface */}
      {listSearchRes.length <= 0 ? (
        <></>
      ) : (
        <div className="outputMusicSearch">
          {/* Display both pitches and notes */}
          <p className="text-xl">List of results for your search:</p>
          <h4>
            {oldSearch} (
            {("" + oldSearch).indexOf("-") === -1
              ? ("" + MIDItoNote["" + oldSearch]).replaceAll("s", "")
              : ("" + oldSearch)
                .split("-")
                .map((a, i) =>
                  i === ("" + oldSearch).split("-").length - 1
                    ? MIDItoNote[a].replaceAll("s", "")
                    : (MIDItoNote[a] + "-").replaceAll("s", "")
                )}
            )
          </h4>

          <div className="text-left">
            <AnnotationSystem type={"search"} info={oldSearch} />
            {/* TODO update the workflow system so that it can save searches!!! Working on it from 2023.11.14. */}
            <EmbeddedWorkflowInteraction
              idCaller={oldSearch + "_fArtist(" + textFilterArtist + ")_fRecording(" + textFilterRecording + ")_fTrack(" + textFilterTrack + ")_fPerc(" + percMatch + ")"}
              typeCaller={"search"}
              listLogNumbers={listLogNumbers}
              infoMusicList={infoMusicList}
              listTracks={listTracks}
            />
          </div>

            {/* We should create a different type of component with some vis. */}
            {/* This is rendered twice?! */}
            {/* {infoMusicList.length > 0 &&
              (<GraphsResults infoMusicList={infoMusicList} oldSearch={oldSearch} listSearchRes={listSearchRes} />) } */}
            {infoMusicList.length > 0 && (
              <MemoizedGraphsResults
                infoMusicList={infoMusicList}
                oldSearch={oldSearch}
                listSearchRes={listSearchRes}
              />
            )}
          {/* Is this rendered twice too?! */}
          {infoMusicList.length > 0 ? (
            <MyTabbedInterface
              listSearchRes={listSearchRes}
              listLogNumbers={listLogNumbers}
              listTracks={listTracks}
              infoMusicList={infoMusicList}
              findMatchRecording={findMatchRecording}
              formatAndPlay={formatAndPlay}
              getMusicInfo={getMusicInfo}
              setInfoMusicList={setInfoMusicList}
            />
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}


export default MusicInterface;