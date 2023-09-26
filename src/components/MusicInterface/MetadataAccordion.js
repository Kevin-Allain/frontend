import React, { useState, useEffect } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import AnnotationSystem from '../Annotation/AnnotationSystem';
import EmbeddedWorkflowInteraction from '../Workflow/EmbeddedWorkflowInteraction';
import { AiOutlineLoading } from 'react-icons/ai'

const MetadataAccordion = ({
    content,recording, track, findMatchRecording = null, infoMusicList = null, structData = null
}) => {

    console.log('# MetadataAccordion: ',{recording,track, content, findMatchRecording,infoMusicList,structData});
    /** About the presentation of metadata: we do not know what elements are unique between tracks sharing (E) Event Name 
     * TODO: investigate if we can assess the unique bits of the data for each lognumber... then we could present them in their distinct bits...
     * Might be worth discussing it with Pedro...
    */
    const [expandedRecording, setExpandedRecording] = useState(false);
    const toggleAccordionRecording = () => { setExpandedRecording(!expandedRecording); };
    const [expandedTrack, setExpandedTrack] = useState(false);
    const toggleAccordionTrack = () => { setExpandedTrack(!expandedTrack); };

    // useEffect(() => {
    //     console.log("--+-- MetadataAccordion: ", {  recording, content, findMatchRecording, infoMusicList, structData });
    //     // We want to loop through the content of structData, and if an attribute has the same value over all the indexes of structData, it should be in sharedRecordingInfo, both attribute name and value, otherwise it should be in uniqueTrackInfo, with index matching according to its position in structData.content
    //     // The array of uniqueTrackInfo will have the same indexes as content
    //     // let allAttributes = [];
    //     // let sharedRecordingInfo = {};
    //     // let uniqueTrackInfo = [];
    //     let sharedRecordingInfo = {};
    //     let uniqueTrackInfo = [];
    //     for (const attr in structData.content[0]) {
    //       if (structData.content[0].hasOwnProperty(attr)) {
    //         const isShared = structData.content.every(track => track[attr] === structData.content[0][attr]);
    //         if (isShared) { sharedRecordingInfo[attr] = structData.content[0][attr]; }
    //       }
    //     }
    //     uniqueTrackInfo = structData.content.map(track => {
    //       const uniqueInfo = {};
    //       for (const attr in track) {
    //         if (track.hasOwnProperty(attr) && !sharedRecordingInfo[attr]) { uniqueInfo[attr] = track[attr]; }
    //       }
    //       return uniqueInfo;
    //     });
    //     console.log("Shared Recording Info:", sharedRecordingInfo); console.log("Unique Track Info:", uniqueTrackInfo);
    // });

    return (
        <div className="metadata-accordion ">
            <div className="metadata-header flex" onClick={toggleAccordionRecording}>
                <div className="metadata-title font-semibold">Recording Interaction and Metadata</div>
                {expandedRecording ? (
                    <FaAngleUp className="metadata-icon" />
                ) : (
                    <FaAngleDown className="metadata-icon" />
                )}
            </div>
            {expandedRecording &&
                (<div className="metadata-content">
                    {infoMusicList !== null ? (
                        infoMusicList.length === 0 ? (<AiOutlineLoading className='spin' size={'20px'} />) :
                        findMatchRecording(recording) !== -1 ? (
                            <div className='detailResultMeta'>
                                <u>Info about recording:</u>
                                <hr />
                                {Object.entries(infoMusicList.filter(a => a.lognumber === recording)[0])
                                    .map(([key, value]) => (
                                        (value.length !== 0 ) ? <p key={key}> {key}: {value}</p> : <></>
                                    ))}
                                <br/><hr /><br/>
                                {/* TODO remove comments after testing. */}
                                {Object.entries(infoMusicList.filter(a => a.lognumber === recording)[0])
                                    .map(([key, value]) => (
                                        (value.length !== 0 
                                            // && (key === '(A/R/D) Event Type' || key === '(N) Named Artist(s)'
                                            //     || key === '(E) Event Name' || key === '(Y) Date'
                                            //     || key === 'Label' || key === 'AudioSource' || key === 'Musicians (instruments)'
                                            // )
                                        ) ?
                                            <p key={key}> {key}: {value}</p>
                                            : <></>
                                    ))}
                            </div>
                        )
                            : (<><div className='text-left'>No metadata about the recording</div><br /></>)
                ) : <></>
                    }
                    <AnnotationSystem type={"recording"} recording={recording} />
                    <EmbeddedWorkflowInteraction idCaller={content} typeCaller={"recording"} />
                </div>)
            }
            <hr/>
            <div className="metadata-header flex" onClick={toggleAccordionTrack}>
                <div className="metadata-title font-semibold">Track Interaction and Metadata</div>
                {expandedTrack ? (
                    <FaAngleUp className="metadata-icon" />
                ) : (
                    <FaAngleDown className="metadata-icon" />
                )}
            </div>
            {expandedTrack &&
                (<div className="metadata-content">
                    {infoMusicList !== null ? (
                        infoMusicList.length === 0 ? (<AiOutlineLoading className='spin' size={'20px'} />) :
                            infoMusicList.filter(a => a.lognumber === recording).filter(a => a['SJA ID'] === track.replace('-T','_')).length === 0 ? <><div className='text-left'>No metadata about the track (or a BGR. Track: {track})</div><br /></>
                                : infoMusicList.filter(a => a.lognumber === recording).filter(a => a['SJA ID'] === track.replace('-T','_'))[0]['Track Title']
                                // .map(a =>
                                //     <div className='detailResultMeta'>
                                //         <u>Info about track:</u>
                                //         {Object.entries(a
                                //             .filter(a => a.lognumber === recording)
                                //             .filter(a => a['SJA ID'] === track.replace('-T','_')))[0]
                                //             .map(([key, value]) => (
                                //                 (value.length !== 0) ?
                                //                     <p key={key}> {key}: {value}</p>
                                //                     : <></>
                                //             ))}
                                //     </div>
                                // )
                    ) : <></>
                    }
                    {/* TODO this seems wrong...?! */}
                    <AnnotationSystem type={"track"} track={track} />
                    <EmbeddedWorkflowInteraction idCaller={content} typeCaller={"track"} />
                </div>)
            }


        </div>
    );
};

export default MetadataAccordion;
