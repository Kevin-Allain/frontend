import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import {AiOutlineLoading} from 'react-icons/ai'
import { BsGraphUp } from "react-icons/bs";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Tooltip, Legend,
} from "chart.js";
import MIDItoNote from "../MusicInterface/MIDItoNote.json";
import BarChart from "./BarChart";
import ScatterChart from "./ScatterChart";
import HistogramChart from "./HistogramChart";
import '../../App.css'
import './GraphsResults.css'

const arrayStrPitchesToNotes = (arrStrNotes) => { 
  if (typeof arrStrNotes !== "string"){
    console.log("issue with arrStrNotes: ",arrStrNotes);
  }
  return arrStrNotes.split("-").map((a, i) => MIDItoNote[a].replaceAll("s", "")).join('-'); 
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
  console.log("~~ GraphsResults - infoMusicList: ", infoMusicList, ", oldSearch: ", oldSearch, ", listSearchRes: ", listSearchRes);
  const [showGraphs, setShowGraphs] = useState(false);
  const handleToggle = () => { setShowGraphs(!showGraphs); };
  // Set up date in javascript format
  for (let a in infoMusicList) {
    infoMusicList[a].dateEvent = infoMusicList[a]['Event Year']
      ? new Date(infoMusicList[a]['Event Year'], infoMusicList[a]['Event Month'] !== '' ? infoMusicList[a]['Event Month'] : 1, infoMusicList[a]['Event Day'] !== '' ? infoMusicList[a]['Event Day'] : 1)
      : null
  }

  const dataInput = infoMusicList;
  ChartJS.register(LinearScale, CategoryScale, PointElement, BarElement, LineElement, Tooltip, Legend);

  // ---- Using a reference example
  // Inspiration with useRef
  // https://codesandbox.io/s/example-chartjs-and-useref-wlq78?file=/src/Components/ExampleChart.jsx:209-229
  // We should: Set the selection of attributeMix in this component.
  // Then: pass the data to components that will have the graph drawn.

  // Shared parameters
  const [typeGraph, setTypeGraph] = useState("bar");
  const [selectedAttributeMix, setSelectedAttributeMix] = useState("Matches per recording");
  const [selectedAxisY, setSelectedAxisY] = useState("Release Month");

  // attributeMix can relate to a single attribute. What matters is we set the selection for the axes
  const attributeMix = [ 
    "Matches per year",
    "Matches per recording",
    "Matches per track",
    "Matches per artist",
    "Occurences per match",
    "Matches per artist and year",
    "Occurences per match and year",
    // "Matches per recording and track", // TODO
    // "Occurences per recording and years" // TODO
    // "Occurences per tracks and years" // kind of lame, right?
  ];

  const [showLoadingIcon, setShowLoadingIcon] = useState(false);

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
  
  const [uniqueMelodiesStr, setUniqueMelodiesStr] = useState([...new Set(listSearchRes.map(a => a.arrNotes.join('-')))]);
  const [uniqueArtists, setUniqueArtists] = useState([...new Set(infoMusicList.map(a => a['(N) Named Artist(s)'] ))]);

  const mapRecordingToName = {};
  [...new Set(listSearchRes.map(element => element.lognumber))].map(b => mapRecordingToName[b] =
      infoMusicList.filter(a => a.lognumber === b)[0]
        ? infoMusicList.filter(a => a.lognumber === b)[0]['(E) Event Name']
        : b) // was null previously
  const mapTrackToName = {};
  [...new Set(listSearchRes.map(element => element.track.replace(/-T/g, '_')))].map(b => mapTrackToName[b] =
      infoMusicList.filter(a => a['SJA_ID'] === b)[0]
        ? infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Track Title']
        : null)
  const mapTrackToArtist = {};
  [...new Set(listSearchRes.map(element => element.track.replace(/-T/g, '_')))].map(b => mapTrackToArtist[b] =
      infoMusicList.filter(a => a['SJA_ID'] === b)[0]
        ? infoMusicList.filter(a => a['SJA_ID'] === b)[0]['(N) Named Artist(s)']
        : null)

  const mapTrackToIso = {};
  [...new Set(listSearchRes.map(element => element.track.replace(/-T/g, '_')))].map(b => mapTrackToIso[b] =
    (infoMusicList.filter(a => a['SJA_ID'] === b)[0]) 
    ? (''+infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Event Year']+'-'
          +infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Event Month']+'-'
          +infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Event Day']
      )
    : null)

  const mapTrackTo_artist_count_iso = {};
  [...new Set(listSearchRes.map(element => element.track.replace(/-T/g, '_')))]
    .map(b => mapTrackTo_artist_count_iso[b] =
    {
      'x': // iso
        ((infoMusicList.filter(a => a['SJA_ID'] === b)[0])
          ? ('' + infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Event Year'] + '-'
            + infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Event Month'] + '-'
            + infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Event Day']
          )
          : null),
      'y': // artist
        (infoMusicList.filter(a => a['SJA_ID'] === b)[0]
          ? infoMusicList.filter(a => a['SJA_ID'] === b)[0]['(N) Named Artist(s)']
          : null),
      'count':
        tracksCount[b]
    })
  let sortedArray_track_artist_count_iso = Object.entries(mapTrackTo_artist_count_iso)
    .map(([key, value]) => ({
      track: key,
      ...value
    })).sort((a, b) => {
      let dateA = new Date(a.iso), dateB = new Date(b.iso);
      return dateA - dateB;
    });

  let mapMatchToYear_iso = {}; // WIP Christmas critical
  const extractInfo = (listItem) => {
    const trackWithoutT = listItem.track.replace('-T', '_');
    const correspondingInfo = infoMusicList.find((info) => info.SJA_ID === trackWithoutT);
    if (!correspondingInfo) { return null; }
    const eventYear = correspondingInfo["Event Year"];
    const eventMonth = correspondingInfo["Event Month"];
    const eventDay = correspondingInfo["Event Day"];
    const formattedDate = `${eventYear}-${eventMonth.toString().padStart(2, '0')}-${eventDay.toString().padStart(2, '0')}`;
    return {
      arrNotes: listItem.arrNotes.map(a => MIDItoNote[a]).toString().replaceAll(',', '-'),
      year: formattedDate,
    };
  };
  // Function to count occurrences for each unique combination of arrNotes and year
  const countOccurrences_notesYear = () => {
    const occurrences = {};
    listSearchRes.forEach((listItem) => {
      const { arrNotes, year } = extractInfo(listItem);
      const key = `${arrNotes}/${year}`;
      occurrences[key] = (occurrences[key] || 0) + 1;
    });
    return occurrences;
  };
  let strCountOccurences_notesYear = countOccurrences_notesYear();
  // Function to sort the array based on the values of y
  const sortByY = (arr) => {
    return arr.sort((a, b) => (a.y > b.y ? 1 : -1));
  };
  // Function to transform the hashmap into an array of objects
  const transformToObjectsArray = (occurrencesMap) => {
    return Object.entries(occurrencesMap).map(([key, count]) => {
      const [notes, date] = key.split('/');
      return {
        x: date, y: notes, count: count,
      };
    });
  };
  const filteredMapCleanYear = Object.fromEntries(
    Object.entries(strCountOccurences_notesYear).filter(([key, value]) => {
      const [notes, datePart] = key.split('/');
      const yearPart = datePart.split('-')[0];  
      // Filter out pairs where the length of the characters for years is different than 4
      return yearPart.length === 4;
    })
  );

  mapMatchToYear_iso = transformToObjectsArray(filteredMapCleanYear);
  mapMatchToYear_iso = sortByY(mapMatchToYear_iso);

  // TODO 2023-12-22 Set this data for another view
  // TODO base type of graph based on number of elements or something...! 
  // We want to be able to compare ensembles

  const mapTrackTo_recording_count = {};
  [...new Set(listSearchRes.map(element => element.track.replace(/-T/g, '_')))]
    .map(b => mapTrackTo_recording_count[b] =
    {
      'recording':
        ((infoMusicList.filter(a => a['SJA_ID'] === b)[0])
          ? ('' + infoMusicList.filter(a => a['SJA_ID'] === b)[0]['(E) Event Name'])
          : null),
      'track':
        (infoMusicList.filter(a => a['SJA_ID'] === b)[0]
          ? infoMusicList.filter(a => a['SJA_ID'] === b)[0]['Track Title']
          : null),
      'count':
        tracksCount[b]
    }
    )
  // let sortedArray_track_recording_count = {} 

  const recordingsCount = {}
  for (let i in mapRecordingToName) { 
    recordingsCount[mapRecordingToName[i]] = recordingsCount[mapRecordingToName[i]]? recordingsCount[mapRecordingToName[i]]+lognumbersCount[i] : lognumbersCount[i];
  }
  
  // recordingsCount is OK
  const trackNamesCount = {};
  for (let i in mapTrackToName) { 
    trackNamesCount[mapTrackToName[i]] = 
      trackNamesCount[mapTrackToName[i]]
      ? trackNamesCount[mapTrackToName[i]] + tracksCount[i]  //trackNamesCount[mapTrackToName[i]] + tracksCount[i.substring(0,i.lastIndexOf('_'))+'-T'+i.substring(i.lastIndexOf('_')+1)] 
      : tracksCount[i]; //tracksCount[i.substring(0,i.lastIndexOf('_'))+'-T'+i.substring(i.lastIndexOf('_')+1)]; 
  }
  const mapMelodyToCount = {};
  uniqueMelodiesStr.map(
    b => mapMelodyToCount[b] = listSearchRes.map(a => a.arrNotes.join('-')).filter(a => a === b).length
  );
  
  // mapMelodyToCount is OK
  const melodyArtistsCount = {};
  const melodyCountPerArtistAndYearTime ={}
  for (let i in mapTrackToArtist) { 
    melodyArtistsCount[mapTrackToArtist[i]] = (melodyArtistsCount[ mapTrackToArtist[i] ])
      ? melodyArtistsCount[mapTrackToArtist[i]] + tracksCount[i] //melodyArtistsCount[mapTrackToArtist[i]] + tracksCount[ i.substring(0, i.lastIndexOf("_"))+"-T"+i.substring(i.lastIndexOf("_") + 1)]
      : tracksCount[i];//tracksCount[i.substring(0, i.lastIndexOf("_")) +"-T" +i.substring(i.lastIndexOf("_") + 1)];
  }
  // trackArtistsCount is OK
  // console.log("- melodyArtistsCount: ",melodyArtistsCount, "count: ", Object.values(melodyArtistsCount).reduce((partialSum, a) => partialSum + a, 0));

  // TODO Christmas Critical fix this...! Mediocre parameters
  // Current version is based on cases with only 1 occurence being filtered out if they represent less than 80%. Not very stable. A hard limit could be added.
  // if 1 represents a high number of the results... then just go with it...
  // if there is a low number of melodies (proper number to be determined), we don't filter
  // Are they ordered?! Sort first
  const firstIndex1 = Object.values(mapMelodyToCount).sort().indexOf(1);
  const lastIndex1 = Object.values(mapMelodyToCount).sort().lastIndexOf(1);
  const rangeIndex1 = lastIndex1 - firstIndex1;
  let filteredMapMelodyCount = {};
  if ((rangeIndex1 / numMelodies > 0.80) || numMelodies < 20 ) {
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

  let sortedIso = {}
  for (let i in Object.keys(objIso).sort()){
      sortedIso[Object.keys(objIso).sort()[i]] = objIso[Object.keys(objIso).sort()[i]]
  }

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

  const [dataBubble, setDataBubble] = useState([]);

  const [labelsXscatter, setLabelsXscatter] = useState([]);
  const [labelsYscatter, setLabelsYscatter] = useState([]);
  const [valsScatter, setValscatter] = useState([]);
  // -- BarGraph
  // Sample data
  const [axisLabelXBarGraph, setAxisLabelXBarGraph] = useState([]);
  const [axisYBarGraph, setAxisYBarGraph] = useState([]);

  // Chart data
  const[dataBarGraph, setDataBarGraph] = useState({
    labels: axisLabelXBarGraph,
    datasets: [ { label: "Sample Bar Chart", data: axisYBarGraph, backgroundColor: "rgba(75,192,192,0.2)", borderColor: "rgba(75,192,192,1)", borderWidth: 1, }, ],
  });
  const [arrayDataBubble, setArrayDataBubble] = useState([]);
  // ----

  useEffect(() => {
    // This is called each time there is a call to change selectedAttributeMix or selectedAxisY
    const updateOptions = () => {
      console.log("-- updateOptions | typeGraph: ",typeGraph,", arrayDataBubble: ",arrayDataBubble,", selectedAttributeMix: ",selectedAttributeMix);

      if (typeGraph === "scatter") {
        // The variables that should be changed: labelsXscatter, labelsYscatter, valsScatter
        // let filledUpDates = generateAllValuesYears(Object.keys(sortedIso), Object.values(sortedIso));

        // TODO change and fix... (remove?)
        setDataScatter({
          datasets: [
            {
              label: `${selectedAttributeMix}`,
              data: dataInput
                .map((item, i) =>
                  selectedAttributeMix !== "Release Year" 
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
        // TODO update here
        setOptionsScatter({
          scales: {
            x: {
              type: "linear",
              position: "bottom",
              min: 0,
              max: 0,
              ticks: { callback: function (value) { return Math.round(value); }, },
            },
            y: {
              type: "linear",
              position: "left",
              min: 0, // TODO update
              max: 0,
              ticks: { callback: function (value) { return Math.round(value); }, },
            },
          },
        });

        if (selectedAttributeMix === "Matches per artist and year"){
          setArrayDataBubble(sortedArray_track_artist_count_iso)
        }
        if (selectedAttributeMix === "Occurences per match and year") {
          setArrayDataBubble(mapMatchToYear_iso);
        }

        // console.log("typegraph is scatter. sortedArray_track_artist_count_iso: ",sortedArray_track_artist_count_iso,", arrayDataBubble: ",arrayDataBubble);

      } else if (typeGraph === "histogram") {
        let filledUpDates = generateAllValuesYears(Object.keys(sortedIso), Object.values(sortedIso));
        if (selectedAttributeMix === "Matches per year"){setAxisLabelXBarGraph(Object.keys(filledUpDates))}
        if (selectedAttributeMix === "Matches per year"){ setAxisYBarGraph(Object.values(filledUpDates)) }
        // setDataBarGraph({
        //   labels: axisLabelXBarGraph.current,
        //   datasets: [{ label: selectedAttributeMix, data: axisYBarGraph, backgroundColor: "rgba(75,192,192,0.2)", borderColor: "rgba(75,192,192,1)", borderWidth: 1 }],
        // })
      } else if (typeGraph === "bar") {
        if (selectedAttributeMix === "Matches per track"){ setAxisLabelXBarGraph(Object.keys(trackNamesCount),"test") }
        if (selectedAttributeMix === "Matches per recording"){ setAxisLabelXBarGraph(Object.keys(recordingsCount)) }
        if (selectedAttributeMix === "Occurences per match"){ setAxisLabelXBarGraph(Object.keys(sortedMelodyCount)) }
        if (selectedAttributeMix === "Matches per artist"){ setAxisLabelXBarGraph(Object.keys(melodyArtistsCount)) }

        // Work in progrress: adapt for this to be the data object in the datasets object, based on selectedAxisY        
        if (selectedAttributeMix === "Matches per track") { setAxisYBarGraph(Object.values(trackNamesCount)) }
        if (selectedAttributeMix === "Matches per recording") { setAxisYBarGraph(Object.values(recordingsCount)); }
        if (selectedAttributeMix === "Occurences per match") { setAxisYBarGraph(Object.values(sortedMelodyCount)); }
        if (selectedAttributeMix === "Matches per artist"){ setAxisYBarGraph(Object.values(melodyArtistsCount)) }

        // setDataBarGraph({
        //   labels: axisLabelXBarGraph.current,
        //   datasets: [{ label: selectedAttributeMix, data: axisYBarGraph, backgroundColor: "rgba(75,192,192,0.2)", borderColor: "rgba(75,192,192,1)", borderWidth: 1 }],
        // })
      } else {
        console.log(`Unexpected ${typeGraph}`);
      }
    };

    updateOptions();
  }, [selectedAttributeMix, selectedAxisY, infoMusicList, typeGraph]);

  // Set visualization type
  const handleChangeSelection = (value) => {
    setShowLoadingIcon(true);
    (value === "Matches per recording"
      || value === "Matches per track"
      || value === "Occurences per match"
      || value === "Matches per artist")? 
        setTypeGraph("bar") 
        : (value=== "Matches per year")? 
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
        <BsGraphUp/>
        <p className="mx-[0.5rem] my-[0.5rem]">Data Graphs</p>
        {showGraphs 
          ? ( <FaAngleUp className="metadata-icon" /> ) 
          : ( <FaAngleDown className="metadata-icon" /> )}
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
          {showLoadingIcon && <AiOutlineLoading className="spin"/>}
          <div className="chartArea">
            {(typeGraph === "bar" || typeGraph === "histogram") && (
              <BarChart
                data={axisYBarGraph}
                labels={axisLabelXBarGraph}
                title={selectedAttributeMix}
                setShowLoadingIcon={setShowLoadingIcon}
              />
            )}
            {typeGraph === "scatter" && (
              <ScatterChart
                dataBubble={
                  (arrayDataBubble.length===0)
                  ? (selectedAttributeMix==="Occurences per match and year")
                    ? setArrayDataBubble(mapMatchToYear_iso)
                    : setArrayDataBubble(sortedArray_track_artist_count_iso)
                  :arrayDataBubble
                    .map((a) =>
                      a.iso !== null
                        ? { x: a.x, y: a.y, r: a.count }
                        : null
                    )
                    .filter((a) => a !== null)
                    .filter((a) => a.x !== "--")
                }
                title={selectedAttributeMix}
                // mergePerYear={selectedAttributeMix==="Occurences per match and year"?false:true} // Need to adapt based on another attribute
                mergePerYear={true} // Need to adapt based on another attribute
                setShowLoadingIcon={setShowLoadingIcon}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GraphsResults;
