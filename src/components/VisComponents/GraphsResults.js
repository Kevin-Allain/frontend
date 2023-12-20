import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Tooltip, Legend,
} from "chart.js";
import MIDItoNote from "../MusicInterface/MIDItoNote.json";
import BarChart from "./BarChart";
import ScatterChart from "./ScatterChart";
import HistogramChart from "./HistogramChart";
import './GraphsResults.css'

const arrayStrPitchesToNotes = (arrStrNotes) => { return arrStrNotes.split("-").map((a, i) => MIDItoNote[a].replaceAll("s", "")).join('-'); }

function mergeDuplicates(data) {
  const result = [];
  // Create a map to store the sums of 'r' values for each unique combination of 'x' and 'y'
  const sumMap = new Map();
  // Iterate through the original array
  data.forEach(item => {
    const { x, y, r } = item;
    const key = `${x}*${y}`;
    // If the combination of 'x' and 'y' is already in the map, add 'r' to the existing sum
    if (sumMap.has(key)) {
      sumMap.set(key, sumMap.get(key) + r);
    } else {
      // If it's a new combination, add it to the map with the current 'r' value
      sumMap.set(key, r);
    }
  });
  // Find the minimum and maximum sums
  let minSum = Number.POSITIVE_INFINITY;
  let maxSum = Number.NEGATIVE_INFINITY;
  console.log("sumMap: ",sumMap);
  sumMap.forEach(sum => {
    minSum = Math.min(minSum, sum);
    maxSum = Math.max(maxSum, sum);
  });
  // Convert the map back to an array of objects with adjusted 'r' values
  sumMap.forEach((sum, key) => {
    const [x, y] = key.split('*');
    // Adjust 'r' to be between 5 and 30
    // TODO: do we actually want to scale the data? => normalize?
    const adjustedR = Math.max(5, Math.min(30, 
      Math.round((sum - minSum) / ((maxSum-minSum===0)?1:maxSum-minSum) * 25 + 5 )
    ));
    result.push({ x, y, r: adjustedR });
  });
  return result;
}



// Making the assumption labels is thus: ["1963-12-20",...] and data: [4,...]
const generateAllValuesYears = (labels,data) => {
  let result = {};
  for( let i=0; i<labels.length; i++ ){
    // console.log("---- i: ",i,", label_i: ",labels[i],", label_i+1: ",labels[i+1],", data_i: ",data[i]);
    const [year, month, day] = labels[i].split("-").map(a => parseInt(a) );
    const nextYear = labels[i+1]?parseInt(labels[i+1].split("-")[0]):null;
    // console.log("year: ",year,", nextYear: ",nextYear,", labels[i+1]: ",labels[i+1],", typeof parseInt(labels[i+1]): ",typeof parseInt(labels[i+1]),", parseInt(labels[i+1]): ",parseInt(labels[i+1]),", !isNaN(year): ",!isNaN(year),", !isNaN(nextYear): ",!isNaN(nextYear));

    if (!isNaN(year) && !isNaN(nextYear)){
          // console.log("!isNaN(year) && !isNaN(nextYear) ~ result[year]: ",result[year]);
          if(result[year]){
              result[year]+=data[i];
          } else {
            result[year]=data[i];
          }
          
        if( !isNaN(nextYear) && (year<nextYear) ) {
                // console.log("year<nextYear");
                for(let j = year+1; j<nextYear; j++){
                    console.log("- j: ",j);
                    result[j]=0;
                }
            }
          }
      console.log("result[year]: ",result[year]);
      }
  console.log("generateAllYears - result: ", result);
  return result;
};


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

  // TODO change this
  const dataInput = infoMusicList;
  ChartJS.register(LinearScale, CategoryScale, PointElement, BarElement, LineElement, Tooltip, Legend);

  // ---- Using a reference example
  // Inspiration with useRef
  // https://codesandbox.io/s/example-chartjs-and-useref-wlq78?file=/src/Components/ExampleChart.jsx:209-229
  // We should: Set the selection of attributeMix in this component.
  // Then: pass the data to components that will have the graph drawn.

  // Shared parameters
  const [typeGraph, setTypeGraph] = useState("bar");
  const [selectedAttributeMix, setSelectedAttributeMix] = useState("Number of matches per recording");
  const [selectedAxisY, setSelectedAxisY] = useState("Release Month");
  const attributesOptions = ["Release Year", "Release Month", "Track Title", "Recording", "Artists"];
  // attributeMix can relate to a single attribute. What matters is we set the selection for the axes
  const attributeMix = [ 
    "Recording years of matches",
    "Number of matches per recording",
    "Number of matches per track",
    "Number of matches per artist",
    "Number of occurences per match",
    "Number of melodies per artist and year"
  ];

  // Derived parameters (might require making calls to the database)
  const [numMelodies, setMumMelodies] = useState(listSearchRes.length);
  const [percMatchesCount, setPercMatchesCount] = useState(listSearchRes.reduce((acc, obj) => {
    const value = obj.distCalc; if (acc[value]) { acc[value]++; } else { acc[value] = 1; } return acc;
  }, {}));
  // percMatchesCount is OK
  const [lognumbersCount, setLognumbersCount] = useState(listSearchRes.reduce((acc, obj) => {
    const value = obj.lognumber;
    if (acc[value]) { acc[value]++; } else { acc[value] = 1; }
    return acc;
  }, {}))
  console.log("- lognumbersCount: ",lognumbersCount, "count: ", Object.values(lognumbersCount).reduce((partialSum, a) => partialSum + a, 0));
  const [tracksCount, setTracksCount] = useState(
    listSearchRes.reduce((acc, obj) => {
    // const value = obj.track;
    const value = obj.track.replace(/-T/g, '_');
    if (acc[value]) { acc[value]++; } else { acc[value] = 1; }
    return acc;
  }, {}));
  // lognumbersCount is OK
  console.log("- tracksCount: ",tracksCount, "count: ", Object.values(tracksCount).reduce((partialSum, a) => partialSum + a, 0) )
  
  const [uniqueMelodiesStr, setUniqueMelodiesStr] = useState([...new Set(listSearchRes.map(a => a.arrNotes.join('-')))]);
  const [uniqueArtists, setUniqueArtists] = useState([...new Set(infoMusicList.map(a => a['(N) Named Artist(s)'] ))]);
  console.log("- uniqueArtists: ",uniqueArtists," - uniqueMelodiesStr: ",uniqueMelodiesStr);

  const mapRecordingToName = {};
  [...new Set(listSearchRes.map(element => element.lognumber))].map(b => mapRecordingToName[b] =
      infoMusicList.filter(a => a.lognumber === b)[0]
        ? infoMusicList.filter(a => a.lognumber === b)[0]['(E) Event Name']
        : b) // was null previously
  console.log("- mapRecordingToName: ",mapRecordingToName);
  const mapTrackToName = {};
  [...new Set(listSearchRes.map(element => element.track.replace(/-T/g, '_')))].map(b => mapTrackToName[b] =
      infoMusicList.filter(a => a['SJA_ID'] === b)[0]
        ? infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Track Title']
        : null)
  console.log("- mapTrackToName: ",mapTrackToName);
  const mapTrackToArtist = {};
  [...new Set(listSearchRes.map(element => element.track.replace(/-T/g, '_')))].map(b => mapTrackToArtist[b] =
      infoMusicList.filter(a => a['SJA_ID'] === b)[0]
        ? infoMusicList.filter(a => a['SJA_ID'] === b)[0]['(N) Named Artist(s)']
        : null)
  console.log("- mapTrackToArtist: ",mapTrackToArtist);

  const mapTrackToIso = {};
  [...new Set(listSearchRes.map(element => element.track.replace(/-T/g, '_')))].map(b => mapTrackToIso[b] =
    (infoMusicList.filter(a => a['SJA_ID'] === b)[0]) 
    ? (''+infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Event Year']+'-'
          +infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Event Month']+'-'
          +infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Event Day']
      )
    : null)
  console.log("- mapTrackToIso: ",mapTrackToIso);

  // TODO work in progress. We should make an object trackTo_artist_count_iso
  // TODO Might create an aggregations by year, and add empty years...
  const mapTrackTo_artist_count_iso = {};
  [...new Set(listSearchRes.map(element => element.track.replace(/-T/g, '_')))]
    .map(b => mapTrackTo_artist_count_iso[b] =
    {
      'iso':
        ((infoMusicList.filter(a => a['SJA_ID'] === b)[0])
          ? ('' + infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Event Year'] + '-'
            + infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Event Month'] + '-'
            + infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Event Day']
          )
          : null),
      'artist':
        (infoMusicList.filter(a => a['SJA_ID'] === b)[0]
          ? infoMusicList.filter(a => a['SJA_ID'] === b)[0]['(N) Named Artist(s)']
          : null),
      'count':
        tracksCount[b]
    }
    )
    console.log("- mapTrackTo_artist_count_iso: ",mapTrackTo_artist_count_iso);
    let sortedArray_track_artist_count_iso = Object.entries(mapTrackTo_artist_count_iso).map(([key, value]) => ({
      track: key,
      ...value
    })).sort((a, b) => {
      let dateA = new Date(a.iso), dateB = new Date(b.iso);
      return dateA - dateB;
    });
    
    console.log("- sortedArray_track_artist_count_iso: ",sortedArray_track_artist_count_iso);
    console.log("keys tracksCount: ",Object.keys(tracksCount),", keys mapTrackTo_artist_count_iso: ",Object.keys(mapTrackTo_artist_count_iso));

  const recordingsCount = {}
  for (let i in mapRecordingToName) { 
    recordingsCount[mapRecordingToName[i]] = recordingsCount[mapRecordingToName[i]]? recordingsCount[mapRecordingToName[i]]+lognumbersCount[i] : lognumbersCount[i];
  }
  
  // recordingsCount is OK
  console.log("- recordingsCount: ",recordingsCount, "count: ", Object.values(recordingsCount).reduce((partialSum, a) => partialSum + a, 0));
  const trackNamesCount = {};
  for (let i in mapTrackToName) { 
    trackNamesCount[mapTrackToName[i]] = 
      trackNamesCount[mapTrackToName[i]]
      ? trackNamesCount[mapTrackToName[i]] + tracksCount[i]  //trackNamesCount[mapTrackToName[i]] + tracksCount[i.substring(0,i.lastIndexOf('_'))+'-T'+i.substring(i.lastIndexOf('_')+1)] 
      : tracksCount[i]; //tracksCount[i.substring(0,i.lastIndexOf('_'))+'-T'+i.substring(i.lastIndexOf('_')+1)]; 
  }
  console.log("- trackNamesCount: ",trackNamesCount, "count: ", Object.values(trackNamesCount).reduce((partialSum, a) => partialSum + a, 0));
  const mapMelodyToCount = {};
  uniqueMelodiesStr.map(
    b => mapMelodyToCount[b] = listSearchRes.map(a => a.arrNotes.join('-')).filter(a => a === b).length
  );
  console.log("- mapMelodyToCount: ",mapMelodyToCount, "count: ", Object.values(mapMelodyToCount).reduce((partialSum, a) => partialSum + a, 0));
  
  // mapMelodyToCount is OK
  const melodyArtistsCount = {};
  const melodyCountPerArtistAndYearTime ={}
  for (let i in mapTrackToArtist) { 
    melodyArtistsCount[mapTrackToArtist[i]] = (melodyArtistsCount[ mapTrackToArtist[i] ])
      ? melodyArtistsCount[mapTrackToArtist[i]] + tracksCount[i] //melodyArtistsCount[mapTrackToArtist[i]] + tracksCount[ i.substring(0, i.lastIndexOf("_"))+"-T"+i.substring(i.lastIndexOf("_") + 1)]
      : tracksCount[i];//tracksCount[i.substring(0, i.lastIndexOf("_")) +"-T" +i.substring(i.lastIndexOf("_") + 1)];
  }
  // trackArtistsCount is OK
  console.log("- melodyArtistsCount: ",melodyArtistsCount, "count: ", Object.values(melodyArtistsCount).reduce((partialSum, a) => partialSum + a, 0));

  // TODO Current version is based on cases with only 1 occurence being filtered out if they represent less than 80%. Not very stable. A hard limit could be added.
  // if 1 represents a high number of the results... then just go with it...
  // Are they ordered?! Sort first
  const firstIndex1 = Object.values(mapMelodyToCount).sort().indexOf(1);
  const lastIndex1 = Object.values(mapMelodyToCount).sort().lastIndexOf(1);
  const rangeIndex1 = lastIndex1 - firstIndex1;
  let filteredMapMelodyCount = {};
  if (rangeIndex1 / numMelodies > 0.80) {
    console.log("No filter");
    // filteredMapMelodyCount = mapMelodyToCount;
    for (let k in mapMelodyToCount) {
      filteredMapMelodyCount[arrayStrPitchesToNotes(k)] = filteredMapMelodyCount[arrayStrPitchesToNotes(k)]
      ? filteredMapMelodyCount[arrayStrPitchesToNotes(k)] + mapMelodyToCount[k] 
      : mapMelodyToCount[k];
    }
  } else {
    console.log("Filter");
    const numberFilterMelodyCount = 2;
    for (let k in mapMelodyToCount) {
      if (mapMelodyToCount[k] > numberFilterMelodyCount) { 
        filteredMapMelodyCount[arrayStrPitchesToNotes(k)] = filteredMapMelodyCount[arrayStrPitchesToNotes(k)]
        ? filteredMapMelodyCount[arrayStrPitchesToNotes(k)] + mapMelodyToCount[k] 
        : mapMelodyToCount[k];
      }
    }
  }
  console.log("- filteredMapMelodyCount: ", filteredMapMelodyCount,", length: ",Object.keys(filteredMapMelodyCount).length);
  let sortedMelodyCount = {}
  for (let i in Object.keys(filteredMapMelodyCount).sort()) {
    sortedMelodyCount[Object.keys(filteredMapMelodyCount).sort()[i]] =
      filteredMapMelodyCount[Object.keys(filteredMapMelodyCount).sort()[i]]
  }
  console.log("- sortedMelodyCount: ", sortedMelodyCount,", length: ",Object.keys(sortedMelodyCount).length);


  const datesCount = {};
  let mapRecordingToDate = {};
  [...new Set(listSearchRes.map(element => element.lognumber))]
    .map(b => mapRecordingToDate[b] =
      infoMusicList.filter(a => a.lognumber === b)[0]
        ? infoMusicList.filter(a => a.lognumber === b)[0]['dateEvent']
        : null)
  for (let i in mapRecordingToDate) { datesCount[mapRecordingToDate[i]] = lognumbersCount[i] }
  console.log("- datesCount: ",datesCount);
  let keysTime = [];
  let valuesTime = [];
  let objIso = {}
  if (datesCount[null]) {
    keysTime = Object.keys(datesCount).filter(a => a !== 'null').map(a => new Date(a).toISOString().split('T')[0])
    valuesTime = Object.values(datesCount).slice(1)
    for (let i in keysTime) { objIso[keysTime[i]] = valuesTime[i] }
    objIso["No date"] = datesCount[null];
  } else {
    keysTime = Object.keys(datesCount).map(a => new Date(a).toISOString().split('T')[0])
    valuesTime = Object.values(datesCount)
    for (let i in keysTime) { objIso[keysTime[i]] = valuesTime[i] }
  }
  console.log("- objIso: ", objIso);
  let sortedIso = {}
  for (let i in Object.keys(objIso).sort()){
      sortedIso[Object.keys(objIso).sort()[i]] = objIso[Object.keys(objIso).sort()[i]]
  }
  console.log("- sortedIso: ", sortedIso, ", numMelodies: ", numMelodies, ", percMatchesCount: ", percMatchesCount, ", lognumbersCount: ", lognumbersCount, ", tracksCount: ", tracksCount, ", mapRecordingToName: ", mapRecordingToName, ", mapTrackToName: ", mapTrackToName);

  // ---- Parameters specific to certain graphs
  // -- Scatter
  // Assuming dataScatter is calculated based on selectedAttributeMix, selectedAxisY, and typeGraph
  const [dataScatter, setDataScatter] = useState({
    datasets: [
      {
        label: `${selectedAttributeMix} and ${selectedAxisY}`,
        data: dataInput
          .map((item, i) => selectedAttributeMix !== "Release Year" || ((selectedAttributeMix === "Release Year" || selectedAttributeMix === "Release Month") && Number(item[selectedAttributeMix]) !== 0) ||
            ((selectedAxisY === "Release Year" || selectedAxisY === "Release Month") && Number(item[selectedAttributeMix]) !== 0)
              ? { x: Number(item[selectedAttributeMix]), y: Number(item[selectedAxisY]), } : null
          )
          .filter((a) => a)
          .filter((a) => !isNaN(a.x) && !isNaN(a.y)),
        backgroundColor: "rgb(255, 99, 132)",
      },
    ],
  });
  const [optionsScatter, setOptionsScatter] = useState({ 
    scales: { x: { beginAtZero: false }, y: { beginAtZero: false } }, 
  });

  const [labelsXscatter, setLabelsXscatter] = useState([]);
  const [labelsYscatter, setLabelsYscatter] = useState([]);
  const [valsScatter, setValscatter] = useState([]);
  // -- BarGraph
  // Sample data
  const [axisLabelXBarGraph, setAxisLabelXBarGraph] = useState(["Category A", "Category B", "Category C", "Category D", "Category E",]);
  const [axisYBarGraph, setAxisYBarGraph] = useState([10, 20, 15, 25, 18]);

  // Chart data
  const[dataBarGraph, setDataBarGraph] = useState({
    labels: axisLabelXBarGraph,
    datasets: [
      { label: "Sample Bar Chart", data: axisYBarGraph, backgroundColor: "rgba(75,192,192,0.2)", borderColor: "rgba(75,192,192,1)", borderWidth: 1, },
    ],
  });
  // ----

  useEffect(() => {
    // This is called each time there is a call to change selectedAttributeMix or selectedAxisY
    // console.log("dataBarGraph: ",dataBarGraph,", axisLabelXBarGraph: ",axisLabelXBarGraph,", axisYBarGraph: ",axisYBarGraph);

    const updateOptions = () => {
      if (typeGraph === "scatter") {
        console.log("Work in progress for scatter. We want to display information for ", "Number of melodies per artist and year");
        // This might not be useful this way.
        const minAxisX = selectedAttributeMix === "Release Month"? 1 : selectedAttributeMix === "Release Year"? Math.min(...infoMusicList.map((a) => Number(a["Release Year"])).filter((a) => a).filter((a) => a !== 0)) - 1 : 0;
        const maxAxisX = selectedAttributeMix === "Release Month" ? 12 : selectedAttributeMix === "Release Year" ? Math.max(...infoMusicList.map((a) => Number(a["Release Year"])).filter((a) => a).filter((a) => a !== 0)) + 1 : 100;
        const minAxisY = selectedAxisY === "Release Month"? 1 : selectedAxisY === "Release Year"? Math.min(...infoMusicList.map((a) => Number(a["Release Year"])).filter((a) => a).filter((a) => a !== 0)) - 1 : 0;
        const maxAxisY = selectedAxisY === "Release Month"? 12 : selectedAxisY === "Release Year"? Math.max(...infoMusicList.map((a) => Number(a["Release Year"])).filter((a) => a).filter((a) => a !== 0)) + 1 : 100;

        // The variables that should be changed: labelsXscatter, labelsYscatter, valsScatter
        let filledUpDates = generateAllValuesYears(Object.keys(sortedIso), Object.values(sortedIso));
        

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


      } else if (typeGraph === "histogram") {

        let filledUpDates = generateAllValuesYears(Object.keys(sortedIso), Object.values(sortedIso));
        if (selectedAttributeMix === "Recording years of matches"){setAxisLabelXBarGraph(Object.keys(filledUpDates))}
        if (selectedAttributeMix === "Recording years of matches"){ setAxisYBarGraph(Object.values(filledUpDates)) }

        setDataBarGraph({
          labels: axisLabelXBarGraph.current,
          datasets: [{ label: selectedAttributeMix, data: axisYBarGraph, backgroundColor: "rgba(75,192,192,0.2)", borderColor: "rgba(75,192,192,1)", borderWidth: 1 }],
        })

      } else if (typeGraph === "bar") {
        if (selectedAttributeMix === "Number of matches per track"){ setAxisLabelXBarGraph(Object.keys(trackNamesCount),"test") }
        if (selectedAttributeMix === "Number of matches per recording"){ setAxisLabelXBarGraph(Object.keys(recordingsCount)) }
        if (selectedAttributeMix === "Number of occurences per match"){ setAxisLabelXBarGraph(Object.keys(sortedMelodyCount)) }
        if (selectedAttributeMix === "Number of matches per artist"){ setAxisLabelXBarGraph(Object.keys(melodyArtistsCount)) }

        // Work in progrress: adapt for this to be the data object in the datasets object, based on selectedAxisY        
        if (selectedAttributeMix === "Number of matches per track") { setAxisYBarGraph(Object.values(trackNamesCount)) }
        if (selectedAttributeMix === "Number of matches per recording") { setAxisYBarGraph(Object.values(recordingsCount)); }
        if (selectedAttributeMix === "Number of occurences per match") { setAxisYBarGraph(Object.values(sortedMelodyCount)); }
        if (selectedAttributeMix === "Number of matches per artist"){ setAxisYBarGraph(Object.values(melodyArtistsCount)) }

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
    (value === "Number of matches per recording"
      || value === "Number of matches per track"
      || value === "Number of occurences per match"
      || value === "Number of matches per artist")? 
        setTypeGraph("bar") 
        : (value=== "Recording years of matches")? 
          setTypeGraph("histogram")
          : setTypeGraph("scatter");
    setSelectedAttributeMix(value);
  };

  return (
    <div className="border-solid border-2 border-[#e5e7eb]">
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
          <div className="mx-[0.5rem] inline-flex items-center">
            <label>Information selection</label>
            <select
              className="mx-[0.5rem]"
              onChange={(e) => handleChangeSelection(e.target.value)}
              value={selectedAttributeMix}
            >
              {attributeMix.map((option) => (
                <option key={option} value={option}>
                  {" "}
                  {option}{" "}
                </option>
              ))}
            </select>
          </div>
          <div className="chartArea">
            {(typeGraph === "bar" || typeGraph === "histogram") && (
              <BarChart
                data={axisYBarGraph}
                labels={axisLabelXBarGraph}
                title={selectedAttributeMix}
              />
            )}
            {/* labelsXscatter; labelsYscatter; valsScatter */}
            {typeGraph === "scatter" && (
              <ScatterChart
                data={valsScatter}
                labels={[labelsXscatter, labelsYscatter]}
                dataBubble={mergeDuplicates(
                  sortedArray_track_artist_count_iso
                    .map((a) =>
                      a.iso !== null
                        ? { x: a.iso, y: a.artist, r: a.count }
                        : null
                    )
                    .filter((a) => a !== null)
                    .filter((a) => a.x !== "--")
                )}
                title={selectedAttributeMix}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GraphsResults;
