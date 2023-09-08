import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import AnnotationSystem from '../Annotation/AnnotationSystem';
import EmbeddedWorkflowInteraction from '../Workflow/EmbeddedWorkflowInteraction';
import { AiOutlineLoading } from 'react-icons/ai'

const MetadataAccordion = ({ title, type, info, content, findMatchRecording = null, infoMusicList = null }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleAccordion = () => { setExpanded(!expanded); };

    return (
        <div className="metadata-accordion ">
            <div className="metadata-header flex" onClick={toggleAccordion}>
                <div className="metadata-title font-semibold">{title}</div>
                {expanded ? (
                    <FaAngleUp className="metadata-icon" />
                ) : (
                    <FaAngleDown className="metadata-icon" />
                )}
            </div>
            {expanded &&
                <div className="metadata-content">
                    {infoMusicList !== null ? (
                        infoMusicList.length === 0 ? (<AiOutlineLoading className='spin' size={'20px'} />) :
                            findMatchRecording(info) !== -1 ? (
                                <div className='detailResultMeta'>
                                    <u>Info about recording:</u>
                                    {Object.entries(infoMusicList[findMatchRecording(info)]).map(([key, value]) => (
                                        <p key={key}> {key}: {value} </p>
                                    ))}
                                </div>
                            )
                                : (<><div className='text-left'>No metadata about the recording</div><br /></>)
                    ) : <></>
                    }
                    <AnnotationSystem type={"track"} info={info} />
                    <EmbeddedWorkflowInteraction idCaller={content} typeCaller={"track"} />
                </div>
            }
        </div>
    );
};

export default MetadataAccordion;
