import React, { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter, Bar } from "react-chartjs-2";

import MIDItoNote from "../MusicInterface/MIDItoNote.json";
import NoteToColor from "../MusicInterface/NoteToColor.json";

const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ];


const GraphsResults = ({ infoMusicList, oldSearch, listSearchRes }) => {
  console.log("GraphsResults - infoMusicList: ",infoMusicList,", oldSearch: ",oldSearch,", listSearchRes: ",listSearchRes);

  // TODO change later on, we will want to consider the melodies and outputs of melodies as well.
  const dataInput = infoMusicList;
  ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);
  const attributesOptions = [
    "Release Year",
    "Release Month",
    "Track Title",
    "Recording",
    "Artists",
  ];

  const [options, setOptions] = useState({
    scales: { x: { beginAtZero: false }, y: { beginAtZero: false } },
  });
  const [typeGraph, setTypeGraph] = useState("scatter");
  const [selectedAxisX, setSelectedAxisX] = useState("Release Year");
  const [selectedAxisY, setSelectedAxisY] = useState("Release Month");
  const [labels, setLabels] = useState(["Label 1","Label 2", "label 3"]); // TODO set the labels value as the selection is made by user.

  useEffect(() => {
    // This is called each time there is a call to change selectedAxisX or selectedAxisY 

    const updateOptions = () => {

      const minAxisX = selectedAxisX === 'Release Month' ? 1
          : selectedAxisX === 'Release Year'
          ? (Math.min( ...infoMusicList
                .map((a) => Number(a['Release Year']))
                .filter((a) => a)
                .filter((a) => a !== 0)
            )-1)
          : 0;
      const maxAxisX = selectedAxisX === 'Release Month' ? 12
          : selectedAxisX === 'Release Year'
          ? (Math.max( ...infoMusicList
                .map((a) => Number(a['Release Year']))
                .filter((a) => a)
                .filter((a) => a !== 0)
            )+1)
          : 100;
      const minAxisY = selectedAxisY === 'Release Month' ? 1
          : selectedAxisY === 'Release Year'
          ? (Math.min( ...infoMusicList
                .map((a) => Number(a['Release Year']))
                .filter((a) => a)
                .filter((a) => a !== 0)
            )-1)
          : 0;
      const maxAxisY = selectedAxisY === 'Release Month' ? 12
          : selectedAxisY === 'Release Year'
          ? (Math.max( ...infoMusicList
                .map((a) => Number(a['Release Year']))
                .filter((a) => a)
                .filter((a) => a !== 0)
            )+1)
          : 100;

      if (typeGraph === 'scatter') {
        setOptions({
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              min: minAxisX,
              max: maxAxisX,
              ticks: {
                callback: function (value) { return Math.round(value); },
              },
            },
            y: {
              type: 'linear',
              position: 'left',
              min: minAxisY,
              max: maxAxisY,
              ticks: {
                callback: function (value) { return Math.round(value); },
              },
            },
          },
        });
      } else if (typeGraph ==='bar'){        
        setOptions({
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: true,
              text: 'Bar Chart',
            },
          },        
        })
      } else { console.log(`Unexpected ${typeGraph}`); }
    };

    updateOptions();
  }, [selectedAxisX, selectedAxisY, infoMusicList, typeGraph]);


  const handleChangeAxisX = useCallback((axis) => {
    (axis==="Track Title" || axis==="Recording" || axis==="Artists")?setTypeGraph('bar'):setTypeGraph('scatter');
    setSelectedAxisX(axis);
  }, []);

  const handleChangeAxisY = useCallback((axis) => {
    (axis==="Track Title" || axis==="Recording" || axis==="Artists")?setTypeGraph('bar'):setTypeGraph('scatter');
    setSelectedAxisY(axis);
  }, []);

  // Assuming dataScatter is calculated based on selectedAxisX, selectedAxisY, and typeGraph
  let dataScatter = {
    datasets: [
      {
        label: `${selectedAxisX} and ${selectedAxisY}`,
        data: dataInput
          .map((item, i) =>
            selectedAxisX !== "Release Year" ||
            ((selectedAxisX === "Release Year" ||
              selectedAxisX === "Release Month") &&
              Number(item[selectedAxisX]) !== 0) ||
            ((selectedAxisY === "Release Year" ||
              selectedAxisY === "Release Month") &&
              Number(item[selectedAxisX]) !== 0)
              ? {
                  x: Number(item[selectedAxisX]),
                  y: Number(item[selectedAxisY]),
                }
              : null
          )
          .filter((a) => a)
          .filter((a) => !isNaN(a.x) && !isNaN(a.y)),
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };

  // TODO assess whether this will work... (we might have to consider forcing certain attributes for certain axes to avoid worrying about setting up horizontal or vertical bar charts)
  let dataBar = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: dataInput[selectedAxisY],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };    

  return (
    <div>
      <h1 className="text-black">Attribute selection</h1>
      <p>The graph will adapt based on your selection.</p>
      <div>
        <label>Axis X </label>
        <select
          onChange={(e) => handleChangeAxisX(e.target.value)}
          value={selectedAxisX}
        >
          {attributesOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Axis Y </label>
        <select
          onChange={(e) => handleChangeAxisY(e.target.value)}
          value={selectedAxisY}
        >
          {attributesOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {typeGraph === "scatter" ? (
        <Scatter data={dataScatter} options={options} />
      ) : (
        <>
          {typeGraph === "bar" ? (
            <>
              Work in progress for {typeGraph}
              <br />
              <Scatter data={dataBar} options={options} />
            </>
          ) : (
            <>Work in progress </>
          )}
        </>
      )}
    </div>
  );
};



export default GraphsResults;
