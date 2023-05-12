import React from 'react'

const MusicInfo = ({lognumber,contents, configuration, tape_stock, recording_location}) => {
    // TODO make it a better structure to be more comfortable
    return (
        <div className="musicinfo">
            <div className='lognumber'>Log number: {lognumber}</div>
            <div className="contents">Contents: {contents}</div>
            <div className="configuration">Configuration: {configuration}</div>
            <div className='tape_stock'>Tape stock: {tape_stock}</div>
            <div className='recording_location'>Recording location: {recording_location}</div>
        </div>
    );
}

export default MusicInfo