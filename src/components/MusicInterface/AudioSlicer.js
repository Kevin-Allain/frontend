import React, { useState, useEffect } from "react";
import { getSliceMp3 } from "../../utils/HandleApi";
import {
  AiFillPlayCircle,
  AiFillPauseCircle,
  AiOutlineArrowRight,
  AiOutlineLoading,
} from "react-icons/ai";

const AudioSlicer = (props) => {
  const { sja_id, first_second, last_second, test } = props;
  console.log("sja_id: ",sja_id,", first_second: ",first_second,", last_second: ",last_second);

  const fileName = sja_id;
  const start = first_second;
  const end = last_second;
  const [sja_code_audioUrl,setSja_code_audioUrl] = useState(`https://jazzdap.city.ac.uk/public/${fileName}_${start}_${end}.mp3`);

  const [audioMp3, setAudioMp3] = useState(
    new Audio(`https://jazzdap.city.ac.uk/public/${fileName}_${start}_${end}.mp3`.replace(/ /g,"%20"))
  );

  const [slicerCalled, setSlicerCalled] = useState(null);
  const [fileNameSlicer, setFileNameSlicer] = useState(null);

  const playMp3Slicer = (fileNameSlicer) => {
    setAudioMp3(new Audio(fileNameSlicer.replace(/ /g, "%20")));
    console.log("audioMp3: ", audioMp3);
    audioMp3.play();
  };

  // TODO? work in progress to force loading of this info prior to call the SampleRes
  useEffect(() => {
    console.log("in useEffect, sja_id: ", sja_id);
    const fetchData = async () => {
      try {
        const result = await getSliceMp3(sja_id, start, end, sja_code_audioUrl, setFileNameSlicer);
        // console.log("in useEffect result: ", result); // always undefined
        console.log("in useEffect fileNameSlicer: ", fileNameSlicer);
        setSlicerCalled(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [start, end, sja_id, slicerCalled, fileNameSlicer, sja_code_audioUrl]);

  return (
    <div style={{ color: "white" }}>
      {/* TODO remove to clean later */}
      <p> {fileName} | {start}-{end} </p>
      <div>
      {slicerCalled === null ? (
        <p>Loading...</p>
      ) : (
        <AiFillPlayCircle className="icon" onClick={(c) => { playMp3Slicer(fileNameSlicer); }} />
      )}
      </div>
    </div>
  );
};

export default AudioSlicer;
