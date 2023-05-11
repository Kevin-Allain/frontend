import React from 'react'

const MusicInfo = ({lognumber,contents, tape_stock, recording_location}) => {
    return (
        <div className="musicinfo">
            <div className='lognumber'>{lognumber}</div>
            <div className="contents">{contents}</div>
            <div className='tape_stock'>{tape_stock}</div>
            <div className='recording_location'>{recording_location}</div>
        </div>
    );
}

export default MusicInfo