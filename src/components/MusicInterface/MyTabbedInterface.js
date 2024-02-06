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
    <div className="inline h-[45rem] bg-gray-100">
      {/* Sidebar with recording tabs */}
      {/* <div className="w-1/8 p-4 overflow-y-auto custom-scrollbar"> */}
      <div className="overflow-y-auto custom-scrollbar">
        {/* <h2 className="text-lg font-semibold mb-4">Recordings</h2> */}
        {/* <h2 className="text-lg font-semibold ">Recordings</h2> */}
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
                <>
                <h2 className="font-semibold text-left mx-[0.5rem]" key={recording+'_'+ndx}>Recording: { prettyNamesLogNumber[recording].includes("03 N")
                    ? prettyNamesLogNumber[recording] 
                    : (<>
                      {prettyNamesLogNumber[recording].substring(0,prettyNamesLogNumber[recording].lastIndexOf(" "))}{" "}
                      {prettyNamesLogNumber[recording].substring(prettyNamesLogNumber[recording].lastIndexOf(" "),prettyNamesLogNumber[recording].length)}
                      </>) } 
                  </h2>
                  {/* Addition: have the Tracks listed underneath the Recordings */}
                  <hr />
                  <>
                  <div className="text-left mx-[2rem]">
                    <p className="font-semibold">Track(s)</p>
                    {/* {listSearchRes.filter(a=> a.lognumber === activeRecording).map(a => a.track)}  */}
                    {/* This should be changed to a table structure I think... */}
                    {[
                      ...new Set( listSearchRes
                          .filter((a) => a.lognumber === recording)
                          .map((a) => a.track)
                      ),
                    ].map((track_id,ndx) =>                      
                      <div key={track_id+'_'+ndx} className={` mx-[2rem] cursor-pointer ${track_id} text-left}`} 
                      // onClick={() => handleTrackClick(a)} 
                      > 
                            {/* Kind of sucks... We should have a button for display of information for recording (honestly who cares about track metadata, there's none) */}
                            {/* <MetadataAccordion
                              content={listSearchRes.filter( (b) => b.track === track_id )[0].arrIdNotes[0]} 
                              recording={recording}
                              track={track_id}
                              findMatchRecording={findMatchRecording}
                              infoMusicList={infoMusicList}
                              structData={ newStruct[ newStruct.findIndex( (c) => c.recordingName === recording ) ] }
                              setBlockToggles={setBlockToggles}
                              expandedRecording={expandedRecording}
                              setExpandedRecording={setExpandedRecording}
                              expandedTrack={expandedTrack}
                              setExpandedTrack={setExpandedTrack}
                            /> */}
                            {trackToTitles[track_id]} 
                      </div>
                    )}
                    </div>
                  </>                  

                  <hr />
                
                </>
              ))}
        </ul>
      </div>

      {/* Sidebar with track tabs */}
      {/* <div className="w-1/8 p-4 overflow-y-auto custom-scrollbar">
        <h2 className="text-lg font-semibold mb-4">Tracks</h2>
        <ul>
          {activeRecording ? (
            <>
              {[
                ...new Set( listSearchRes
                    .filter((a) => a.lognumber === activeRecording)
                    .map((a) => a.track)
                ),
              ].map((a,ndx) =>
                (a.includes("SJA") || a.includes("BCC") || a.includes("BGR")) ? (
                  <> <li key={a+'_'+ndx} className={`cursor-pointer mb-2 ${a} ${activeTrack === a ? "text-orange-500" : ""}`}
                      onClick={() => handleTrackClick(a)}
                    > {" "} {trackToTitles[a]} </li> <hr /> </>
                ) : (
                  <> <li key={a+'_'+ndx} className={`cursor-pointer mb-2 ${a} ${ activeTrack === a ? "text-orange-500" : ""}`}
                      onClick={() => handleTrackClick(a)}
                    > {" "} {a} </li> <hr /> </>
                )
              )}
            </>
          ) : (
            <></>
          )}
        </ul>
      </div> */}

      {/* Content based on active recording and track */}
      {/* <div className="w-3/4 p-4 overflow-y-auto custom-scrollbar">
        {activeRecording && activeTrack && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {prettyNamesLogNumber[activeRecording]} -{" "}
              {(activeTrack.includes("SJA") || activeTrack.includes("BCC") || activeTrack.includes("BGR"))
                ? trackToTitles[activeTrack]
                : activeTrack}
            </h2>
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
      </div> */}
    </div>
  );
};

export default MyTabbedInterface;