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
import SelectionDropdown from './SelectionDropdown';

const arrayStrPitchesToNotes = (arrStrNotes) => {
  if (typeof arrStrNotes !== "string") {
    console.log("issue with arrStrNotes: ", arrStrNotes);
  }
  return arrStrNotes.split("-").map((a, i) => MIDItoNote[a].replaceAll("s", "")).join('-');
}
// Making the assumption labels is thus: ["1963-12-20",...] and data: [4,...]
const generateAllValuesYears = (labels, data) => {
  let result = {};
  for (let i = 0; i < labels.length; i++) {
    // console.log("---- i: ",i,", label_i: ",labels[i],", label_i+1: ",labels[i+1],", data_i: ",data[i]);
    const [year, month, day] = labels[i].split("-").map(a => parseInt(a));
    const nextYear = labels[i + 1] ? parseInt(labels[i + 1].split("-")[0]) : null;
    // console.log("year: ",year,", nextYear: ",nextYear,", labels[i+1]: ",labels[i+1],", typeof parseInt(labels[i+1]): ",typeof parseInt(labels[i+1]),", parseInt(labels[i+1]): ",parseInt(labels[i+1]),", !isNaN(year): ",!isNaN(year),", !isNaN(nextYear): ",!isNaN(nextYear));

    if (!isNaN(year) && !isNaN(nextYear)) {
      // console.log("!isNaN(year) && !isNaN(nextYear) ~ result[year]: ",result[year]);
      if (result[year]) {
        result[year] += data[i];
      } else {
        result[year] = data[i];
      }

      if (!isNaN(nextYear) && (year < nextYear)) {
        // console.log("year<nextYear");
        for (let j = year + 1; j < nextYear; j++) {
          console.log("- j: ", j);
          result[j] = 0;
        }
      }
    }
    console.log("result[year]: ", result[year]);
  }
  console.log("generateAllYears - result: ", result);
  return result;
};
const extractInfo = (listItem, infoMusicList) => {
  // console.log("extractInfo | listItem: ",listItem);
  const trackWithoutT = listItem.track.replace('-T', '_');
  const correspondingInfo = infoMusicList.find((info) => info.SJA_ID === trackWithoutT);
  // console.log("extractInfo | correspondingInfo: ", correspondingInfo);
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
const countOccurrences_notesYear = (listSearchRes, infoMusicList) => {
  const occurrences = {};
  // console.log("countOccurrences_notesYear | listSearchRes: ",listSearchRes)
  listSearchRes.forEach((listItem) => {
    const { arrNotes, year } = extractInfo(listItem,infoMusicList);
    const key = `${arrNotes}/${year}`;
    occurrences[key] = (occurrences[key] || 0) + 1;
  });
  return occurrences;
};
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


const GraphsResults = ({ infoMusicList, oldSearch, listSearchRes }) => {
  console.log("~~ GraphsResults - infoMusicList: ", infoMusicList, ", oldSearch: ", oldSearch, ", listSearchRes: ", listSearchRes);
  const [showGraphs, setShowGraphs] = useState(false);
  const handleToggle = () => { setShowGraphs(!showGraphs); };
  

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
    "Matches per pattern",
    "Matches per artist and year",
    "Matches per pattern and year",
    // "Matches per recording and track", // TODO
    // "Occurences per recording and years" // TODO
    // "Occurences per tracks and years" // kind of lame, right?
  ];

  const [showLoadingIcon, setShowLoadingIcon] = useState(false);

  // Calculation of attributes for display - START 
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

  const mapRecordingToName = listSearchRes.reduce((acc, element) => {
    const lognumber = element.lognumber;
    const eventName = infoMusicList.find(a => a.lognumber === lognumber)?.['(E) Event Name'] || lognumber;
    acc[lognumber] = eventName;
    return acc;
  }, {});

  const mapTrackToName = listSearchRes.reduce((acc, element) => {
    const sjaId = element.track.replace(/-T/g, '_');
    const trackTitle = infoMusicList.find(a => a['SJA_ID'] === sjaId)?.['Track Title'] || null;
    acc[sjaId] = trackTitle;
    return acc;
  }, {});

  const mapTrackToArtist = listSearchRes.reduce((acc, element) => {
    const sjaId = element.track.replace(/-T/g, '_');
    const artist = infoMusicList.find(a => a['SJA_ID'] === sjaId)?.['(N) Named Artist(s)'] || null;
    acc[sjaId] = artist;
    return acc;
  }, {});

  const mapTrackToIso = listSearchRes.reduce((acc, element) => {
    const sjaId = element.track.replace(/-T/g, '_');
    const isoDate = infoMusicList.find(a => a['SJA_ID'] === sjaId)
      ? `${infoMusicList.find(a => a['SJA_ID'] === sjaId)['Event Year']}-` +
        `${infoMusicList.find(a => a['SJA_ID'] === sjaId)['Event Month']}-` +
        `${infoMusicList.find(a => a['SJA_ID'] === sjaId)['Event Day']}`
      : null;
    acc[sjaId] = isoDate;
    return acc;
  }, {});

  const mapTrackTo_artist_count_iso = [...new Set(listSearchRes.map(element => element.track.replace(/-T/g, '_')))]
  .map(b => ({
    track: b,
    x: infoMusicList.find(a => a['SJA_ID'] === b)
      ? `${infoMusicList.find(a => a['SJA_ID'] === b)['Event Year']}-` +
        `${infoMusicList.find(a => a['SJA_ID'] === b)['Event Month']}-` +
        `${infoMusicList.find(a => a['SJA_ID'] === b)['Event Day']}`
      : null,
    y: infoMusicList.find(a => a['SJA_ID'] === b)?.['(N) Named Artist(s)'] || null,
    count: tracksCount[b]
  }));

const sortedArray_track_artist_count_iso = mapTrackTo_artist_count_iso
  .sort((a, b) => {
    const dateA = new Date(a.x), dateB = new Date(b.x);
    return dateA - dateB;
  });

  let mapMatchToYear_iso = {}; 
  let strCountOccurences_notesYear = countOccurrences_notesYear(listSearchRes, infoMusicList);

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

  const mapTrackToRecordingCount = [...new Set(listSearchRes.map(element => element.track.replace(/-T/g, '_')))]
    .reduce((acc, b) => {
      const recording = infoMusicList.find(a => a['SJA_ID'] === b);
      const recordingName = recording ? '' + recording['(E) Event Name'] : null;
      const trackTitle = recording ? recording['Track Title'] : null;
      const count = tracksCount[b];

      acc[b] = { recording: recordingName, track: trackTitle, count };
      return acc;
    }, {});
  const recordingsCount = Object.entries(mapRecordingToName).reduce((acc, [key, value]) => {
    acc[value] = (acc[value] || 0) + lognumbersCount[key];
    return acc;
  }, {});
  const trackNamesCount = Object.entries(mapTrackToName).reduce((acc, [key, value]) => {
    acc[value] = (acc[value] || 0) + tracksCount[key];
    return acc;
  }, {});
  const mapMelodyToCount = uniqueMelodiesStr.reduce((acc, b) => {
    acc[b] = listSearchRes.filter(a => a.arrNotes.join('-') === b).length;
    return acc;
  }, {});
  const melodyArtistsCount = Object.entries(mapTrackToArtist).reduce((acc, [key, value]) => {
    acc[value] = (acc[value] || 0) + tracksCount[key];
    return acc;
  }, {});

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

  const [sortedMelodyCount, setSortedMelodyCount] = useState(() => {
    const keys = Object.keys(filteredMapMelodyCount).sort();
    const sortedCount = {};
    for (let i in keys) { sortedCount[keys[i]] = filteredMapMelodyCount[keys[i]]; }
    return sortedCount;
  });
  console.log("- sortedMelodyCount: ", sortedMelodyCount,", length: ",Object.keys(sortedMelodyCount).length);
  // -- calculation of attributes for display - END

  // -- BarGraph
  // Sample data
  const [axisLabelXBarGraph, setAxisLabelXBarGraph] = useState([]);
  const [axisYBarGraph, setAxisYBarGraph] = useState([]);

  const [axisXBarMatchesYear, setAxisXBarMatchesYear] = useState([]);
  const [axisXBarMatchesRecording, setAxisXBarMatchesRecording] = useState([]);
  const [axisXBarMatchesTrack, setAxisXBarMatchesTrack] = useState([]);
  const [axisXBarMatchesArtist, setAxisXBarMatchesArtist] = useState([]);
  const [axisYBarMatchesYear, setAxisYBarMatchesYear] = useState([]);
  const [axisYBarMatchesRecording, setAxisYBarMatchesRecording] = useState([]);
  const [axisYBarMatchesTrack, setAxisYBarMatchesTrack] = useState([]);
  const [axisYBarMatchesArtist, setAxisYBarMatchesArtist] = useState([]);

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

        if (selectedAttributeMix === "Matches per artist and year"){
          setArrayDataBubble(sortedArray_track_artist_count_iso)
        }
        if (selectedAttributeMix === "Matches per pattern and year") {
          setArrayDataBubble(mapMatchToYear_iso);
        }

      // } else if (typeGraph === "histogram") {
      //   let filledUpDates = generateAllValuesYears(Object.keys(sortedIso), Object.values(sortedIso));
      //   if (selectedAttributeMix === "Matches per year"){setAxisLabelXBarGraph(Object.keys(filledUpDates))}
      //   if (selectedAttributeMix === "Matches per year"){ setAxisYBarGraph(Object.values(filledUpDates)) }
      } else if (typeGraph === "bar") {
        if (selectedAttributeMix === "Matches per track"){ setAxisLabelXBarGraph(Object.keys(trackNamesCount)) }
        if (selectedAttributeMix === "Matches per recording"){ setAxisLabelXBarGraph(Object.keys(recordingsCount)) }
        if (selectedAttributeMix === "Matches per pattern"){ setAxisLabelXBarGraph(Object.keys(sortedMelodyCount)) }
        if (selectedAttributeMix === "Matches per artist"){ setAxisLabelXBarGraph(Object.keys(melodyArtistsCount)) }

        // Work in progrress: adapt for this to be the data object in the datasets object, based on selectedAxisY        
        if (selectedAttributeMix === "Matches per track") { setAxisYBarGraph(Object.values(trackNamesCount)) }
        if (selectedAttributeMix === "Matches per recording") { setAxisYBarGraph(Object.values(recordingsCount)); }
        if (selectedAttributeMix === "Matches per pattern") { setAxisYBarGraph(Object.values(sortedMelodyCount)); }
        if (selectedAttributeMix === "Matches per artist"){ setAxisYBarGraph(Object.values(melodyArtistsCount)) }

      } else {
        console.log(`Unexpected ${typeGraph}`);
      }
    };
    updateOptions();
  }, [selectedAttributeMix, selectedAxisY, infoMusicList, typeGraph]);


  useEffect(()=>{
    // Set up date in javascript format
    console.log("~~ GraphsResult |useEffect| infoMusicList: ",infoMusicList,", listSearchRes: ",listSearchRes);
    const datesCount = {};
    let mapRecordingToDate = {};
    [...new Set(listSearchRes.map(element => element.lognumber))]
      .map(b => mapRecordingToDate[b] =
        infoMusicList.filter(a => a.lognumber === b)[0]
          ? infoMusicList.filter(a => a.lognumber === b)[0]['dateEvent']
          : null)
    for (let i in mapRecordingToDate) { datesCount[mapRecordingToDate[i]] = lognumbersCount[i] }
    console.log("- |useEffect| datesCount: ",datesCount);
    let keysTime = [];
    let valuesTime = [];
  

    for (let a in infoMusicList) {
      infoMusicList[a].dateEvent = infoMusicList[a]['Event Year']
        ? new Date(infoMusicList[a]['Event Year'], infoMusicList[a]['Event Month'] !== '' ? infoMusicList[a]['Event Month'] : 1, infoMusicList[a]['Event Day'] !== '' ? infoMusicList[a]['Event Day'] : 1)
        : null
    }

    let objIso = {}
    if (datesCount[undefined]) {
      console.log("datesCount[undefined], we do nothing.");
    } else {
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
      for (let i in Object.keys(objIso).sort()) {
        sortedIso[Object.keys(objIso).sort()[i]] = objIso[Object.keys(objIso).sort()[i]]
      }

      let filledUpDates = generateAllValuesYears(Object.keys(sortedIso), Object.values(sortedIso));
      setAxisXBarMatchesYear(Object.keys(filledUpDates));
      setAxisXBarMatchesYear(Object.values(filledUpDates));
    }
  })

  // Set visualization type
  const handleChangeSelection = (value) => {
    setShowLoadingIcon(true);
    (value === "Matches per recording" || value === "Matches per track" || value === "Matches per pattern" || value === "Matches per artist") ?
      setTypeGraph("bar")
      : (value === "Matches per year") ?
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
          <SelectionDropdown
            attributeMix={attributeMix}
            selectedAttributeMix={selectedAttributeMix}
            onChange={handleChangeSelection}
          />
          {/* <div className="mx-[0.5rem] inline-flex items-center">
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
          </div> */}
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
                  ? (selectedAttributeMix==="Matches per pattern and year")
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
                // mergePerYear={selectedAttributeMix==="Matches per pattern and year"?false:true} // Need to adapt based on another attribute
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
