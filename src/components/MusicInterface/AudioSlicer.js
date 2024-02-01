import React, { useState, useEffect } from 'react';
import { getSliceMp3 } from "../../utils/HandleApi";
import { AiFillPlayCircle, AiFillPauseCircle, AiOutlineArrowRight, AiOutlineLoading } from 'react-icons/ai'

const AudioSlicer = (prop) => {
    const [fileName, setFileName] = useState(prop.audioFile);
    console.log("prop.audioFile: ",prop.audioFile,", fileName: ",fileName);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(3);
    const [audioSrc, setAudioSrc] = useState(null);
    const [audioUrl, setAudioUrl] = useState((fileName === '')
        ? (`https://jazzdap.city.ac.uk/public/sliced_audio_${start}_${end}.mp3`)
        : (`https://jazzdap.city.ac.uk/public/${fileName}_${start}_${end}.mp3`));
    const [fileExists, setFileExists] = useState(true);

    const [playingMp3, setPlayingMp3] = useState(false);
    const [iconPlayMp3, setIconPlayMp3] = useState(<AiFillPlayCircle className="icon" />);
    const [audioMp3, setAudioMp3] = useState(
        new Audio((fileName === '')
            ? (`https://jazzdap.city.ac.uk/public/sliced_audio_${start}_${end}.mp3`).replace(/ /g, "%20")
            : (`https://jazzdap.city.ac.uk/public/${fileName}_${start}_${end}.mp3`).replace(/ /g, "%20")
        )
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

    const playMp3 = (filename='',start, end) => {
        console.log("playMp3 | ", { start, end });
        try {
            setStart(start); setEnd(end);
            let audioStr = (fileName == '')
                ? `https://jazzdap.city.ac.uk/public/sliced_audio_${start}_${end}.mp3`
                : `https://jazzdap.city.ac.uk/public/${fileName}_${start}_${end}.mp3`
            setAudioMp3(new Audio(audioStr.replace(/ /g, "%20")));
            console.log("audioMp3: ", audioMp3);
            // No need to worry about this yet
            // if (playingMp3) { audioMp3.pause(); setIconPlayMp3(<AiFillPlayCircle className="icon" />);
            // } else { audioMp3.play(); setIconPlayMp3(<AiFillPauseCircle className="icon" />); }
            audioMp3.play();
            setIconPlayMp3(<AiFillPauseCircle className="icon" />);
            setPlayingMp3(!playingMp3);
        } catch (error) {
            alert("File not found")
        }
    }
    // const resetMp3 = () => { if (playingMp3) { audioMp3.pause(); setIconPlayMp3(<AiFillPlayCircle></AiFillPlayCircle>); setPlayingMp3(!playingMp3); } }

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
            <p>Test slicer</p>
            <label>
                File name:
                <input type="string" style={{"color":"black"}} value={fileName.toString()} onChange={(e)=> setFileName(e.target.value)} />
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
                <AiFillPlayCircle
                    className="icon"
                    style={{ color: 'red' }}
                    onClick={(c) => { playMp3('', start, end); }}
                />
                {/* <div className="playMusic" onClick={(c) => { playMp3(start, end); }} > Play Test sliced Mp3 (start and end: ${start} and ${end}) </div> */}
                <AiFillPlayCircle
                    className="icon"
                    onClick={(c) => { playMp3(fileName, start, end); }}
                />
                {/* {fileExists ? ( <audio controls> <source src={audioUrl} type="audio/mp3" /> Your browser does not support the audio tag. </audio> ) : ( <p>File does not exist.</p> )} */}
            </div>
        </div>
    );
};

export default AudioSlicer;
