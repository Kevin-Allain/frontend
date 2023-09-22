import React, { useState, useRef, useEffect } from "react";
// import SimpleBar from 'simplebar-react';
// import 'simplebar-react/dist/simplebar.min.css';
import "./MyTabbedInterface.css";
import { AiOutlineLoading } from "react-icons/ai";
import TrackRes from "./TrackRes"; // You should adjust the import path
import AnnotationSystem from "../Annotation/AnnotationSystem";
import EmbeddedWorkflowInteraction from "../Workflow/EmbeddedWorkflowInteraction";
import MetadataAccordion from "./MetadataAccordion";

const MyTabbedInterface = ({
  listLogNumbers,
  findMatchRecording,
  infoRecordingTrackList,
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

  let tracksForEvent = [];
  let newStruct = [];
  let prettyNamesLogNumber = [];

  // Use useEffect to log the updated value of activeRecording
  useEffect(() => {
    console.log("useEffect activeRecording: ", activeRecording);
  }, [activeRecording]);
  useEffect(() => {
    console.log("useEffect activeTrack: ", activeTrack);
  }, [activeTrack]);

  const handleRecordingClick = (recording) => {
    console.log(
      "~~ handleRecordingClick, recording: ",
      recording,
      " ---- listSearchRes: ",
      listSearchRes,
      ", listLogNumbers: ",
      listLogNumbers
    );
    setActiveRecording(recording);
    console.log("activeRecording: ", activeRecording);
    setActiveTrack(null); // Reset the active track when a new recording is selected
  };

  const handleTrackClick = (track) => {
    console.log(
      "~~ handleTrackClick, track: ",
      track,
      ", typeof track: ",
      typeof track,
      ", activeRecording: ",
      activeRecording
    );
    setActiveTrack(track);
    console.log("activeTrack: ", activeTrack);
  };

  useEffect(() => {
    console.log(
      "||| >>> MyTabbedInterface. useEffect - listLogNumbers: ",
      listLogNumbers,
      ", infoRecordingTrackList: ",
      infoRecordingTrackList,
      ", listSearchRes: ",
      listSearchRes
    );
    // We will need a new structure!
    // -> Merge by event name if the lognumber has SJA?
    // -> Problem: lognumber is unique for same event if different time. We should not fix this. It is how the data is set... and that's it.
    // Or: the display of the recording displays the event and year, as based per lognumber. Still sounds confusing for the workflow.

    const mergedData = {};
    infoRecordingTrackList.forEach((item) => {
      const eventName = item["(E) Event Name"];
      const trackNumber = item["Track #"];
      const lognumber = item["lognumber"];
      if (eventName) {
        if (!mergedData[eventName]) {
          mergedData[eventName] = { tracks: [] };
        }
        if (!mergedData[eventName].tracks[trackNumber]) {
          mergedData[eventName].tracks[trackNumber] = [];
        }
        mergedData[eventName].tracks[trackNumber].push(item);
      } else if (lognumber) {
        if (!mergedData[lognumber]) {
          mergedData[lognumber] = { tracks: [] };
        }
        // Calculate the trackNumber based on the number of existing tracks
        const nextTrackNumber = mergedData[lognumber].tracks.length;
        if (!mergedData[lognumber].tracks[nextTrackNumber]) {
          mergedData[lognumber].tracks[nextTrackNumber] = [];
        }
        mergedData[lognumber].tracks[nextTrackNumber].push(item);
      }
    });
    const result = Object.values(mergedData);
    console.log("result: ", result);

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
    console.log("newStruct: ", newStruct, ", listTracks: ", listTracks);

    console.log("unique lognumber from infoRecordingTrackList: ", new Set(infoRecordingTrackList.map(a => a.lognumber)));

    listLogNumbers.forEach(lognumber => {
      infoRecordingTrackList.map( a=> (a.lognumber === lognumber) && (a["SJA ID"])?prettyNamesLogNumber.push(a["(E) Event Name"]+' '+a["Event Year"]+'/'+a["Event Month"]+'/'+a["Event Day"]):a.lognumber);
    })
    let uniqueListLogNumbers = [...new Set(listLogNumbers)];
    let uniquePrettyNamesLogNumber = [...new Set(prettyNamesLogNumber)];
    console.log("|| uniqueListLogNumbers: ",uniqueListLogNumbers,", uniquePrettyNamesLogNumber: ",uniquePrettyNamesLogNumber);
  });

  return (
    <div className="flex h-[40rem] bg-gray-100">
      {/* Sidebar with recording tabs */}
      <div className="w-1/8 p-4 overflow-y-auto custom-scrollbar">
        <h2 className="text-lg font-semibold mb-4">Recordings</h2>
        <ul>
          {listLogNumbers &&
            listLogNumbers
              .sort()
              .map((recording) => (
                <li
                  key={recording}
                  className={`text-sm cursor-pointer mb-2 ${
                    activeRecording === recording ? "text-orange-500" : ""
                  }`}
                  onClick={() => handleRecordingClick(recording)}
                >
                  {recording}
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
          {/* {activeRecording && recordingData[activeRecording].map((track) => ( <li key={track} className={`cursor-pointer mb-2 ${ activeTrack === track ? "text-orange-500" : "" }`} onClick={() => handleTrackClick(track)} > {track} </li> ))} */}
          {tracksForEvent && activeRecording &&
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
            )}
        </ul>
      </div>

      {/* Content based on active recording and track */}
      <div className="w-3/4 p-4 overflow-y-auto custom-scrollbar">
        {activeRecording && activeTrack && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {activeRecording} - {activeTrack}
            </h2>

            {/* Accordion for Recording AND Track */}
            <div className="border rounded border-2 mb-[0.5rem]">
              <MetadataAccordion
                content={listSearchRes[0].arrIdNotes[0]}
                info={activeRecording}
                findMatchRecording={findMatchRecording}
                infoRecordingTrackList={infoRecordingTrackList}
                structData={
                  newStruct[
                    newStruct.findIndex(
                      (a) => a.recordingName === activeRecording
                    )
                  ]
                }
              />
            </div>
            {/* We should change TrackRes I think... */}
            <TrackRes
              key={"Track_" + activeTrack}
              text={activeTrack}
              // TODO CRITICAL UPDATE THIS...!
              listSearchRes={listSearchRes.filter(
                (a) => a.recording === activeTrack
              )}
              formatAndPlay={formatAndPlay}
              getMusicInfo={getMusicInfo}
              infoRecordingTrackList={infoRecordingTrackList}
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
