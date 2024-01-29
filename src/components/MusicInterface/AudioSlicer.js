import React, { useState, useEffect } from 'react';
import { getSliceMp3 } from "../../utils/HandleApi";

const AudioSlicer = () => {
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(3);
    const [audioSrc, setAudioSrc] = useState(null);

    // this path is only for local testing!
    // For server, we will need to have the mp3 file hosted in the  
    const slicedAudioPath  = 'sliced_audio_0_3.mp3'
    const [audioUrl, setAudioUrl] = useState(`../../../public/test_audio/${slicedAudioPath}`);
    const [fileExists, setFileExists] = useState(true);
  

    const handleSliceButtonClick = () => {
        console.log("handleSliceButtonClick");
        getSliceMp3('', start, end);



    };


    useEffect(() => {
        const checkFileExists = async () => {
          try {
            const response = await fetch(audioUrl, { method: 'HEAD' });
            console.log("useEffect, response: ",response);
            if (!response.ok) {
              // File not found (404 status code)
              setFileExists(false);
            }
          } catch (error) {
            console.error('Error checking file existence:', error);
            setFileExists(false);
          }
        };
    
        checkFileExists();
      }, [audioUrl]);
    

    return (
        <div>
            <label>
                Start Time:
                <input type="number" value={start} onChange={(e) => setStart(e.target.value)} />
            </label>
            <label>
                End Time:
                <input type="number" value={end} onChange={(e) => setEnd(e.target.value)} />
            </label>
            <button onClick={handleSliceButtonClick}>Slice Audio</button>

            {audioSrc && (
                <div>
                    <p>Preview Sliced Audio:</p>
                    <audio controls>
                        <source src={audioSrc} type="audio/mp3" />
                        Your browser does not support the audio tag.
                    </audio>
                </div>
            )}
            <br />
            <div>
                <h1>Preview Sliced Audio:</h1>
                {fileExists ? (
                    <audio controls>
                        <source src={audioUrl} type="audio/mp3" />
                        Your browser does not support the audio tag.
                    </audio>
                ) : (
                    <p>File does not exist.</p>
                )}
            </div>

        </div>
    );
};

export default AudioSlicer;
