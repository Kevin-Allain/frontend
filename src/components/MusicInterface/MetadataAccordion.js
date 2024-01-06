import React, { useState, useEffect } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import AnnotationSystem from '../Annotation/AnnotationSystem';
import EmbeddedWorkflowInteraction from '../Workflow/EmbeddedWorkflowInteraction';
import { AiOutlineLoading } from 'react-icons/ai'

const MetadataAccordion = ({
    content,recording, track, findMatchRecording = null, infoMusicList = null, structData = null, 
    setBlockToggles=null,
    expandedRecording=null,
    setExpandedRecording=null,
    expandedTrack=null,
    setExpandedTrack=null
}) => {

    console.log('# MetadataAccordion: ',{recording, track, content, findMatchRecording, infoMusicList, structData});

    // console.log( "Issue with this: ", Object.entries( infoMusicList
    //       .filter((a) => a.lognumber === recording)
    //       .filter((a) => a["SJA_ID"] === track.replace("-T", "_"))[0] )
    // );

    // const [expandedRecording, setExpandedRecording] = useState(false);
    const toggleAccordionRecording = () => { setExpandedRecording(!expandedRecording); };
    // const [expandedTrack, setExpandedTrack] = useState(false);
    const toggleAccordionTrack = () => { setExpandedTrack(!expandedTrack); };
    const [mongoObjId, setMongoObjId] = useState(content);

    const [metaObjId, setMetaObjId] = useState(Object.entries(
      infoMusicList
        .filter((a) => a.lognumber === recording)
        .filter((a) => a["SJA_ID"] === track.replace("-T", "_"))
    )[0]?.[1]?._id);

    if (typeof metaObjId === 'undefined'){setMetaObjId([])}
    console.log("|| metaObjId: ",metaObjId);

    useEffect(() => {
      setMongoObjId(content);
      setMetaObjId(
        Object.entries(
          infoMusicList
            .filter((a) => a.lognumber === recording)
            .filter((a) => a["SJA_ID"] === track.replace("-T", "_"))
        )[0]?.[1]?._id
      );
      if (typeof metaObjId === 'undefined'){setMetaObjId([])}
      console.log("useEffect MetadataAccordion. track: ",track,", mongoObjId: ",mongoObjId,", metaObjId: ",metaObjId);
    }, [content, recording, track, infoMusicList, mongoObjId, metaObjId]);


    // TODO doubt about this...
    useEffect(() => {
      console.log("useEffect MetadataAccordion ~ ",{setBlockToggles, setExpandedRecording, setExpandedTrack});
    }, [setBlockToggles, setExpandedRecording, setExpandedTrack]);  

    console.log("> mongoObjId: ",mongoObjId,", content: ",content,", metaObjId: ",metaObjId); // TODO wrong!!! Doesn't adapt. Might need to use content directly

    return (
      <div className="metadata-accordion ">
      <div> content: {content}, recording: {recording}, track: {track},  mongoObjId: {mongoObjId}, metaObjId: {metaObjId} </div>
        <div className="metadata-header flex" onClick={toggleAccordionRecording} >
          <div className="metadata-title font-semibold"> Recording Interaction and Metadata </div>
          {expandedRecording ? ( <FaAngleUp className="metadata-icon" /> ) : ( <FaAngleDown className="metadata-icon" /> )}
        </div>
        {expandedRecording && (
          <div className="metadata-content">
            {infoMusicList !== null ? (
              infoMusicList.length === 0 ? (
                <AiOutlineLoading className="spin" size={"20px"} />
              ) : findMatchRecording(recording) !== -1 ? (
                <div className="detailResultMeta">
                  <u>Info about recording:</u>
                  {/* Full display set for testing */}
                  {/* {Object.entries(infoMusicList.filter(a => a.lognumber === recording)[0]) .map(([key, value]) => ( (value.length !== 0 ) ? <p key={key}> {key}: {value}</p> : <></> ))} <br/><hr /><br/> */}
                  {Object.entries(
                    infoMusicList.filter((a) => a.lognumber === recording)[0]
                  ).map(([key, value]) =>
                    key && value && value!= null && value.length !== 0 &&
                    (key === "(A/R/D) Event Type" ||
                      key === "(N) Named Artist(s)" ||
                      (key === "(E) Event Name") | (key === "(Y) Date") ||
                      key === "Label" ||
                      key === "Producer" ||
                      key === "Location" ||
                      key === "AudioSource" ||
                      key === "Musicians (instruments)" ||
                      key === "Composition" ||
                      key === "Composer(s)" ||
                      key === "Observations") ? (
                      <p key={key}>
                        {key === "(Y) Date" ? "Recording Date" : key}:{" "}
                        {key === "(Y) Date"
                          ? `${value.substr(5, 4)}/${value.substr(
                              3,
                              2
                            )}/${value.substr(1, 2)}`
                          : value}
                      </p>
                    ) : (
                      <></>
                    )
                  )}
                </div>
              ) : ( <> <div className="text-left"> No metadata about the recording </div> <br /> </> )
            ) : ( <></> )}
            <AnnotationSystem
              type={"recording"}
              recording={recording}
              idCaller={mongoObjId}
              recordingCode={recording}
              trackCode={track}
              metaObjId={metaObjId}
            />
            <EmbeddedWorkflowInteraction
              idCaller={content}
              typeCaller={"recording"}
            />
          </div>
        )}
        <hr />
        <div className="metadata-header flex" onClick={toggleAccordionTrack}>
          <div className="metadata-title font-semibold">
            Track Interaction and Metadata
          </div>
          {expandedTrack ? (
            <FaAngleUp className="metadata-icon" />
          ) : (
            <FaAngleDown className="metadata-icon" />
          )}
        </div>
        {/* We want to display attributes (if they exist)
            - Track Title - Track # - Duration
             */}
        {expandedTrack && (
          <div className="metadata-content">
            <div className="detailResultMeta">
              <u>Info about track:</u>
              {infoMusicList !== null ? (
                infoMusicList.length === 0 ? (
                  <AiOutlineLoading className="spin" size={"20px"} />
                ) : infoMusicList
                    .filter((a) => a.lognumber === recording)
                    .filter((a) => a["SJA_ID"] === track.replace("-T", "_"))
                    .length === 0 ? (
                  <>
                    <div className="text-left">
                      No metadata about the track.
                      {/* (or a BGR. Track: {track}) */}
                    </div>
                    <br />
                  </>
                ) : (
                  Object.entries(
                    infoMusicList
                      .filter((a) => a.lognumber === recording)
                      .filter(
                        (a) => a["SJA_ID"] === track.replace("-T", "_")
                      )[0]
                  ).map(([key, value]) =>
                    key &&
                    value &&
                    value.length !== 0 &&
                    (key === "Track Title" ||
                      key === "Track #" ||
                      key === "Duration") ? (
                      <p key={key}>
                        {" "}
                        {key}: {value}{" "}
                      </p>
                    ) : (
                      <></>
                    )
                  )
                )
              ) : (
                <></>
              )}
            </div>
            <AnnotationSystem
              type={"track"}
              track={track}
              idCaller={mongoObjId}
              recordingCode={recording}
              trackCode={track}
            />
            <EmbeddedWorkflowInteraction
              idCaller={content}
              typeCaller={"track"}
            />
          </div>
        )}
      </div>
    );
};

export default MetadataAccordion;
