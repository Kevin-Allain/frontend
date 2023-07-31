import React, { useRef, useState, useEffect, useContext } from 'react';
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
import Piano from "./Piano"
import NotetoMIDI from "./NotetoMIDI.json"
import MIDItoNote from "./MIDItoNote.json"
import Annotation from '../Annotation/Annotation';
import AnnotationSystem from '../Annotation/AnnotationSystem';
import { AiFillPlayCircle, AiFillPauseCircle, AiOutlineArrowRight, AiOutlineLoading } from 'react-icons/ai'
import {
  MdKeyboardDoubleArrowUp, MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight
} from 'react-icons/md'
import { ImLoop2 } from 'react-icons/im'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { BsInfoCircleFill } from 'react-icons/bs'
import TrackRes from './TrackRes';
import PianoRoll from '../VisComponents/PianoRoll';

const PITCH_QUERY_REGEX = /^$|(^(?!.*--)(?!-)([0-9]{1,2}|1[01][0-9]|12[0-7])(-([0-9]{1,2}|1[01][0-9]|12[0-7]))*(-?)$)/;
// Test attributes
const notes = [60, 61, 62,63, 64,65,66, 59, 67,68,69, 55, 77, 89,90, 82];
const occurrences = [0,1, 2,3, 4,5,6, 7, 6.5, 7.5,7.5,8, 8, 8,9, 13.25];
const durations = [0.5,1, 1,1, 2, 3,1,1, 4, 5, 2, 1,1, 1,0.5, 1.82];


const MusicInterface = () => {

  // TODO consider whether useref would make more sense? We don't intend to change it according to render... // const [synth2, setSynth2] =  useState(new Tone.Synth());
  const synth2 = useRef(new Tone.Synth());
  synth2.current.oscillator.type = "sine";
  synth2.current.toDestination();

  const [playingMp3, setPlayingMp3] = useState(false);
  const [iconPlayMp3, setIconPlayMp3] = useState(<AiFillPlayCircle className='icon'></AiFillPlayCircle>)
  const [audioMp3, setAudioMp3] = useState(new Audio("https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"))

  const [iconSearchTest, setIconSearchTest] = useState(<AiOutlineArrowRight className='icon'></AiOutlineArrowRight>)

  const [textSearch, setTextSearch] = useState('');
  const textSearchRef = useRef('');
  const [validPitchQuery, setValidPitchQuery] = useState(false);

  const [oldSearch, setOldSearch] = useState('');

  const [infoMusicList, setInfoMusicList] = useState([]);
  const [listTracks, setListTracks] = useState([]);
  const [listSearchRes, setListSearchRes] = useState([]);
  const [listLogNumbers, setListLogNumbers] = useState([]);

  const [listAnnotSearch, setListAnnotSearch] = useState([]);
  const [listAnnotMusRes, setListAnnotMusRes] = useState([]);

  // References for scrolling
  const lognumbersRefs = useRef([]);
  const buttonListLogsNumbersRef = useRef(null);
  const tracksRefs = useRef([]);
  const buttonListTracksRef = useRef(null);

  // References for loading metadata within recording component
  const [hashMetaMatch,setHashMetaMatch] = useState(new Map());


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

  const scrollToButtonListLogsNumbers = () => {
    const buttonListLogsNumbers = document.getElementById('buttonListLogsNumbers');
    if (buttonListLogsNumbers) {
      buttonListLogsNumbers.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  const scrollToButtonListTracksFollowing = (e, indexButton, track, direction='next') => {
    // console.log("scrollToButtonListTracksPrev | e: ",e,", indexButton: ", indexButton,", track: ", track);
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
      outputMusicSearch.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      });

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
      outputMusicSearch.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      });

      // Reset 'overflow' back to its original value after the scrolling
      outputMusicSearch.style.overflow = originalOverflow;
    lognumbersRefs.current[selecIndex].scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }

  const handleScrollToRecording = (index) => {
    console.log("handleScrollToRecording | lognumbersRefs: ",lognumbersRefs, ", index: ",index);
    lognumbersRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });    
  }

  const handleScrollToTrack = (index) => {
    console.log("handleScrollToTrack | tracksRefs: ",tracksRefs, ", index: ",index);
    tracksRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  // ---- React functions
  useEffect(() => {
    setValidPitchQuery(PITCH_QUERY_REGEX.test(textSearch))
    console.log("useEffect textSearch, validPitchQuery: ", validPitchQuery)
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

  // useEffect(() => {
  //   console.log("useEffect to infoMusicList. infoMusicList: ",infoMusicList,", hashMetaMatch: ",hashMetaMatch);
  //   for(var i in infoMusicList){
  //     setHashMetaMatch(map => new Map(map.set( infoMusicList[i].lognumber , infoMusicList[i])))
  //   }
  //   console.log("hashMetaMatch: ",hashMetaMatch);
  // },[infoMusicList])

  const findMatchRecording = (lln) => {
    const matchIndex = infoMusicList.findIndex(item => item.lognumber === lln);
    return matchIndex;
  }
  

  // ---- Functions handle
  const handleChangeQueryPitch = (event) => {
    const value = event.target.value;

    if (PITCH_QUERY_REGEX.test(value) || value[value.length - 1] === '-') {
      setTextSearch(value)
    }
  }

  const handleClickTextSearch = async (e) => {
    e.preventDefault();
    console.log("", textSearch, ", (typeof textSearch): ", (typeof textSearch));
    // make a call to the database, then set string back to ''
    if (textSearch !== '') {
      findMatchLevenshteinDistance(textSearch);
    }
  };

  function handleKeyPress(keyName) {
    setTextSearch((prevText) => (prevText === '') ? NotetoMIDI[keyName] : prevText + '-' + NotetoMIDI[keyName]);
    textSearchRef.current.value += NotetoMIDI[keyName];
  }

  // TODO use for note playing!!! https://tonejs.github.io/
  // const sampler = new Tone.Sampler({
  // 	urls: { "C4": "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", "A4": "A4.mp3", },
  // 	release: 1,
  // 	baseUrl: "https://tonejs.github.io/audio/salamander/",
  // }).toDestination();

  // ---- Functions
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
    // synth2.current.dispose(); // this may be something good, but really unsure!
    // synth2.current = new Tone.Synth();
    // synth2.current.toDestination();

    console.log("-1- Tone.Transport.state |", Tone.Transport.state, '|, Tone.Transport.state !== "started" ', (Tone.Transport.state !== "started"), ", typeof (Tone.Transport.state): ", (typeof Tone.Transport.state));
    // const now = Tone.now(); // const synth3 = new Tone.MembraneSynth().toDestination();
    for (var i in Tone.Transport.state) {
      console.log(i, ": ", Tone.Transport.state[i]);
    }
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

    // console.log("music: ",music);

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
    console.log("formatAndPlay. arrNotes: ", arrNotes);

    const combinedArray = arrNotes.map((note, index) => ({
      note,
      time: arrTime[index] - firstTime,
      duration: arrDurations[index]
    }));
    // Play formatted music
    playFormattedMusic(combinedArray);
  }

  function getMusicInfo(track, infoMusicList, setInfoMusicList = null) {
    const lognumber = track.split("-")[0];
    console.log("getMusicInfo, track: ", track, ", lognumber: ", lognumber, ", setInfoMusicList: ", setInfoMusicList);
    getTrackMetadata(lognumber, infoMusicList, setInfoMusicList);
  }

  function getResultsInfo(lognumbers, infoMusicList, setInfoMusicList) {
    console.log("getResultsInfo, lognumbers: ", lognumbers, { infoMusicList, setInfoMusicList });
    getTracksMetadata(
      lognumbers, 
      infoMusicList, 
      setInfoMusicList
    );
  }


  function findMatchLevenshteinDistance(strNotes = "69-76-76-74-76") {
    console.log("---- findMatchLevenshteinDistance.")
    setInfoMusicList([]);
    setOldSearch(strNotes);
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
    );
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

  function resetMp3() {
    if (playingMp3) {
      audioMp3.pause();
      setIconPlayMp3(<AiFillPlayCircle></AiFillPlayCircle>)
      setPlayingMp3(!playingMp3);
    }
    setAudioMp3(new Audio("https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"));
  }




  return (
    <div className="musicInterface">
      <h1>Music Interface</h1>
      {/* ==== Test Piano Roll === */}
      <div>
        <h1>Piano Roll</h1>
        <PianoRoll notes={notes} occurrences={occurrences} durations={durations} width={400} height={350}/>
      </div>
      {/* ==== PIANO INPUT ==== */}
      <Piano onKeyPress={handleKeyPress} />
      {/* ==== SEARCH INPUT ==== */}
      <div className="topTextSearch">
        <div className='disclaimerSearchPitch'>Play the piano keys or enter a query based on pitch notes (from 0 to 127) separated with - characters.</div>
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

      {/* ==== OUTPUT SEARCH ==== */}
      <div className='wrapperMusicSearch'>
        {(listSearchRes.length <= 0) ? (<></>) :
          <div className='outputMusicSearch'>
            {/* TODO fix imperfect implementation, makes more sense for oldSearch to be updated with handleAPi output. */}
            List of results for your search: <h4>{oldSearch}</h4>
            <AnnotationSystem
              type={"search"}
              info={oldSearch}
            />
            {/* TODO set it to left as the user scrolls down  */}
            <div id='buttonListLogsNumbers' ref={buttonListLogsNumbersRef}>
              The list of recordings is:
              <nav>
                {listLogNumbers.map((a, index) => (
                  <button key={index + 'lognumberButton'} onClick={() => handleScrollToRecording(index)}>
                    {a}
                  </button>
                ))}
              </nav>
            </div>

            <div className='musicInterfaceContent'>

              {/* <div className='infoLogNumber'>Load information about the recordings<br />
                <BsInfoCircleFill className='icon'
                  onClick={() => getResultsInfo(
                    listLogNumbers,
                    infoMusicList,
                    setInfoMusicList
                  )}
                />
                {(infoMusicList.length <= 0) ? (<></>) :
                  infoMusicList.map((item, i) => (
                      <MusicInfo className='musicinfo'
                        key={`${i}-${item.lognumber}`} // for some reason warning about keys?!
                        lognumber={item.lognumber}
                        contents={item.contents}
                        recording_location={item.recording_location}
                        addAnnotation={addAnnotation}
                        updateAnnotation={updateAnnotation}
                        getAnnotations={getAnnotations}
                        deleteAnnotation={deleteAnnotation}
                        idDatabase = {item.idDatabase} // doubt about whether this will be present?
                      />
                  )
                  )
                }
              </div> */}

              {listLogNumbers.length > 0 &&
                listLogNumbers.map((lln, index) => (          
                  <div
                    className='recordingItem' key={'recordingItem' + index}
                    alt={lln}
                    ref={ref => (lognumbersRefs.current[index] = ref)}
                  >
                    <h2>Recording: {lln}</h2>
                    <em>List of recordings 
                      <MdKeyboardDoubleArrowUp 
                        className='icon' 
                        onClick={scrollToButtonListLogsNumbers}
                      />
                    </em>
                    <div className='metadataRecording'>
                      {(infoMusicList.length === 0) ? (<AiOutlineLoading className="spin" size={"20px"} />) :
                        (findMatchRecording(lln) !== -1) ? (
                          <div>
                            {/* Content to display if the index matches */}
                            <p>lognumber: {lln}</p>
                            {/* Add more properties from the matched object here */}
                            From item: {infoMusicList[findMatchRecording(lln)].lognumber}
                          </div>
                        ) : (
                          <>No match for metadata</>
                        )}
                    </div>
                    <div className='matchedTracksOfRecording'>
                      {listTracks.length > 0 &&
                        listTracks.map((track, ndx) => {
                          if (track.includes(lln)) {
                            return (
                              <div
                                className='trackItem' id={track}
                              >
                                Previous Recording{" "}
                                <MdKeyboardDoubleArrowLeft className='icon' onClick={(e) => scrollToButtonListRecordingsFollowing(e, lln,'prev')}/>
                                |{" "}Previous Track{" "}
                                <MdOutlineKeyboardArrowLeft className='icon' onClick={(e) => scrollToButtonListTracksFollowing(e, ndx, track,'prev')}/> 
                                |{" "}Next Track{" "}
                                <MdOutlineKeyboardArrowRight className='icon' onClick={(e) => scrollToButtonListTracksFollowing(e, ndx, track,'next')}/>
                                |{" "}Next Recording
                                <MdKeyboardDoubleArrowRight className='icon' onClick={(e) => scrollToButtonListRecordingsFollowing(e, lln,'next')}/>
                                <TrackRes
                                  key={"Track" + ndx + '' + track}
                                  text={track}
                                  listSearchRes={listSearchRes.filter(a => a.recording === track)}
                                  formatAndPlay={formatAndPlay}
                                  getMusicInfo={getMusicInfo}
                                  infoMusicList={infoMusicList}
                                  setInfoMusicList={setInfoMusicList}
                                />

                              </div>
                            );
                          } else {
                            return null; // or any fallback if track doesn't match
                          }
                        })}
                    </div>
                  </div>
                ))}

              {/* {(listSearchRes.length <= 0) ? (<></>) :
                listTracks.map((item, i) => (
                  <>
                    <TrackRes
                      key={"Track"+i + '' + item}
                      text={item}
                      listSearchRes={listSearchRes.filter(a => a.recording===item)}
                      formatAndPlay={formatAndPlay}
                      getMusicInfo={getMusicInfo}
                      infoMusicList={infoMusicList}
                      setInfoMusicList={setInfoMusicList}
                    />
                  </>
                ))
              } */}

            </div>
          </div>
        }
      </div>

      {/* ==== BUTTONS FOR TESTS ====  */}
      {/* <div className="buttonsMusicInterface">
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
          className="reloadPage"
          onClick={(c) => {
            console.log("reload the page");
            window.location.reload();
          }}
        >
          Reload Page
        </div>
      </div> */}
    </div>
  );
}


export default MusicInterface;