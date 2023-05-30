import React from 'react'
import AnnotationSystem from '../Annotation/AnnotationSystem';

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
        </div>
    );
}

export default MusicInfo