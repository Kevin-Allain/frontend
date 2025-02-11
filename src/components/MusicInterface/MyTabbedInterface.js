import React, { useState, useRef, useEffect } from "react";
// import SimpleBar from 'simplebar-react';
// import 'simplebar-react/dist/simplebar.min.css';
import "./MyTabbedInterface.css";
import { AiOutlineLoading } from "react-icons/ai";
import TrackRes from "./TrackRes"; // You should adjust the import path
import MetadataAccordion from "./MetadataAccordion";

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

  const setBlockToggles = () => {
    setExpandedRecording(false);
    setExpandedTrack(false);
  };

  // console.log("-- MyTabbedInterface. listLogNumbers: ", listLogNumbers, ", infoMusicList: ", infoMusicList, ", listSearchRes: ", listSearchRes,", listTracks: ",listTracks);
  let prettyNamesLogNumber = {};
  for (var i = 0; i < listLogNumbers.length; i++) {
    let lognumber = listLogNumbers[i];
    // console.log("lognumber: ", lognumber);
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
  let uniqueListLogNumbers = [...new Set(listLogNumbers)];
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
  
  // ok until now

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
  // const result = Object.values(mergedData);
  // console.log("result: ", result);

  let keysEvents = Object.keys(mergedData);
  for (var d in mergedData) {
    const tracks = mergedData[d].tracks.filter(
      (a) => typeof a !== "undefined"
    );
    // Use concat to flatten the second level arrays
    const flattenedTracks = [].concat(...tracks);
    tracksForEvent.push(flattenedTracks);
  }
  keysEvents.map((a, i) =>
    newStruct.push({ recordingName: a, content: tracksForEvent[i] })
  );
  // Sort newStruct (here according to recording)
  newStruct = newStruct.sort((a, b) =>
    a.recording > b.recording ? 1 : b.recording > a.recording ? -1 : 0
  );
  // console.log("newStruct: ", newStruct, ", listTracks: ", listTracks);

  const handleRecordingClick = (recording) => {
    // console.log("~~ handleRecordingClick, recording: ", recording, " ---- listSearchRes: ", listSearchRes, ", listLogNumbers: ", listLogNumbers);
    setActiveRecording(recording);

    filteredUniqueSearchResTracks =
      [...new Set(listSearchRes.filter(a => a.lognumber === recording).map(a => a.track))];
    setActiveTrack(null); // Reset the active track when a new recording is selected
  };

  const handleTrackClick = (track) => {
    // console.log("~~ handleTrackClick, track: ",track,", typeof track: ",typeof track,", activeRecording: ",activeRecording);
    setActiveTrack(track);
    setBlockToggles();
  };

  useEffect(() => {
    console.log("MyTabbedInterface # useEffect - activeTrack: ", activeTrack);
  }, [activeTrack]);
  

  return (
    <div className="flex h-[40rem] bg-gray-100">
      {/* Sidebar with recording tabs */}
      <div className="w-1/8 p-4 overflow-y-auto custom-scrollbar">
        <h2 className="text-lg font-semibold mb-4">Recordings</h2>
        <ul>
          {listLogNumbers &&
            listLogNumbers
              .sort((a, b) => {
                // Split the strings into parts: artist, event, and date
                const partsA = a.split("_");
                const partsB = b.split("_");
                // Check if there are at least two parts (event and date) in both strings
                if (partsA.length >= 2 && partsB.length >= 2) {
                  // Compare the event parts
                  const eventComparison = partsA[1].localeCompare(partsB[1]);
                  // If the events are the same, compare the date parts
                  if (eventComparison === 0) {
                    const dateA = new Date(partsA[2]);
                    const dateB = new Date(partsB[2]);
                    return dateA - dateB;
                  }
                  return eventComparison;
                } else {
                  // If one of the strings doesn't have an underscore, compare the full strings
                  return a.localeCompare(b);
                }
              })
              .map((recording,ndx) => (
                <li
                  key={recording+'_'+ndx}
                  className={`text-sm cursor-pointer mb-2 ${recording} ${
                    activeRecording === recording ? "text-orange-500" : ""
                  }`}
                  onClick={() => handleRecordingClick(recording)}
                >
                  {prettyNamesLogNumber[recording].includes("03 N")  // || prettyNamesLogNumber[recording].includes("BGR")
                    ? prettyNamesLogNumber[recording] 
                    : (<>
                      {prettyNamesLogNumber[recording].substring(0,prettyNamesLogNumber[recording].lastIndexOf(" "))}
                      <br/>
                      {prettyNamesLogNumber[recording].substring(prettyNamesLogNumber[recording].lastIndexOf(" "),prettyNamesLogNumber[recording].length)}
                      </>)
                  }
                  <hr />
                </li>
              ))}
        </ul>
      </div>

      {/* Sidebar with track tabs */}
      <div className="w-1/8 p-4 overflow-y-auto custom-scrollbar">
        <h2 className="text-lg font-semibold mb-4">Tracks</h2>
        {/* <> {"listTracks.length: "+listTracks.length+", listTracks[0]: "+listTracks[0]} </> */}
        <ul>
          {activeRecording ? (
            <>
              {/* {listSearchRes.filter(a=> a.lognumber === activeRecording).map(a => a.track)}  */}
              {[
                ...new Set(
                  listSearchRes
                    .filter((a) => a.lognumber === activeRecording)
                    .map((a) => a.track)
                ),
              ].map((a,ndx) =>
                (a.includes("SJA") || a.includes("BCC") || a.includes("BGR")) ? (
                  <>
                    <li
                      key={a+'_'+ndx}
                      className={`cursor-pointer mb-2 ${a} ${
                        activeTrack === a ? "text-orange-500" : ""
                      }`}
                      onClick={() => handleTrackClick(a)}
                    >
                      {" "}
                      {trackToTitles[a]}
                    </li>
                    <hr />
                  </>
                ) : (
                  <>
                    <li
                      key={a+'_'+ndx}
                      className={`cursor-pointer mb-2 ${a} ${
                        activeTrack === a ? "text-orange-500" : ""
                      }`}
                      onClick={() => handleTrackClick(a)}
                    >
                      {" "}
                      {a}
                    </li>
                    <hr />
                  </>
                )
              )}
            </>
          ) : (
            <></>
          )}
        </ul>
      </div>

      {/* Content based on active recording and track */}
      <div className="w-3/4 p-4 overflow-y-auto custom-scrollbar">
        {activeRecording && activeTrack && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {prettyNamesLogNumber[activeRecording]} -{" "}
              {(activeTrack.includes("SJA") || activeTrack.includes("BCC") || activeTrack.includes("BGR"))
                ? trackToTitles[activeTrack]
                : activeTrack}
            </h2>
            {/* Accordion for Recording AND Track */}
            <div className="border rounded border-2 mb-[0.5rem]">
              <MetadataAccordion
                content={listSearchRes.filter(
                  (a) => a.track === activeTrack
                )[0].arrIdNotes[0]} 
                recording={activeRecording}
                track={activeTrack}
                findMatchRecording={findMatchRecording}
                infoMusicList={infoMusicList}
                structData={
                  newStruct[
                    newStruct.findIndex(
                      (a) => a.recordingName === activeRecording
                    )
                  ]
                }
                setBlockToggles={setBlockToggles}
                expandedRecording={expandedRecording}
                setExpandedRecording={setExpandedRecording}
                expandedTrack={expandedTrack}
                setExpandedTrack={setExpandedTrack}
              />
            </div>
            {/* We should change TrackRes I think... */}
            {/* {activeTrack} and its TrackRes: */}
            <TrackRes
              key={"Track_" + activeTrack}
              text={activeTrack}
              listSearchRes={listSearchRes.filter(
                (a) => a.track === activeTrack
              )}
              formatAndPlay={formatAndPlay}
              getMusicInfo={getMusicInfo}
              infoMusicList={infoMusicList}
              setInfoMusicList={setInfoMusicList}
              testPerformances={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTabbedInterface;