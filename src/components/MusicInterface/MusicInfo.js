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
    deleteAnnotation}) => {
    return (
        <div className="musicinfo">
            <div className='lognumber'>Log number: {lognumber}</div>
            <div className="contents">Contents: {contents}</div>
            <div className="configuration">Configuration: {configuration}</div>
            <div className='tape_stock'>Tape stock: {tape_stock}</div>
            <div className='recording_location'>Recording location: {recording_location}</div>
            <AnnotationSystem
                key={"recording-"+lognumber}
                type={"recording"}
                info={lognumber}
                addAnnotation={addAnnotation}
                getAnnotations={getAnnotations}
                deleteAnnotation={deleteAnnotation}
            />
        </div>
    );
}

export default MusicInfo