import React, { useState, useRef } from 'react';
// import SimpleBar from 'simplebar-react';
// import 'simplebar-react/dist/simplebar.min.css';
import './MyTabbedInterface.css'
import {AiOutlineLoading} from 'react-icons/ai'
import TrackRes from './TrackRes'; // You should adjust the import path
import AnnotationSystem from '../Annotation/AnnotationSystem';
import EmbeddedWorkflowInteraction from '../Workflow/EmbeddedWorkflowInteraction';
import MetadataAccordion from './MetadataAccordion';

const MyTabbedInterface = ({
  listLogNumbers,
  lognumbersRefs,
  scrollToButtonListLogsNumbers,
  findMatchRecording,
  infoMusicList,
  listTracks,
  scrollToButtonListRecordingsFollowing,
  scrollToButtonListTracksFollowing,
  listSearchRes,
  formatAndPlay,
  getMusicInfo,
  setInfoMusicList,
  testPerformances=false
}) => {
  const [activeRecording, setActiveRecording] = useState(null);
  const [activeTrack, setActiveTrack] = useState(null);

  const [visibleTracks, setVisibleTracks] = useState({});
  const tracksContainerRef = useRef(null);

  // Mock data for recordings, tracks, and samples
  const recordings = [ "Recording 1", "Recording 2", "Recording 3", "Recording 21", "Recording 4", "Recording 22", "Recording 5", "Recording 23", "Recording 6", "Recording 24", "Recording 7", "Recording 25", "Recording 8", "Recording 26", "Recording 9", "Recording 27", "Recording 10", "Recording 28", "Recording 11", "Recording 32", "Recording 12", "Recording 312", "Recording 13", "Recording 332",];
  const recordingData = { "Recording 1": ["Track 1", "Track 2"], "Recording 2": ["Track A", "Track B"], "Recording 3": [ "Track A", "Track B", "Track 1", "Track 2", "Track C","Track D", "Track E", ], };
  const trackData = { "Track 1": ["Sample A", "Sample B"], "Track 2": ["Sample X", "Sample Y"], "Track A": ["Sample Alpha", "Sample Beta"], "Track B": ["Sample Gamma", "Sample Delta"], "Track C": ["Sample Gamma", "Sample Delta"], "Track D": ["Sample Gamma", "Sample Delta"], "Track E": ["Sample Gamma", "Sample Delta"], };

  const handleRecordingClick = (recording) => {
    setActiveRecording(recording);
    setActiveTrack(null); // Reset the active track when a new recording is selected
  };

  const handleTrackClick = (track) => {
    setActiveTrack(track);
  };

  console.log("MyTabbedInterface - listLogNumbers: ",listLogNumbers,", infoMusicList: ",infoMusicList
  ," - infoMusicList[2]: ",infoMusicList[2],", infoMusicList['2']: ",infoMusicList['2']
  ,", listSearchRes: ",listSearchRes);

  // We will need a new structure!
  // -> Merge by event name if the lognumber has SJA?
  const mergedData = {};

  infoMusicList.forEach((item) => {
    const eventName = item["(E) Event Name"];
    const trackNumber = item["Track #"];
    const lognumber = item["lognumber"];
    if (eventName) {
      if (!mergedData[eventName]) {
        mergedData[eventName] = { tracks: [], };
      }
      if (!mergedData[eventName].tracks[trackNumber]) {
        mergedData[eventName].tracks[trackNumber] = [];
      }
      mergedData[eventName].tracks[trackNumber].push(item);
    } else if (lognumber) {
      if (!mergedData[lognumber]) {
        mergedData[lognumber] = { tracks: [], };
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
  console.log(result);

  let keysEvents = Object.keys(mergedData)
  let valsEvents = Object.values(mergedData)
  let tracksForEvent = [];
  for (var d in mergedData) {
    const tracks = mergedData[d].tracks.filter((a) => typeof a !== 'undefined');    
    // Use concat to flatten the second level arrays
    const flattenedTracks = [].concat(...tracks);
    tracksForEvent.push(flattenedTracks);
  }
    
  console.log({keysEvents, tracksForEvent });

  return (
    <div className="flex h-[40rem] bg-gray-100">
      {/* Sidebar with recording tabs */}
      <div className="w-1/8 p-4 overflow-y-auto custom-scrollbar">
        <h2 className="text-lg font-semibold mb-4">Recordings</h2>
        <ul>
          {keysEvents &&
            keysEvents
              .sort((a, b) => a - b)
              .map((recording) => (
                <li
                  key={recording}
                  className={`text-sm cursor-pointer mb-2 ${
                    activeRecording === recording ? "text-orange-500" : ""
                  }`}
                  onClick={() => handleRecordingClick(recording)}
                >
                  {/* {(recording.length>30)? recording.substring(0,30)+'...':recording} {findMatchRecording(recording)}  */}
                  {/* {recording.includes("SJA_")
                    ? infoMusicList[findMatchRecording(recording)]
                      ? infoMusicList[findMatchRecording(recording)][
                          "(E) Event Name" ] + (infoMusicList[findMatchRecording(recording)][ "Event Month" ]
                          ? " M" + infoMusicList[findMatchRecording(recording)][ "Event Month" ] : "") +
                        " " + infoMusicList[findMatchRecording(recording)][ "Event Year" ]
                      : "No match somehow for number: " + findMatchRecording(recording) : recording} */}
                  {recording}
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
            tracksForEvent.length > 0 &&
            tracksForEvent[keysEvents.indexOf(activeRecording)].map((a, i) =>
              typeof a["(E) Event Name"] === "undefined" ? (
                <li
                  key={a + "" + i}
                  className={`text-sm cursor-pointer mb-2 ${
                    activeTrack === a + "" + i ? "text-orange-500" : ""
                  }`}
                  onClick={() => handleTrackClick(a + "" + i)}
                >
                  Track bgr
                </li>
              ) : (
                <li
                  key={a["Track Title"]}
                  className={`text-sm cursor-pointer mb-2 ${
                    activeRecording === a["Track Title"]
                      ? "text-orange-500"
                      : ""
                  }`}
                  onClick={() => handleRecordingClick(a["Track Title"])}
                >
                  {a["Track Title"]}
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
              {activeRecording} - {activeTrack.split("-")[1]}
            </h2>

            {/* Accordion for Recording and Track */}
            <div className="border rounded border-2 mb-[0.5rem]">
              <MetadataAccordion
                title="Recording Interaction and Metadata"
                type={"recording"}
                content={listSearchRes[0].arrIdNotes[0]}
                info={activeRecording}
                findMatchRecording={findMatchRecording}
                infoMusicList={infoMusicList}
              />
            </div>
            <div className="border rounded border-2 mb-[0.5rem]">
              <MetadataAccordion
                title="Track Interaction"
                type={"track"}
                content={listSearchRes[0].arrIdNotes[0]}
                info={activeTrack}
                findMatchRecording={findMatchRecording}
              />
            </div>

            {/* We should change TrackRes I think... */}
            <TrackRes
              key={"Track_" + activeTrack}
              text={activeTrack}
              listSearchRes={listSearchRes.filter(
                (a) => a.recording === activeTrack
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
