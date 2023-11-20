import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import * as d3 from "d3";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter, Bar } from "react-chartjs-2";
import ToggleSwitch from "../Button/ToggleSwitch";
import MIDItoNote from "../MusicInterface/MIDItoNote.json";
import NoteToColor from "../MusicInterface/NoteToColor.json";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const GraphsResults = ({ infoMusicList, oldSearch, listSearchRes }) => {
  console.log(
    "GraphsResults - infoMusicList: ",
    infoMusicList,
    ", oldSearch: ",
    oldSearch,
    ", listSearchRes: ",
    listSearchRes
  );
  const [showGraphs, setShowGraphs] = useState(false);
  const handleToggle = () => {
    setShowGraphs(!showGraphs);
  };

  // TODO change later on, we will want to consider the melodies and outputs of melodies as well.
  const dataInput = infoMusicList;
  ChartJS.register(
    LinearScale,
    CategoryScale,
    PointElement,
    BarElement,
    LineElement,
    Tooltip,
    Legend
  );

  // Shared parameters
  const [typeGraph, setTypeGraph] = useState("scatter");
  const [selectedAxisX, setSelectedAxisX] = useState("Release Year");
  const [selectedAxisY, setSelectedAxisY] = useState("Release Month");
  const attributesOptions = [ "Release Year", "Release Month", "Track Title", "Recording", "Artists", ];

  // Derived parameters (will require making calls to the database)
  const [numMelodies, setMumMelodies] = useState(listSearchRes.length);
  const [percMatchesCount, setPercMatchesCount] = useState(listSearchRes.reduce((acc, obj) => {
    const value = obj.distCalc;
    if (acc[value]) { acc[value]++; } else { acc[value] = 1; }
    return acc;
  }, {}));
  const [lognumbersCount, setLognumbersCount] = useState(listSearchRes.reduce((acc, obj) => {
    const value = obj.lognumber;
    if (acc[value]) { acc[value]++; } else { acc[value] = 1; }
    return acc;
  }, {}))
  const [tracksCount, setTracksCount] = useState(listSearchRes.reduce((acc, obj) => {
    const value = obj.track;
    if (acc[value]) { acc[value]++; } else { acc[value] = 1; }
    return acc;
  }, {}));

  // Create a hashmap
  const resultMap = {};
  // Iterate over InfoMusicList
  infoMusicList.forEach((infoObj) => {
    const { SJA_ID } = infoObj;
    if (SJA_ID) {
      // Find the corresponding object in listSearchRes
      const matchedObject = listSearchRes.find((searchObj) => searchObj.track.replace(/-T/g, '_') === SJA_ID);
      // If a match is found, add it to the hashmap
      if (matchedObject) { resultMap[SJA_ID] = matchedObject; }
    }
  });
  console.log("resultMap: ",resultMap);



  console.log("numMelodies: ",numMelodies,", percMatchesCount: ",percMatchesCount,", lognumbersCount: ",lognumbersCount,", tracksCount: ",tracksCount);

  // ---- Parameters specific to certain graphs
  // -- Scatter
    // Assuming dataScatter is calculated based on selectedAxisX, selectedAxisY, and typeGraph
    const [dataScatter, setDataScatter] = useState({
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
    });  
  const [optionsScatter, setOptionsScatter] = useState({ scales: { x: { beginAtZero: false }, y: { beginAtZero: false } }, });
  // -- BarGraph
  // Sample data
  const [axisLabelXBarGraph, setAxisLabelXBarGraph] = useState(["Category A", "Category B", "Category C", "Category D", "Category E", ]);
  const [axisYBarGraph, setAxisYBarGraph] = useState([10, 20, 15, 25, 18]);
  // Chart data
  const [dataBarGraph, setDataBarGraph] = useState({
    labels: axisLabelXBarGraph,
    datasets: [
      {
        label: "Sample Bar Chart",
        data: axisYBarGraph,
        backgroundColor: "rgba(75,192,192,0.2)", // Bar color
        borderColor: "rgba(75,192,192,1)", // Border color
        borderWidth: 1, // Border width
      },
    ],
  });
  // Chart options
  const [optionsBarGraph, setOptionsBarGraph] = useState({
    scales: { x: { beginAtZero: true }, y: { beginAtZero: true } },
  });
  // ----

  useEffect(() => {
    // This is called each time there is a call to change selectedAxisX or selectedAxisY

    const updateOptions = () => {
      if (typeGraph === "scatter") {
        const minAxisX =
          selectedAxisX === "Release Month"? 1
            : selectedAxisX === "Release Year"? Math.min(...infoMusicList.map((a) => Number(a["Release Year"])).filter((a) => a).filter((a) => a !== 0)) - 1
            : 0;
        const maxAxisX =
          selectedAxisX === "Release Month" ? 12
            : selectedAxisX === "Release Year" ? Math.max(...infoMusicList.map((a) => Number(a["Release Year"])).filter((a) => a).filter((a) => a !== 0)) + 1
            : 100;
        const minAxisY =
          selectedAxisY === "Release Month"? 1
            : selectedAxisY === "Release Year"? Math.min(...infoMusicList.map((a) => Number(a["Release Year"])).filter((a) => a).filter((a) => a !== 0)) - 1
            : 0;
        const maxAxisY =
          selectedAxisY === "Release Month"? 12
            : selectedAxisY === "Release Year"? Math.max(...infoMusicList.map((a) => Number(a["Release Year"])).filter((a) => a).filter((a) => a !== 0)) + 1
            : 100;

        setDataScatter({
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
        });

        setOptionsScatter({
          scales: {
            x: {
              type: "linear",
              position: "bottom",
              min: minAxisX,
              max: maxAxisX,
              ticks: {
                callback: function (value) {
                  return Math.round(value);
                },
              },
            },
            y: {
              type: "linear",
              position: "left",
              min: minAxisY,
              max: maxAxisY,
              ticks: {
                callback: function (value) {
                  return Math.round(value);
                },
              },
            },
          },
        });
      } else if (typeGraph === "bar") {

        // TODO adapt for this to be the labels to pass, based on selectedAxisX
        setAxisLabelXBarGraph();
        // TODO adapt for this to be the data object in the datasets object, based on selectedAxisY
        setAxisYBarGraph();
        // TODO set options... somehow
        // setOptions({ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Bar Chart', }, }, })

        setDataBarGraph({
          labels: axisLabelXBarGraph,
          datasets: [
            {
              label: "Sample Bar Chart",
              data: axisYBarGraph,
              backgroundColor: "rgba(75,192,192,0.2)", // Bar color
              borderColor: "rgba(75,192,192,1)", // Border color
              borderWidth: 1, // Border width
            },
          ],
        })

      } else {
        console.log(`Unexpected ${typeGraph}`);
      }
    };

    updateOptions();
  }, [selectedAxisX, selectedAxisY, infoMusicList, typeGraph]);

  // Set visualization type
  const handleChangeAxisX = useCallback((axis) => {
    axis === "Track Title" || axis === "Recording" || axis === "Artists"
      ? setTypeGraph("bar")
      : setTypeGraph("scatter");
    setSelectedAxisX(axis);
  }, []);

  const handleChangeAxisY = useCallback((axis) => {
    axis === "Track Title" || axis === "Recording" || axis === "Artists"
      ? setTypeGraph("bar")
      : setTypeGraph("scatter");
    setSelectedAxisY(axis);
  }, []);

  return (
    <div className="border-solid border-2 border-[#e5e7eb]">
      {/* <ToggleSwitch checked={showGraphs} onChange={handleToggle} /> */}
      <div
        className="metadata-header  icon flex items-center"
        onClick={handleToggle}
      >
        <BsGraphUp />
        <p className="mx-[0.5rem] my-[0.5rem]">Data Graphs</p>
        {showGraphs ? (
          <FaAngleUp className="metadata-icon" />
        ) : (
          <FaAngleDown className="metadata-icon" />
        )}
      </div>

      {showGraphs && (
        <>
          <p>The graph will adapt based on the attributes you select.</p>
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

          {typeGraph === "scatter" && (
            <Scatter data={dataScatter} options={optionsScatter} />
          )}
          {/* Work in progress for {typeGraph}
            <br />
            <Scatter data={dataBar} options={options} /> */}
          {typeGraph === "bar" && (
            <Bar data={dataBarGraph} options={optionsBarGraph} />
          )}
        </>
      )}
    </div>
  );
};

export default GraphsResults;
