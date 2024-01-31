import React, { useState, useEffect } from 'react';
import { getSliceMp3 } from "../../utils/HandleApi";
import { AiFillPlayCircle, AiFillPauseCircle, AiOutlineArrowRight, AiOutlineLoading } from 'react-icons/ai'

const AudioSlicer = () => {
    const [fileName, setFileName] = useState('');
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(3);
    const [audioSrc, setAudioSrc] = useState(null);
    const [audioUrl, setAudioUrl] = useState('https://jazzdap.city.ac.uk/public/sliced_audio_0_3.mp3');
    const [fileExists, setFileExists] = useState(true);


    const [playingMp3, setPlayingMp3] = useState(false);
    const [iconPlayMp3, setIconPlayMp3] = useState(<AiFillPlayCircle className="icon"/>);
    const [audioMp3, setAudioMp3] = useState(
        new Audio( `https://jazzdap.city.ac.uk/public/sliced_audio_${start}_${end}.mp3`)
    );

    const handleSliceButtonClick = async () => {
        console.log("handleSliceButtonClick");
        try {
            const response = await getSliceMp3(fileName, start, end);
            // Assuming the response from getSliceMp3 contains the sliced audio URL
            setAudioUrl(response.slicedAudioUrl);
            setAudioSrc(response.slicedAudioUrl);
            setFileExists(true);
        } catch (error) {
            console.error('Error slicing audio:', error);
            setFileExists(false);
        }
    };

    const playMp3 = (start, end) => {
        console.log("playMp3 | ", { start, end });
        try {
            setStart(start); setEnd(end);
            setAudioMp3(new Audio(`https://jazzdap.city.ac.uk/public/sliced_audio_${start}_${end}.mp3`));
            console.log("audioMp3: ", audioMp3);
            if (playingMp3) {
                audioMp3.pause();
                setIconPlayMp3(<AiFillPlayCircle className="icon" />);
            } else {
                audioMp3.play();
                setIconPlayMp3(<AiFillPauseCircle className="icon" />);
            }
            setPlayingMp3(!playingMp3);
        } catch (error) {
            alert("File not found")
        }
    }
    const resetMp3 = () => {
        if (playingMp3) {
            audioMp3.pause();
            setIconPlayMp3(<AiFillPlayCircle></AiFillPlayCircle>); setPlayingMp3(!playingMp3);
        }
        // setAudioMp3(new Audio("https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"));
    }

    useEffect(() => {
        const checkFileExists = async () => {
            try {
                const response = await fetch(audioUrl, { method: 'HEAD' });
                console.log("useEffect, response: ", response);
                if (!response.ok) {
                    // File not found (404 status code)
                    setFileExists(false);
                } else {
                    setFileExists(true);
                }
            } catch (error) {
                console.error('Error checking file existence:', error);
                setFileExists(false);
            }
        };
        checkFileExists();
    }, [audioUrl]);

    return (
        <div style={{"color":"white"}}>
            <h1>Test slicer</h1>
            <label>
                File name:
                <input type="string" style={{"color":"black"}} value={fileName} onChange={(e)=> setFileName(e.target.value)} />
            </label>
            <label>
                Start Time:
                <input type="number" style={{"color":"black"}} value={start} onChange={(e) => setStart(e.target.value)} />
            </label>
            <label>
                End Time:
                <input type="number" style={{"color":"black"}} value={end} onChange={(e) => setEnd(e.target.value)} />
            </label>
            <button onClick={handleSliceButtonClick}>Slice Audio</button>
            {/* {audioSrc && (
                <div> <p>Preview Sliced Audio:</p> <audio controls> <source src={audioSrc} type="audio/mp3" /> Your browser does not support the audio tag. </audio> </div> )} */}
            <br />
            <div>
                <h1>Preview Sliced Audio</h1>
                <div
                    className="playMusic"
                    onClick={(c) => { playMp3(0, 3); }}
                > Play Test sliced Mp3 (0 to 3) </div>
                <div
                    className="playMusic"
                    onClick={(c) => { playMp3(start, end); }}
                > Play Test sliced Mp3 (start and end: ${start} and ${end})
                </div>
                {/* {fileExists ? ( <audio controls> <source src={audioUrl} type="audio/mp3" /> Your browser does not support the audio tag. </audio> ) : ( <p>File does not exist.</p> )} */}
            </div>
        </div>
    );
};

export default AudioSlicer;
