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
}) => {
  const [activeRecording, setActiveRecording] = useState(null);
  const [activeTrack, setActiveTrack] = useState(null);
  const [visibleTracks, setVisibleTracks] = useState({});
  const tracksContainerRef = useRef(null);
  const [expandedRecording, setExpandedRecording] = useState(false);
  const [expandedTrack, setExpandedTrack] = useState(false);

  const sampler = new Tone.Sampler({
    urls: { C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", A4: "A4.mp3" }, release: 1, baseUrl: "https://tonejs.github.io/audio/salamander/",
  }).toDestination();

  const handlePlayMIDINotes = (notes, durations, times) => {
    console.log("handlePlayMIDINotes");
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
        trackToTitles[curTrack] = selecInfo[0]['Track Title']
      }
    }
    else {
      console.log("MASSIVE ISSUE. curSR: ",curSR);
    }
  }
  let filteredUniqueSearchResTracks = [];
  
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


  // const [audioMp3, setAudioMp3] = useState(
  //   new Audio(`https://jazzdap.city.ac.uk/public/sliced_audio_0_3.mp3`.replace(/ /g,"%20"))
  // );

  const playMp3Slicer = (fileNameSlicer) => {
    console.log("playMp3Slicer - fileNameSlicer: ",fileNameSlicer);
    let audioMp3 = new Audio(fileNameSlicer.replace(/ /g, "%20"));
    console.log("audioMp3: ", audioMp3);
    audioMp3.play();
  };

  const handleClickPlayMp3 = (item) => {
    console.log("handleClickPlayMp3 - item: ",item);
    // TODO slice based on audio beginning and ending
    let audioName = item["Audio Filename (Internal backup)"];
    let start = Math.floor(item.arrTime[0]);
    let end = Math.floor(item.arrTime[item.arrTime.length-1]);
    let fileNameSlicer = `https://jazzdap.city.ac.uk/public/${audioName}_${start}_${end}.mp3`
    playMp3Slicer(fileNameSlicer);
  }
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
    setContentExpandedRow(
      <>
        <PianoRoll
          notes={item.arrNotes}
          occurrences={item.arrTime}
          durations={item.arrDurations}
          width={600}
          height={200}
        />
        {/* <AnnotationSystem type={"sample"}
          info={ text.substr(text.indexOf("-") + 1) + "_" + notes + "_" + Number(text.split("-")[0]) }
          index={Number(text.split("-")[0])}
        />
        {typeof localStorage.token !== "undefined" && (
          <EmbeddedWorkflowInteraction typeCaller={"sample"} idCaller={idDBNotes[0]} indexRange={idDBNotes.length} />
        )} */}
      </>
    );
  }

  console.log("-- prettyNamesLogNumber: ", prettyNamesLogNumber, ", infoMusicList: ", infoMusicList, ", listSearchRes: ", listSearchRes);
  const aggregateMatch = [];
  for (let i in infoMusicList) {
    let matchingTracks = Object.assign({}, listSearchRes.filter(a => a.lognumber === infoMusicList[i].lognumber)[0]); // Get the first matching track
    matchingTracks["prettyName"] = prettyNamesLogNumber[infoMusicList[i].lognumber];
    let keys = Object.keys(infoMusicList[i]);
    for (let k in keys) { matchingTracks[keys[k]] = infoMusicList[i][keys[k]]; }
    // for showing details
    matchingTracks['showDetails'] = false;
    aggregateMatch.push(matchingTracks);
  }
  console.log("~ aggregateMatch: ", aggregateMatch);
  const [showDetails, setShowDetails] = useState(new Array(aggregateMatch.length).fill(false));
  const [prevSelectedIndex, setPrevSelectedIndex] = useState(null);
  const [showPianoRoll, setShowPianoRoll] = useState(new Array(aggregateMatch.length).fill(false));

  // const handleHideInfo = () => { setClickedCell(null); };
  const [expandedRow, setExpandedRow] = useState(new Array(aggregateMatch.length).fill(false));
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
        if (columnName === "Piano Roll") {
          handleClickShowPianoRoll(item);
        } if (columnName === "Details"){
          handleClickShowDetails(item);
        } else {
          console.log("Default case. Should not happen.");
          setExpandedRow(new Array(aggregateMatch.length).fill(false)); // reset all expanded rows to false
          try {
            // Fetch information
            const additionalInfo = await testHelloWorld(setDataTest); // won't work unless we update the back-end and VPN is off.
            console.log("datatTest: ", datatTest);
            setExpandedRow((prevState) => ({ ...prevState, [index]: true }));
          } catch (error) {
            console.error("Error fetching additional information:", error);
          }
        }
        setExpandedRow(new Array(aggregateMatch.length).fill(false)); // all to false
        setExpandedRow((prevState) => ({ ...prevState, [index]: true })); // true for index we clicked on
      }
    }
  };


  const [mp3Exist, setMp3Exist] = useState({})
  useEffect(() => {
    console.log("in useEffect, aggregateMatch: ",aggregateMatch);

    let track_ids = aggregateMatch.map(a=>a.track);
    const sja_ids = [...new Set(track_ids.map( 
      text => text.split('-')[0]+'_'+text.split('-')[1].replace('T','') 
    ))];
    console.log("sja_ids: ",sja_ids);

    // I suppose a loop here would be awful. Maybe to do on the back-end...
    const fetchData = async () => {
      try {
        // const result = await doesMp3exist(sja_ids[0], setMp3Exist);
        const result = await doMp3exist(sja_ids, setMp3Exist);
        console.log("result: ",result,", mp3Exists: ",mp3Exist);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMp3Exist(false); // Set mp3Exists to false in case of an error
      }
    };

    fetchData();
  }, [aggregateMatch,mp3Exist]);



  return (
    <>    
    <div className="inline h-[45rem] bg-gray-100">
      {/* Sidebar with recording tabs */}
      {/* <div className="w-1/8 p-4 overflow-y-auto custom-scrollbar"> */}
      <div className="overflow-y-auto custom-scrollbar">
        <table>
          <thead>
            <tr>
              <th>Artist(s)</th>
              <th>Recording</th>
              <th>Track Title</th>
              <th>Release Year</th>
              <th>Pattern</th>
              <th>Details</th>
              <th>Piano Roll</th>
              <th>Play Mp3</th>
              <th>Play MIDI</th>
            </tr>
          </thead>
          {/* TODO set functionalities for all columns later?! */}
          <tbody>
            {/* <tr> <td>TEXT NOTE 1</td> <td>TEXT NOTE 2</td> <td>TEXT NOTE 3</td> <td>TEXT NOTE 4</td> <td>TEXT NOTE 5</td> <td>TEXT NOTE 6 blablablablablablabla blablablablablabla</td> <td>TEXT NOTE 7 blablablablablablabla blablablablablabla</td> <td>TEXT NOTE 8 blablablablablablabla blablablablablabla</td> <td>TEXT NOTE 9 blablablablablablabla blablablablablabla</td> </tr> */}
            {aggregateMatch.map((item, index) => (
              <>
              <tr key={index} className={index%2===0 ? 'bg-stone-300' : null}>
                <td>
                  {item['(N) Named Artist(s)']}
                </td>
                <td className="icon clickableCell"  onClick={() => handleExpand(index,'(E) Event Name',item)}>
                  {item['(E) Event Name']}
                </td>
                <td className="icon clickableCell"  onClick={() => handleExpand(index,'Track Title',item)}>
                  {item['Track Title']}
                </td>
                <td>{item['Release Year']}</td>
                <td>{item.arrNotes.map((a, i) => MIDItoNote[a].replaceAll("s", "")).toString().replaceAll(",", "-")}</td>
                <td className="icon clickableCell"  onClick={() => handleExpand(index,'Details',item)}> 
                  {/* {showDetails[index] ? <FaAngleUp/> : <FaAngleDown /> } */}
                  <BsFillInfoCircleFill/>
                </td>
                <td className="icon clickableCell"  onClick={() => handleExpand(index,'Piano Roll',item)}> 
                  {showPianoRoll[index] ? <BiHide/> : <MdPiano/> }
                </td>
                <td className="icon clickableCell"  onClick={() => handleExpand(index,'Play Mp3',item)}>
                  <FaMusic />
                </td>
                <td className="icon clickableCell"  onClick={() => handleExpand(index,'Play MIDI',item)}>
                  <FiPlayCircle />
                </td>              
              </tr>
              {/* <TableRow key={index} item={item} showDetails={showDetails} setShowDetails={setShowDetails} prevSelectedIndex={prevSelectedIndex} setPrevSelectedIndex={setPrevSelectedIndex} /> */}
              {expandedRow[index] && (
                <tr className={index%2===0 ? 'bg-stone-300' : null}>
                  <td colSpan="9" className={'border-dotted border-black'}>
                    {/* {expandedRow[index]} STUFF bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla  */}
                    {contentExpandedRow}
                  </td>
                </tr>)}
              </>
              )
            )}
          </tbody>
        </table>
        {/* Approach with a different div proved difficult as the positionning is off! Considering alternatives for now.*/}
          {/* {clickedCell && (
            <AdditionalInfo
              rowData={infoMusicList[clickedCell.rowIndex]}
              position={clickedCell.position}
              onHide={handleHideInfo}
            />
          )} */}
      </div>
    </div>
    </>
  );
};

export default MyTabbedInterface;