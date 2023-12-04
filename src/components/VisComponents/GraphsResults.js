import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import * as d3 from "d3";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Tooltip, Legend,
} from "chart.js";
import { Scatter, Bar } from "react-chartjs-2";
import ToggleSwitch from "../Button/ToggleSwitch";
import MIDItoNote from "../MusicInterface/MIDItoNote.json";
import NoteToColor from "../MusicInterface/NoteToColor.json";
import BarChart from "./BarChart";
import ScatterChart from "./ScatterChart";
import './GraphsResults.css'

const months = ["January","February","March","April","May","June","July","August","September","October","November","December",];
const arrayStrPitchesToNotes = (arrStrNotes) => {
  return arrStrNotes.split("-").map((a, i) => MIDItoNote[a].replaceAll("s", "")).join('-');
}

const GraphsResults = ({ infoMusicList, oldSearch, listSearchRes }) => {
  console.log("GraphsResults - infoMusicList: ", infoMusicList, ", oldSearch: ", oldSearch, ", listSearchRes: ", listSearchRes);
  const [showGraphs, setShowGraphs] = useState(false);
  const handleToggle = () => { setShowGraphs(!showGraphs); };
  // Set up date in javascript format
  for (let a in infoMusicList) {
    infoMusicList[a].dateEvent = infoMusicList[a]['Event Year']
      ? new Date(infoMusicList[a]['Event Year'], infoMusicList[a]['Event Month'] !== '' ? infoMusicList[a]['Event Month'] : 1, infoMusicList[a]['Event Day'] !== '' ? infoMusicList[a]['Event Day'] : 1)
      : null
  }

  // TODO change later on, we will want to consider the matches and outputs of matches as well.
  const dataInput = infoMusicList;
  ChartJS.register(
    LinearScale, CategoryScale, PointElement, BarElement, LineElement, Tooltip, Legend
  );


  // ---- Using a reference example
  // Inspiration with useRef
  // https://codesandbox.io/s/example-chartjs-and-useref-wlq78?file=/src/Components/ExampleChart.jsx:209-229
  // We should: Set the selection of attributeMix in this component.
  // Then: pass the data to components that will have the graph drawn.
  // TODO create components that are inspired by link for drawing the graph. The data can be tracked with useState.

  // Call it after data generation

  // Shared parameters
  // TODO we should probably set the attribute combinations in one array directly
  const [typeGraph, setTypeGraph] = useState("bar");
  const [selectedAttributeMix, setSelectedAttributeMix] = useState("Number of matches per recording");
  const [selectedAxisY, setSelectedAxisY] = useState("Release Month");
  const attributesOptions = ["Release Year", "Release Month", "Track Title", "Recording", "Artists"];
  // attributeMix can relate to a single attribute. What matters is we set the selection for the axes
  const attributeMix = [ "Recording dates of matches", "Number of matches per recording", "Number of matches per track", "Number of occurences per match" ];

  // Derived parameters (might require making calls to the database)
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
  const [uniqueMelodiesStr, setUniqueMelodiesStr] = useState(
    [...new Set(listSearchRes.map(a => a.arrNotes.join('-')))]
  )
  
  const mapRecordingToName = {};
  [...new Set(listSearchRes.map(element => element.lognumber))]
    .map(b => mapRecordingToName[b] =
      infoMusicList.filter(a => a.lognumber === b)[0]
        ? infoMusicList.filter(a => a.lognumber === b)[0]['(E) Event Name']
        : null)
  const mapTrackToName = {};
  [...new Set(listSearchRes.map(element => element.track.replace(/-T/g, '_')))]
    .map(b => mapTrackToName[b] =
      infoMusicList.filter(a => a['SJA_ID'] === b)[0]
        ? infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Track Title']
        : null)

  const recordingsCount = {}
  for (let i in mapRecordingToName) { recordingsCount[mapRecordingToName[i]] = lognumbersCount[i] }
  const trackNamesCount = {};
  for (let i in mapTrackToName) { trackNamesCount[mapTrackToName[i]] = tracksCount[i.substring(0,i.lastIndexOf('_'))+'-T'+i.substring(i.lastIndexOf('_')+1)]; }
  const mapMelodyToCount = {};
  uniqueMelodiesStr.map(
    b => mapMelodyToCount[b] = listSearchRes.map(a => a.arrNotes.join('-')).filter(a => a === b).length
  );
  // TODO is 2 a good value for this filter? Maybe it should be based on number of output rather than an input...
  const filteredMapMelodyCount = {};
  const numberFilterMelodyCount = 2;
  for (var k in mapMelodyToCount) {
    if (mapMelodyToCount[k] > numberFilterMelodyCount) { filteredMapMelodyCount[arrayStrPitchesToNotes(k)] = mapMelodyToCount[k] }
  }
  // console.log("filteredMapMelodyCount: ",filteredMapMelodyCount);
  // TODO sort that object?
  let sortedMelodyCount = {}
  for (let i in Object.keys(filteredMapMelodyCount).sort()){
    sortedMelodyCount[Object.keys(filteredMapMelodyCount).sort()[i]] = filteredMapMelodyCount[Object.keys(filteredMapMelodyCount).sort()[i]]
  }
  // console.log("- sortedMelodyCount: ", sortedMelodyCount);


  const datesCount = {};
  let mapRecordingToDate = {};
  [...new Set(listSearchRes.map(element => element.lognumber))]
    .map(b => mapRecordingToDate[b] =
      infoMusicList.filter(a => a.lognumber === b)[0]
        ? infoMusicList.filter(a => a.lognumber === b)[0]['dateEvent']
        : null)
  // console.log("mapRecordingToDate: ", mapRecordingToDate);
  for (let i in mapRecordingToDate) { datesCount[mapRecordingToDate[i]] = lognumbersCount[i] }
  // console.log("datesCount: ", datesCount);
    
  let keysTime = [];
  let valuesTime = [];
  let objIso = {}
  if (datesCount[null]) {
    keysTime = Object.keys(datesCount).filter(a => a !== 'null').map(a => new Date(a).toISOString().split('T')[0])
    valuesTime = Object.values(datesCount).slice(1)
    for (var i in keysTime) { objIso[keysTime[i]] = valuesTime[i] }
    objIso["No date"] = datesCount[null];
  } else {
    keysTime = Object.keys(datesCount).map(a => new Date(a).toISOString().split('T')[0])
    valuesTime = Object.values(datesCount)
    for (var i in keysTime) { objIso[keysTime[i]] = valuesTime[i] }
  }
  // console.log("- objIso: ", objIso);
  let sortedIso = {}
  for (let i in Object.keys(objIso).sort()){
      sortedIso[Object.keys(objIso).sort()[i]] = objIso[Object.keys(objIso).sort()[i]]
  }
  // console.log("- sortedIso: ", sortedIso);
  

  // console.log("uniqueMelodiesStr: ",uniqueMelodiesStr);
  // console.log("recordingsCount: ", recordingsCount, ", trackNamesCount: ", trackNamesCount);
  // console.log("numMelodies: ", numMelodies, ", percMatchesCount: ", percMatchesCount, ", lognumbersCount: ", lognumbersCount, ", tracksCount: ", tracksCount, ", mapRecordingToName: ", mapRecordingToName, ", mapTrackToName: ", mapTrackToName);
  // // TODO consider a number of matches we are happy with?
  // console.log("mapMelodyToCount: ",mapMelodyToCount);
  // console.log("filteredMapMelodyCount: ",filteredMapMelodyCount);

  // ---- Parameters specific to certain graphs
  // -- Scatter
    // Assuming dataScatter is calculated based on selectedAttributeMix, selectedAxisY, and typeGraph
    const [dataScatter, setDataScatter] = useState({
      datasets: [
        {
          label: `${selectedAttributeMix} and ${selectedAxisY}`,
          data: dataInput
            .map((item, i) =>
              selectedAttributeMix !== "Release Year" ||
              ((selectedAttributeMix === "Release Year" ||
                selectedAttributeMix === "Release Month") &&
                Number(item[selectedAttributeMix]) !== 0) ||
              ((selectedAxisY === "Release Year" ||
                selectedAxisY === "Release Month") &&
                Number(item[selectedAttributeMix]) !== 0)
                ? {
                    x: Number(item[selectedAttributeMix]),
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
  // const axisLabelXBarGraphRef = useRef([]);
  // const axisYBarGraphRef = useRef([]);
  
  // Chart data
  // const[dataBarGraph, setDataBarGraph] = useState({})
  const[dataBarGraph, setDataBarGraph] = useState({    
    labels: axisLabelXBarGraph,
    datasets: [
      { label: "Sample Bar Chart", data: axisYBarGraph, backgroundColor: "rgba(75,192,192,0.2)", borderColor: "rgba(75,192,192,1)", borderWidth: 1, },
    ],
  });
  // const dataBarGraphRef = useRef({
  //   labels: axisLabelXBarGraphRef,
  //   datasets: [ { label: "Sample Bar Chart", data: axisYBarGraphRef, backgroundColor: "rgba(75,192,192,0.2)", borderColor: "rgba(75,192,192,1)", borderWidth: 1, }, ],
  // })

  // Chart options
  const [optionsBarGraph, setOptionsBarGraph] = useState({
    scales: { x: { beginAtZero: true }, y: { beginAtZero: true } },
  });
  // ----

  useEffect(() => {
    // This is called each time there is a call to change selectedAttributeMix or selectedAxisY
    // console.log("dataBarGraph: ",dataBarGraph,", axisLabelXBarGraph: ",axisLabelXBarGraph,", axisYBarGraph: ",axisYBarGraph);

    const updateOptions = () => {
      if (typeGraph === "scatter") {
        const minAxisX =
          selectedAttributeMix === "Release Month"? 1
            : selectedAttributeMix === "Release Year"? Math.min(...infoMusicList.map((a) => Number(a["Release Year"])).filter((a) => a).filter((a) => a !== 0)) - 1
            : 0;
        const maxAxisX =
          selectedAttributeMix === "Release Month" ? 12
            : selectedAttributeMix === "Release Year" ? Math.max(...infoMusicList.map((a) => Number(a["Release Year"])).filter((a) => a).filter((a) => a !== 0)) + 1
            : 100;
        const minAxisY =
          selectedAxisY === "Release Month"? 1
            : selectedAxisY === "Release Year"? Math.min(...infoMusicList.map((a) => Number(a["Release Year"])).filter((a) => a).filter((a) => a !== 0)) - 1
            : 0;
        const maxAxisY =
          selectedAxisY === "Release Month"? 12
            : selectedAxisY === "Release Year"? Math.max(...infoMusicList.map((a) => Number(a["Release Year"])).filter((a) => a).filter((a) => a !== 0)) + 1
            : 100;

        // TODO change and fix
        setDataScatter({
          datasets: [
            {
              label: `${selectedAttributeMix}`,
              data: dataInput
                .map((item, i) =>
                  selectedAttributeMix !== "Release Year" ||
                  ((selectedAttributeMix === "Release Year" ||
                    selectedAttributeMix === "Release Month") &&
                    Number(item[selectedAttributeMix]) !== 0) ||
                  ((selectedAxisY === "Release Year" ||
                    selectedAxisY === "Release Month") &&
                    Number(item[selectedAttributeMix]) !== 0)
                    ? {
                        x: Number(item[selectedAttributeMix]),
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
        // console.log("Updating with typeGraph bar. selectedAttributeMix: ",selectedAttributeMix,", axisLabelXBarGraph: ",axisLabelXBarGraph);

        // Destroy the existing chart before creating a new one
        // if (dataBarGraphRef.current) { dataBarGraphRef.current.destroy(); }

        // Work in progrress: adapt for this to be the labels to pass, based on selectedAttributeMix
        // if (selectedAttributeMix === "Number of matches per recording") { setAxisLabelXBarGraph((prevLabels) => { const newLabels = Object.keys(recordingsCount); return newLabels; }); }
        


        if (selectedAttributeMix === "Recording dates of matches") {
          setAxisLabelXBarGraph(Object.keys(sortedIso))
        }
        if (selectedAttributeMix === "Number of matches per track") { setAxisLabelXBarGraph(Object.keys(trackNamesCount)) }
        if (selectedAttributeMix === "Number of matches per recording") { setAxisLabelXBarGraph(Object.keys(recordingsCount)) }
        if (selectedAttributeMix === "Number of occurences per match") {
          setAxisLabelXBarGraph(Object.keys(sortedMelodyCount))
        }
        // if (selectedAttributeMix === "Number of matches per recording") { axisLabelXBarGraphRef.current = Object.keys(recordingsCount); }
        // if (selectedAttributeMix === "Number of matches per track") { axisLabelXBarGraphRef.current = Object.keys(trackNamesCount); }

        // Work in progrress: adapt for this to be the data object in the datasets object, based on selectedAxisY        
        if (selectedAttributeMix === "Recording dates of matches") {
          setAxisYBarGraph(Object.values(
            sortedIso
          ))
        }
        if (selectedAttributeMix === "Number of matches per track") { setAxisYBarGraph(Object.values(trackNamesCount)) }
        if (selectedAttributeMix === "Number of matches per recording") { setAxisYBarGraph(Object.values(recordingsCount)); }
        if (selectedAttributeMix === "Number of occurences per match") { setAxisYBarGraph(Object.values(sortedMelodyCount)); }
        // if (selectedAttributeMix === "Number of matches per recording") { setAxisYBarGraph((prevData) => { const newData = Object.values(recordingsCount); return newData; }); }
        // if (selectedAttributeMix === "Number of matches per recording") { axisYBarGraphRef.current = Object.values(recordingsCount); }
        // if (selectedAttributeMix === "Number of matches per track") { axisYBarGraphRef.current = Object.values(trackNamesCount); }

        // console.log("Update made. axisLabelXBarGraph: ",axisLabelXBarGraph);

        // // Create a new bar chart
        // const ctx = canvasRef.current.getContext("2d");
        // barChartRef.current = new Chart(ctx, { type: "bar", data: dataBarGraphRef.current, options: optionsBarGraphRef.current,  });
        setDataBarGraph({
          labels: axisLabelXBarGraph.current,
          datasets: [{ label: selectedAttributeMix, data: axisYBarGraph, backgroundColor: "rgba(75,192,192,0.2)", borderColor: "rgba(75,192,192,1)", borderWidth: 1 }],
        })
      } else {
        console.log(`Unexpected ${typeGraph}`);
      }
    };

    updateOptions();
  }, [selectedAttributeMix, selectedAxisY, infoMusicList, typeGraph]);

  // Set visualization type
  const handleChangeSelection = (value) => {
    value === "Number of matches per recording"
      || value === "Number of matches per track"
      || value === "Number of occurences per match"
      || value === "Recording dates of matches"
      ? setTypeGraph("bar")
      : setTypeGraph("scatter");
    setSelectedAttributeMix(value);
  };

  return (
    <div className="border-solid border-2 border-[#e5e7eb]">
      <div className="metadata-header  icon flex items-center" onClick={handleToggle} >
        <BsGraphUp />
        <p className="mx-[0.5rem] my-[0.5rem]">Data Graphs</p>
        {showGraphs ? ( <FaAngleUp className="metadata-icon" /> ) : ( <FaAngleDown className="metadata-icon" /> )}
      </div>
      {showGraphs && (
        <>
          <p>The graph will adapt based on the attributes you select.</p>
          <div className="mx-[0.5rem] inline-flex items-center">
            <label>Information selection</label>
            <select className="mx-[0.5rem]" onChange={(e) => handleChangeSelection(e.target.value)} value={selectedAttributeMix} >
              {attributeMix.map((option) => ( <option key={option} value={option}> {option} </option> ))}
            </select>
          </div>
          {/* <div> <label>Axis Y </label> <select onChange={(e) => handleChangeAxisY(e.target.value)} value={selectedAxisY} > {attributesOptions.map((option) => ( <option key={option} value={option}> {option} </option> ))} </select> </div> */}

          {/* {typeGraph === "scatter" && ( <Scatter data={dataScatter} options={optionsScatter} /> )} */}
          {/* {typeGraph === "bar" && ( <Bar data={dataBarGraph.current} options={optionsBarGraph} /> )} */}
          <div className="chartArea">
            {typeGraph === "bar" && (<BarChart data={axisYBarGraph} labels={axisLabelXBarGraph} title={selectedAttributeMix} />)}
            {typeGraph === "scatter" && (<ScatterChart data={axisYBarGraph} labels={axisLabelXBarGraph} title={selectedAttributeMix} />)}
          </div>
        </>
      )}
    </div>
  );
};

export default GraphsResults;
