import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as chartjs from "chart.js";
import MIDItoNote from '../MusicInterface/MIDItoNote.json'
import NoteToColor from '../MusicInterface/NoteToColor.json'

const GraphsResults = ({infoMusicList}) => {
    console.log("GraphsResults - infoMusicList: ",infoMusicList);

    return (<>GraphsResults has { infoMusicList? infoMusicList.length : 0 } elements to work with.</>)
};


export default GraphsResults;
