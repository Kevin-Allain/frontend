import React, { useState, useRef, useEffect } from "react";
// import SimpleBar from 'simplebar-react';
// import 'simplebar-react/dist/simplebar.min.css';
import "./MyTabbedInterface.css";
import { AiOutlineLoading } from "react-icons/ai";
import TrackRes from "./TrackRes"; // You should adjust the import path
import MetadataAccordion from "./MetadataAccordion";
import MIDItoNote from "./MIDItoNote.json"
import {BsFillInfoCircleFill} from 'react-icons/bs'
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import { MdPiano } from "react-icons/md";
import { FiPlayCircle } from 'react-icons/fi'
import { FaMusic } from "react-icons/fa";
import { BiHide } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import TableRow from "./TableRow";
import AdditionalInfo from "./AdditionalInfo";
import {
  testHelloWorld,
  doesMp3exist,
  doMp3exist
} from "../../utils/HandleApi";
import PianoRoll from "../VisComponents/PianoRoll";
import * as Tone from "tone";
// TODO consider how these should be used with the table
import AnnotationSystem from "../Annotation/AnnotationSystem";
import EmbeddedWorkflowInteraction from "../Workflow/EmbeddedWorkflowInteraction";

const MyTabbedInterface = ({
  listLogNumbers,
  findMatchRecording,
  infoMusicList,
  listTracks,
  listSearchRes,
  formatAndPlay,
  getMusicInfo,
  setInfoMusicList,
  oldSearch,
  textFilterArtist,
  textFilterRecording,
  textFilterTrack,
  percMatch
}) => {
  const [activeRecording, setActiveRecording] = useState(null);
  const [activeTrack, setActiveTrack] = useState(null);
  const [visibleTracks, setVisibleTracks] = useState({});
  const tracksContainerRef = useRef(null);
  const [expandedRecording, setExpandedRecording] = useState(false);
  const [expandedTrack, setExpandedTrack] = useState(false);

  const [prevColumn, setPrevColumn] = useState('');

  const sampler = new Tone.Sampler({
    urls: { C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", A4: "A4.mp3" }, release: 1, baseUrl: "https://tonejs.github.io/audio/salamander/",
  }).toDestination();

  const handlePlayMIDINotes = (notes, durations, times) => {
    const now = Tone.now();
    // console.log("handlePlayNotes notes: ", notes, ", durations: ", durations,", times: ",times);
    if (typeof notes === "undefined") {
      return;
    }
    let arrNotes = (typeof notes === 'string')? notes.split("-") : notes;
    let arrDur = (typeof durations === 'string')? durations.split("-") : durations;
    let arrTimes = (typeof times === 'string')? times.split("-").map((a) => Number(a)) : times;
    const firstTime = arrTimes[0];
    const adjustedTimes = arrTimes.map((a) => now + a - firstTime);
    for (let i = 0; i < arrNotes.length; i++) {
      sampler.triggerAttackRelease( [MIDItoNote[arrNotes[i]]], arrDur[i], adjustedTimes[i] );
    }
  };

  let prettyNamesLogNumber = {};
  for (var i = 0; i < listLogNumbers.length; i++) {
    let lognumber = listLogNumbers[i];
    let a = infoMusicList.filter(a => a.lognumber === lognumber);
    if (a.length > 0) {
      a = a[0];
      if (a.lognumber === lognumber ) { // && !lognumber.includes("BGR")
        let eventYear = a["Event Year"]==='', eventMonth = a["Event Month"]==='',eventDay = a["Event Day"]==='';
        prettyNamesLogNumber[lognumber] = (
          a["(E) Event Name"] +
          (eventYear ? '' : (' ' + a["Event Year"])) +
          (eventMonth ? '' : ('/' + a["Event Month"])) +
          (eventDay ? '' : ('/' + a["Event Day"]))
        );
      } else { prettyNamesLogNumber[lognumber] = lognumber }
    } else { prettyNamesLogNumber[lognumber] = lognumber }
  }

  // TODO we should remove all of this
  let tracksForEvent = [];
  let newStruct = [];
  let trackToTitles = {};
  for (let i in listSearchRes) {
    let curSR = listSearchRes[i];
    // WHY ARE THERE CASES WITH THE TRACK UNDEFINED?!
    if (curSR.track) {
      let curTrack = curSR.track;
      let trackInfoCode = curTrack.replace('-T', '_')
      if (curTrack.includes('SJA') || curTrack.includes('BCC') || curTrack.includes('BGR')) {
        let selecInfo = infoMusicList.filter(a => a['SJA_ID'] === trackInfoCode)
        trackToTitles[curTrack] = selecInfo[0]['Track Title'] // Is this normal?
      }
    }
    else {
      console.log("MASSIVE ISSUE. curSR: ",curSR);
    }
  }
  let filteredUniqueSearchResTracks = [];
  console.log("trackToTitles: ",trackToTitles);

  const mergedData = {};
  infoMusicList.forEach((item) => {
    const eventName = item["(E) Event Name"];
    const trackNumber = item["Track #"];
    const lognumber = item["lognumber"];
    if (eventName) {
      if (!mergedData[eventName]) { mergedData[eventName] = { tracks: [] }; }
      if (!mergedData[eventName].tracks[trackNumber]) { mergedData[eventName].tracks[trackNumber] = []; }
      mergedData[eventName].tracks[trackNumber].push(item);
    } else if (lognumber) {
      if (!mergedData[lognumber]) { mergedData[lognumber] = { tracks: [] }; }
      // Calculate the trackNumber based on the number of existing tracks
      const nextTrackNumber = mergedData[lognumber].tracks.length;
      if (!mergedData[lognumber].tracks[nextTrackNumber]) { mergedData[lognumber].tracks[nextTrackNumber] = []; }
      mergedData[lognumber].tracks[nextTrackNumber].push(item);
    }
  });

  let keysEvents = Object.keys(mergedData);
  for (var d in mergedData) {
    const tracks = mergedData[d].tracks.filter((a) => typeof a !== "undefined");
    // Use concat to flatten the second level arrays
    const flattenedTracks = [].concat(...tracks);
    tracksForEvent.push(flattenedTracks);
  }
  keysEvents.map((a, i) => newStruct.push({ recordingName: a, content: tracksForEvent[i] }) );
  // Sort newStruct (here according to recording)
  newStruct = newStruct.sort((a, b) => a.recording > b.recording ? 1 : b.recording > a.recording ? -1 : 0 );
  // const [audioMp3, setAudioMp3] = useState( new Audio(`https://jazzdap.city.ac.uk/public/sliced_audio_0_3.mp3`.replace(/ /g,"%20")) );

  // TODO will need to be updated to be more specific...!
  const playMp3Slicer = (fileNameSlicer, audioName, start, end, item) => {
    console.log("playMp3Slicer - fileNameSlicer: ", fileNameSlicer);
    let audioMp3 = new Audio(fileNameSlicer.replace(/ /g, "%20"));
    audioMp3.onerror = function() {
      // If an error occurs while loading the audio, update audioName and try again
      audioName = item.SJA_ID;
      fileNameSlicer = `https://jazzdap.city.ac.uk/public/${audioName}_${start}_${end}.mp3`;
      console.log("Retry playMp3Slicer - fileNameSlicer: ", fileNameSlicer);
      audioMp3 = new Audio(fileNameSlicer.replace(/ /g, "%20"));
      audioMp3.onerror = function() {
        // If a second error occurs, display an alert
        alert('Audio file not found');
      };
      audioMp3.play();
    };
    audioMp3.play();
  };
  
  const handleClickPlayMp3 = async (item) => {
    console.log("handleClickPlayMp3 - item: ", item);
    // TODO slice based on audio beginning and ending
    let audioName = item["Audio Filename (Internal backup)"];

    const endOfAudioUrl = item["Audio File Path (internal backup)"].split("/")[item["Audio File Path (internal backup)"].split("/").length-2].replace(/[^a-z0-9]/gi, '');
    const potentialSJA_ID_forFile = item["SJA_ID"]?.replace(/[^a-z0-9]/gi, '');
    const potentialTrackTitle_forFile = item["Track Title"]?.replace(/[^a-z0-9]/gi, '');




    let start = Math.floor(item.arrTime[0]);
    let end = Math.ceil(item.arrTime[item.arrTime.length - 1]);
    let fileNameSlicer = `https://jazzdap.city.ac.uk/public/${audioName}_${start}_${end}.mp3`;
    
    playMp3Slicer(fileNameSlicer, audioName, start, end, item);
  };
          
  const handleClickPlayMIDI = item => {
    console.log("handleClickPlayMIDI - item: ",item);
    handlePlayMIDINotes(item.arrNotes,item.arrDurations,item.arrTime);
  }

  const handleClickShowDetails = (item) => {
    console.log("handleClickShowDetails - item: ",item);
    console.log(Object.entries(item));
    setContentExpandedRow(
      <>
      <u>Info:</u><br/>
        {Object.entries(item)
          .map(
            ([key, value]) => 
              key && value && value != null && value.length !== 0 && 
                (key === "(A/R/D) Event Type" 
                || key === "(N) Named Artist(s)" 
                || key === "(E) Event Name"
                || key === "(Y) Date"
                || key === "Label"
                || key === "Producer"
                || key === "Location"
                || key === "AudioSource"
                || key === "Musicians (instruments)"
                || key === "Composition"
                || key === "Composer(s)"
                || key === "Observations"
                || key === "Track Title"
                || key === "Track #"
                || key === "Duration"
                ) 
              ? ( <p className={"mx-[1em]"} key={key}> 
                  {key === "(Y) Date" 
                    ? "Recording Date" 
                    : key.replace("(A/R/D)","").replace("(E) Event Name","Recording").replace("(N) Named Artist(s)","Artist(s)")}
                    {": "}
                    {key === "(Y) Date" ? `${value.substr(5, 4)}/${value.substr(3, 2)}/${value.substr( 1, 2 )}` : value}
                </p> ) 
              : ( <></> )
        )}
      </>
    );
  }
  const handleClickShowPianoRoll = (item) => {
    console.log("handleClickShowPianoRoll - item: ",item);         
    setContentExpandedRow( <PianoRoll notes={item.arrNotes} occurrences={item.arrTime} durations={item.arrDurations} width={600} height={200} /> );
  }
  const hidePianoRoll = () => {
    setContentExpandedRow(<></>)
  }

  const handleClickShowShared = (item, columnName) => {
    setContentExpandedRow(<></>);
    // We have records of annotations being: 
    // recording
    // track
    // sample
    // search (not here)
    // workflow (not here)
    const annotationType = (columnName==="(E) Event Name")?"recording":(columnName==="Track Title")?"track":(columnName==="Pattern")?"sample":columnName;
    console.log("handleClickShowShared - item: ", item,", columnName: ", columnName, ", annotationType: ",annotationType);
    const infoSearch = oldSearch + "_fArtist(" + textFilterArtist + ")_fRecording(" + textFilterRecording + ")_fTrack(" + textFilterTrack + ")_fPerc(" + percMatch + ")";

    const activeLognumber = item.lognumber;
    const activeRecording = item["(N) Named Artist(s)"];
    const activeTrack = item.track;
    // For annotation, we change the system, with a string that is unique based on artist-event_name-track (all spaces changed to _)
    const codeAnnotationRecording =  item["(E) Event Name"].replaceAll(' ','_') 
    + item["(E) Event Name"].replaceAll(' ','_')+'-'
    const codeAnnotationTrack =  item["(E) Event Name"].replaceAll(' ','_') 
    + item["(E) Event Name"].replaceAll(' ','_')+'-'
    + item["Track Title"].replaceAll(' ','_');
    const codeAnnotationSample =  item["(E) Event Name"].replaceAll(' ','_') 
    + item["(E) Event Name"].replaceAll(' ','_')+'-'
    + item["Track Title"].replaceAll(' ','_') +'-'
    + item.arrNotes.toString().replaceAll(',','_');
    const infoAnnotation = (columnName==="(E) Event Name")
      ?codeAnnotationRecording
      :(columnName==="Track Title")
        ?codeAnnotationTrack
        :(columnName==="Pattern")
        ? codeAnnotationSample
        :infoSearch;
    const mongoObjId = item._id;

    console.log("infoAnnotation: ", infoAnnotation);
    console.log(`item.arrIdNotes: ${item.arrIdNotes}`);
    console.log(`item.arrIdNotes[0]: ${item.arrIdNotes[0]}`);

    setContentExpandedRow(
      <>
        {/* Content for {annotationType}. */}
        <AnnotationSystem 
          type={annotationType} 
          info={infoAnnotation}
          recording={activeRecording}
          idCaller={mongoObjId}
          recordingCode={activeLognumber}
          trackCode={activeTrack}
        />
        {typeof (localStorage.token) !== 'undefined' &&
          <EmbeddedWorkflowInteraction
            // idCaller={infoAnnotation}
            idCaller={item.arrIdNotes[0]} // TODO assess if this was the right approach...
            typeCaller={annotationType}
          />
          }
      </>
    )
  }

  console.log("-- prettyNamesLogNumber: ", prettyNamesLogNumber, ", infoMusicList: ", infoMusicList, ", listSearchRes: ", listSearchRes);
  const [aggregateMatch,setAggregateMatch] = useState(null);
  const [isAggregateMatchReady, setIsAggregateMatchReady] = useState(false);

  // TODO Seems ok. But note that years don't seem to match... One (E) Event Name can have several years. To update
  const calculateAggregateMatch = (infoMusicList, listSearchRes, prettyNamesLogNumber) => {
    console.log("calculateAggregateMatch - ",{infoMusicList, listSearchRes, prettyNamesLogNumber});

    let infoMatches = [];
    for (let i in listSearchRes) { 
        let info = infoMusicList.filter(a => a.SJA_ID === listSearchRes[i].track.replace('-T','_'))[0]
        let merged = {...listSearchRes[i], ...info}
        infoMatches.push(merged);
    }
    console.log("seems ok: ",infoMatches);
    return infoMatches;    


  }

  // const [showDetails, setShowDetails] = useState(new Array(aggregateMatch.length).fill(false));
  // const [prevSelectedIndex, setPrevSelectedIndex] = useState(null);
  const [showPianoRoll, setShowPianoRoll] = useState(new Array(listSearchRes.length).fill(false));

  // const handleHideInfo = () => { setClickedCell(null); };
  const [expandedRow, setExpandedRow] = useState(new Array(listSearchRes.length).fill(false));
  const [contentExpandedRow, setContentExpandedRow] = useState(<>Test expanded row</>);
  const [datatTest, setDataTest] = useState("");
  const handleExpand = async (index, columnName = "", item = null) => {
    console.log("handleExpand: ", { index, columnName, item });
    if (item === null) {
      console.error("For handleExpand: The item is null");
    } else {
      // Based on the cell clicked, we adapt the content of the new row.
      if (columnName === "Play Mp3") {
        handleClickPlayMp3(item);
      } else if (columnName === "Play MIDI") {
        handleClickPlayMIDI(item);
      } else {
        // If the user clicks on the same cell, we should close it        
        if (columnName === prevColumn) { 
          setExpandedRow(<></>)
          setPrevColumn('');
        } else {
          setPrevColumn(columnName);
          if (columnName === "Piano Roll") {
            handleClickShowPianoRoll(item);
          } else{
            hidePianoRoll();
            setExpandedRow(new Array(aggregateMatch.length).fill(false)); // reset all expanded rows to false          
            if (columnName === "Details") {
              handleClickShowDetails(item);
            } else  {
              console.log("Default case. Should not happen. Or work in progress");
              setExpandedRow(new Array(aggregateMatch.length).fill(false)); // reset all expanded rows to false
              handleClickShowShared(item, columnName);

              try {
                // Fetch information
                // const additionalInfo = await testHelloWorld(setDataTest); // won't work unless we update the back-end and VPN is off.
                // console.log("datatTest: ", datatTest);
                setExpandedRow((prevState) => ({ ...prevState, [index]: true }));
              } catch (error) {
                console.error("Error fetching additional information:", error);
              }
            }
          }
          setExpandedRow(new Array(aggregateMatch.length).fill(false)); // all to false
          setExpandedRow((prevState) => ({ ...prevState, [index]: true })); // true for index we clicked on        
        }
      }
    }
  };


  const [mp3Exist, setMp3Exist] = useState({})
  useEffect(() => {
    console.log("in useEffect");
    const newAggregateMatch = calculateAggregateMatch(infoMusicList, listSearchRes, prettyNamesLogNumber);
    setAggregateMatch(newAggregateMatch);
    setIsAggregateMatchReady(true);
  }, []);

  useEffect(() => {
    console.log("useEffect of aggregateMatch: ", aggregateMatch);
    if (aggregateMatch !== null) {
      let track_ids = aggregateMatch.map(a => a.track);
      const sja_ids = [...new Set(track_ids.map(
        text => text.split('-')[0] + '_' + text.split('-')[1].replace('T', '')
      ))];
      console.log("sja_ids: ", sja_ids);

      // I suppose a loop here would be awful. Maybe to do on the back-end...
      const fetchData = async () => {
        try {
          // TODO update doMp3exist with new structure? Or should it only be backend?
          const result = await 
            // doMp3exist(sja_ids, setMp3Exist);
            doMp3exist(aggregateMatch, setMp3Exist);
          console.log("result: ", result, ", mp3Exists: ", mp3Exist);
        } catch (error) {
          console.error('Error fetching data:', error);
          setMp3Exist(false); // Set mp3Exists to false in case of an error
        }
      };
      fetchData();
    }
  }, [aggregateMatch])
  useEffect(() => {
    console.log("mp3Exist changed:", mp3Exist);
  }, [mp3Exist]);
  

  return (
    <>    
    <div className="inline h-[45rem] bg-gray-100">
      {/* Sidebar with recording tabs */}
      {/* <div className="w-1/8 p-4 overflow-y-auto custom-scrollbar"> */}
      <div className="overflow-y-auto custom-scrollbar">
        <table>
          <thead> <tr>
              <th>Artist(s)</th>
              <th>Recording</th>
              <th>Track Title</th>
              <th>Event Year</th>
              <th>Release Year</th>
              <th>Pattern</th>
              <th>Details</th>
              <th>Piano Roll</th>
              <th>Play Mp3</th>
              <th>Play MIDI</th>
          </tr> </thead>
          <tbody>
            {/* <tr> <td>TEXT NOTE 1</td> <td>TEXT NOTE 2</td> <td>TEXT NOTE 3</td> <td>TEXT NOTE 4</td> <td>TEXT NOTE 5</td> <td>TEXT NOTE 6 blablablablablablabla blablablablablabla</td> <td>TEXT NOTE 7 blablablablablablabla blablablablablabla</td> <td>TEXT NOTE 8 blablablablablablabla blablablablablabla</td> <td>TEXT NOTE 9 blablablablablablabla blablablablablabla</td> </tr> */}
            {isAggregateMatchReady 
            ? aggregateMatch.map((item, index) => (
              <>
              <tr key={index} className={index%2===0 ? 'bg-stone-300' : null}>
                <td> {item['(N) Named Artist(s)']} </td>
                <td className="icon clickableCell"  onClick={() => handleExpand(index,'(E) Event Name',item)}> {item['(E) Event Name']} </td>
                <td className="icon clickableCell"  onClick={() => handleExpand(index,'Track Title',item)}> {item['Track Title']} </td>
                <td>{item['Event Year']}</td>
                <td>{item['Release Year']}</td>
                <td className="icon clickableCell" onClick={() => handleExpand(index,'Pattern',item)} >
                  {item.arrNotes.map((a, i) => MIDItoNote[a].replaceAll("s", "")).toString().replaceAll(",", "-")}
                </td>
                <td className="icon clickableCell"  onClick={() => handleExpand(index,'Details',item)}> <BsFillInfoCircleFill/> </td>
                <td className="icon clickableCell"  onClick={() => handleExpand(index,'Piano Roll',item)}> {showPianoRoll[index] ? <BiHide/> : <MdPiano/> } </td>
                {/* <td>STUFF</td> */}
                {/* {item.SJA_ID} */}
                {mp3Exist[item.SJA_ID]
                  ? <td className="icon clickableCell"  onClick={() => 
                      handleExpand(index,'Play Mp3',item)}> <FaMusic /> 
                    </td>
                  : <td className="text-slate-400"> <RxCross1 /> </td>
                }
                <td className="icon clickableCell"  onClick={() => handleExpand(index,'Play MIDI',item)}> <FiPlayCircle/> </td>
              </tr>
              {expandedRow[index] && (
                <tr className={index%2===0 ? 'bg-stone-300' : null}>
                  <td colSpan="9" className={'border-dotted border-black'}>
                    {contentExpandedRow}
                  </td>
                </tr>)}
              </>
              )
            )
            : (
              <tr>
                <td colSpan="9">Loading...</td>
              </tr>
            )                
          }
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default MyTabbedInterface;