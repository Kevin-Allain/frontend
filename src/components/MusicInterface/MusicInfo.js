import React from 'react'
import AnnotationSystem from '../Annotation/AnnotationSystem';
import { BsThreeDotsVertical } from "react-icons/bs";
import { getWorkflowsInfo } from '../../utils/HandleApi';

// workflow component
import EmbeddedWorkflowInteraction from '../Workflow/EmbeddedWorkflowInteraction'

// Global variables addition for workflow -> Might be changed to call an EmbeddedWorkflowManager
import { useSelector, useDispatch } from 'react-redux';
import { setWorkflows } from '../Reducers/WorkflowReducer';

// TODO update based on additional metadata...
const MusicInfo = ({
    lognumber,
    contents,
    configuration,
    tape_stock,
    recording_location,
    addAnnotation,
    getAnnotations,
    updateAnnotation,
    deleteAnnotation }) => {

    const workflows = useSelector(state => state.workflows);

    const handleToggleUserWorkflows = () => {

        console.log("workflows: ",workflows);
    };


    return (
        <div className="musicinfo">
            <table>
                <thead>
                    <tr>
                        <th>Log Number</th>
                        <th>Contents</th>
                        <th>Configuration</th>
                        <th>Tape stock</th>
                        <th>Recording location</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>{lognumber}</th>
                        <th>{contents}</th>
                        <th>{configuration}</th>
                        <th>{tape_stock}</th>
                        <th>{recording_location}</th>
                    </tr>
                </tbody>
            </table>
            <AnnotationSystem
                key={"recording-" + lognumber}
                type={"recording"}
                info={lognumber}
                addAnnotation={addAnnotation}
                getAnnotations={getAnnotations}
                deleteAnnotation={deleteAnnotation}
                updateAnnotation={updateAnnotation}
            />
            {localStorage?.username && 
                <>
                    <div className='buttonDots'>
                        Workflows actions{" "}
                        <BsThreeDotsVertical
                            className="icon"
                            onClick={handleToggleUserWorkflows} />
                    </div>
                    <EmbeddedWorkflowInteraction />
                </>
            }
        </div>
    );
}

export default MusicInfo