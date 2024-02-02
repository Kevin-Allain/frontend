import React, { useState, useEffect } from 'react';
import { getSliceMp3 } from "../../utils/HandleApi";
import { AiFillPlayCircle, AiFillPauseCircle, AiOutlineArrowRight, AiOutlineLoading } from 'react-icons/ai'

// At home, could be tested with At Home WithAlex Welsh And His Band 1967/11/15 - It Don't Mean A Thing, SJA_AC_A0004_N0020_E0016_Y15111967_01 
const AudioSlicer = (props) => {
  const {sja_id, first_second, last_second, test} = props;
  console.log("sja_id: ", sja_id,", first_second: ",first_second,", last_second: ",last_second);

  const [fileName, setFileName] = useState(sja_id); 
  console.log("prop.sja_id: ", props.sja_id, ", fileName: ", fileName);
  // TODO messy to keep this, but not too terrible...?
  const [start, setStart] = useState(first_second); const [end, setEnd] = useState(last_second);

  const [audioUrl, setAudioUrl] = useState(
    fileName === ""
    ? `https://jazzdap.city.ac.uk/public/sliced_audio_${start}_${end}.mp3`
    : `https://jazzdap.city.ac.uk/public/${fileName}_${start}_${end}.mp3`
  );

  const [audioMp3, setAudioMp3] = useState(
    new Audio( fileName === ""
    ? `https://jazzdap.city.ac.uk/public/sliced_audio_${start}_${end}.mp3`.replace(/ /g,"%20")
    : `https://jazzdap.city.ac.uk/public/${fileName}_${start}_${end}.mp3`.replace(/ /g,"%20")
    )
  );

  const [slicerCalled, setSlicerCalled] = useState(null);
  const [fileNameSlicer, setFileNameSlicer] = useState(null);

  const handleSliceButtonClick = async () => {
    console.log("handleSliceButtonClick");
    try {
      const response = await getSliceMp3(fileName, start, end);
      // Assuming the response from getSliceMp3 contains the sliced audio URL
      setAudioUrl(response.slicedAudioUrl);
    } catch (error) {
      console.error("Error slicing audio:", error);
    }
  };

  const playMp3 = (filename = "", start, end) => {
    console.log("playMp3 | ", { start, end });
    try {
      setStart(start); setEnd(end);
      let audioStr =
        fileName === ""
          ? `https://jazzdap.city.ac.uk/public/sliced_audio_${start}_${end}.mp3`
          : `https://jazzdap.city.ac.uk/public/${fileName}_${start}_${end}.mp3`;
      setAudioMp3(new Audio(audioStr.replace(/ /g, "%20")));
      console.log("audioMp3: ", audioMp3);
      // No need to worry about this yet
      audioMp3.play();
    } catch (error) {
      alert("File not found");
    }
  };

  const playMp3Slicer = (fileNameSlicer) => {
    setAudioMp3(new Audio(fileNameSlicer.replace(/ /g, "%20")));
    console.log("audioMp3: ", audioMp3);
    // No need to worry about this yet
    audioMp3.play();
  }

    // TODO work in progress to force loading of this info prior to call the SampleRes
    useEffect(() => {
        console.log("in useEffect, sja_id: ",sja_id);
        const fetchData = async () => {
          try {
            const result = await getSliceMp3(sja_id, start, end, setFileNameSlicer);
            console.log("in useEffect result: ", result);
            console.log("in useEffect fileNameSlicer: ", fileNameSlicer);
            setFileName(`https://jazzdap.city.ac.uk/public/${fileNameSlicer}`);
            setSlicerCalled(true);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [start, end, sja_id, slicerCalled, fileNameSlicer]);
    

  
  return (
    <div style={{ color: "white" }}>
      {/* TODO remove to clean later */}
      <p>Test slicer</p>
      <label> File name: <input type="string" style={{ color: "black" }} value={typeof fileName === "object" ? fileName.toString() : fileName} onChange={(e) => setFileName(e.target.value)} /> </label>
      <label> Start Time: <input type="number" style={{ color: "black" }} value={start} onChange={(e) => setStart(e.target.value)} /> </label>
      <label> End Time: <input type="number" style={{ color: "black" }} value={end} onChange={(e) => setEnd(e.target.value)} /> </label>
      <button onClick={handleSliceButtonClick}>Slice Audio</button>
      <hr />
      <div>
        { test &&
            <AiFillPlayCircle className="icon" style={{ color: "red" }} onClick={(c) => { playMp3("", start, end); }} /> }
        { !test &&
            <AiFillPlayCircle className="icon" onClick={(c) => { playMp3(fileName, start, end); }} /> }
        { slicerCalled === null 
        ? (<p>Loading...</p>)
        : <AiFillPlayCircle 
            className="icon" 
            onClick={(c) => {  playMp3Slicer(fileNameSlicer); }} 
          />
        }
      </div>
    </div>
  );
};

export default AudioSlicer;
