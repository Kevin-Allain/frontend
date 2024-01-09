import React, { useState, useEffect } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { BsGraphUp } from "react-icons/bs";
import BarChart from "./BarChart";
import ScatterChart from "./ScatterChart";
import SelectionDropdown from "./SelectionDropdown";

const GraphsResults2 = ({ infoMusicList, oldSearch, listSearchRes }) => {
  const [showGraphs, setShowGraphs] = useState(false);
  const [typeGraph, setTypeGraph] = useState("bar");
  const [selectedAttributeMix, setSelectedAttributeMix] = useState(
    "Matches per recording"
  );
  const [dataLoaded, setDataLoaded] = useState(false);

  // State to store derived data
  const [derivedData, setDerivedData] = useState({
    numMelodies: 0,
    // ... other attributes
  });

  // State to store chart data
  const [chartData, setChartData] = useState(null);
  const [chartLabels, setChartLabels] = useState(null);

  useEffect(() => {
    // Calculate derived data once when component mounts or when dependencies change
    const newDerivedData = {
      numMelodies: listSearchRes.length,
      // ... perform other calculations
    };

    setDerivedData(newDerivedData);

    // Set dataLoaded to true when processing is done
    setDataLoaded(true);
  }, [infoMusicList, listSearchRes]);

  useEffect(() => {
    // Generate data for BarChart when selectedAttributeMix or derivedData changes
    const newData = generateDataBar(selectedAttributeMix, derivedData);
    
    setChartData(newData.data);
    setChartLabels(newData.labels);
  }, [selectedAttributeMix, derivedData]);

  const generateDataBar = (attributeMix, derivedData) => {
    // Logic to generate data for BarChart based on attributeMix and derivedData
    // Replace this with your actual logic
    return {
      data: [4,7,2],
      labels: ['test 1','test 2','test 3'],
    };
  };

  const generateDataBubble = () => {
    const dataBubble = {
        datasets: [{
          label: 'First Dataset',
          data: [{
            x: 20,
            y: 30,
            r: 15
          }, {
            x: 40,
            y: 10,
            r: 10
          }],
          backgroundColor: 'rgb(255, 99, 132)'
        }]
      };
    // Logic to generate data for ScatterChart
    // Replace this with your actual logic
    return dataBubble;
  };

  const handleChangeSelection = (value) => {
    // Set selectedAttributeMix and setTypeGraph based on user selection
    setSelectedAttributeMix(value);
    setTypeGraph("bar"); // Adjust this based on your logic for scatter chart

    // You can also update other aspects of the component's state as needed
  };

  return (
    <div className="border-solid border-2 border-[#e5e7eb]">
      <div
        className="metadata-header  icon flex items-center"
        onClick={() => setShowGraphs(!showGraphs)}
      >
        <BsGraphUp />
        <p className="mx-[0.5rem] my-[0.5rem]">Data Graphs</p>
        {showGraphs ? <FaAngleUp className="metadata-icon" /> : <FaAngleDown className="metadata-icon" />}
      </div>
      {showGraphs && (
        <>
          <p>The graph will adapt based on the attributes you select.</p>
          <SelectionDropdown
            attributeMix={[
              "Matches per year",
              "Matches per recording",
              "Matches per track",
              "Matches per artist",
              "Matches per pattern",
              "Matches per artist and year",
              "Matches per pattern and year",
            ]}
            selectedAttributeMix={selectedAttributeMix}
            onChange={handleChangeSelection}
          />
          {dataLoaded ? (
            <div className="chartArea">
              {typeGraph === "bar" ? (
                <BarChart
                  data={chartData}
                  labels={chartLabels}
                  title={selectedAttributeMix}
                />
              ) : typeGraph === "scatter" ? (
                <ScatterChart
                  dataBubble={generateDataBubble()}
                  title={selectedAttributeMix}
                  mergePerYear={true}
                />
              ) : null}
            </div>
          ) : (
            <AiOutlineLoading className="spin" />
          )}
        </>
      )}
    </div>
  );
};

export default GraphsResults2;
