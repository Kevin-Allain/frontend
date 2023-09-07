import React, { useState } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import './MyTabbedInterface.css'


const MyTabbedInterface = () => {
  const [activeRecording, setActiveRecording] = useState(null);
  const [activeTrack, setActiveTrack] = useState(null);

  // Mock data for recordings, tracks, and samples
  const recordings = 
    [
        "Recording 1", "Recording 2",
        "Recording 3", "Recording 21",
        "Recording 4", "Recording 22",
        "Recording 5", "Recording 23",
        "Recording 6", "Recording 24",
        "Recording 7", "Recording 25",
        "Recording 8", "Recording 26",
        "Recording 9", "Recording 27",
        "Recording 10", "Recording 28",
        "Recording 11", "Recording 32",
        "Recording 12", "Recording 312",
        "Recording 13", "Recording 332",
        "Recording 14", "Recording 342",
    ];
  const recordingData = {
    "Recording 1": ["Track 1", "Track 2"],
    "Recording 2": ["Track A", "Track B"],
    "Recording 3": [
        "Track A", "Track B", "Track 1", "Track 2",
        "Track C","Track D", "Track E",
    ],
  };
  const trackData = {
    "Track 1": ["Sample A", "Sample B"],
    "Track 2": ["Sample X", "Sample Y"],
    "Track A": ["Sample Alpha", "Sample Beta"],
    "Track B": ["Sample Gamma", "Sample Delta"],
    "Track C": ["Sample Gamma", "Sample Delta"],
    "Track D": ["Sample Gamma", "Sample Delta"],
    "Track E": ["Sample Gamma", "Sample Delta"],
  };

  const handleRecordingClick = (recording) => {
    setActiveRecording(recording);
    setActiveTrack(null); // Reset the active track when a new recording is selected
  };

  const handleTrackClick = (track) => {
    setActiveTrack(track);
  };

  return (
    <div className="flex h-[50rem] bg-gray-100">
      {/* Sidebar with recording tabs */}
      {/* <SimpleBar > */}
      <div className="w-1/5 p-4 overflow-y-auto custom-scrollbar">
          <h2 className="text-lg font-semibold mb-4">Recordings</h2>
          <ul>
            {recordings.map((recording) => (
              <li
                key={recording}
                className={`cursor-pointer mb-2 ${
                  activeRecording === recording ? "text-blue-500" : ""
                }`}
                onClick={() => handleRecordingClick(recording)}
              >
                {recording}
              </li>
            ))}
          </ul>
        </div>
      {/* </SimpleBar> */}
      
      {/* Sidebar with track tabs */}
      <div className="w-1/5 p-4 overflow-y-auto custom-scrollbar">
        <h2 className="text-lg font-semibold mb-4">Tracks</h2>
        <ul>
          {activeRecording &&
            recordingData[activeRecording].map((track) => (
              <li
                key={track}
                className={`cursor-pointer mb-2 ${
                  activeTrack === track ? "text-blue-500" : ""
                }`}
                onClick={() => handleTrackClick(track)}
              >
                {track}
              </li>
            ))}
        </ul>
      </div>

      {/* Content based on active recording and track */}
      <div className="w-3/5 p-4 overflow-y-auto custom-scrollbar">
        {activeRecording && activeTrack && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {activeRecording} - {activeTrack}
            </h2>
            <ul>
              {trackData[activeTrack].map((sample) => (
                <li key={sample} className="mb-2">
                  {sample}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTabbedInterface;
