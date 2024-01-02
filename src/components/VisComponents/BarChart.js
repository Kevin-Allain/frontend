import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

// Pagination helps, but we should consider having it sorted prior to passing it.
const BarChart = ({ data, labels, title, setShowLoadingIcon }) => {
  console.log("~~~~ BarChart | data: ",data,", labels: ",labels,", typeof labels[0]: ",(typeof labels[0]));
  
  const itemsPerPage = title==="Matches per year"?100:50;
  const [currentPage, setCurrentPage] = useState(0);

  const startIndex = (currentPage) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, labels.length);
  const visibleLabels = labels.slice(startIndex, endIndex);
  const visibleData = data.slice(startIndex, endIndex);

  // Should it be adapted for y axis as well?
  const calculateFontSize = (numberOfLabels) => {
    // Define your criteria for font size adaptation
    const baseFontSize = 14; // Initial font size
    // Gradually decrease font size as the number of labels increases
    const adaptedFontSize = isFinite(Math.round(Math.max(4, baseFontSize - Math.log(numberOfLabels * 2))))
      ? Math.round(Math.max(4, baseFontSize - Math.log(numberOfLabels * 2)))
      : 5;
    return adaptedFontSize;
  };

  // const numberOfLabels = visibleLabels.length;
  const numberOfLabels = visibleLabels.length;
  const fontSize = calculateFontSize(numberOfLabels);

  const [chartData, setChartData] = useState({
    // labels: labels,
    labels: visibleLabels,
    datasets: [
      {
        label: title,
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [optionsBarGraph, setOptionsBarGraph] = useState({
    scales: {
      x: { ticks: { font: { size: fontSize, }, autoSkip: false, maxTicksLimit: 20, maxRotation: 0, minRotation: 0, }, },
      y: { 
        ticks: { font: { size: 12, },  },
        suggestedMax: Math.max(...data), // Set to the maximum value in the data array
      },
    },
  });

  useEffect(() => {
    console.log("useEffect BarChart. ", { data, labels, title, currentPage });

    setChartData({
      // labels: labels,
      labels: visibleLabels,
      datasets: [{
        // data: data,
        data: visibleData,
        label: title,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1
      }],
    });

    setOptionsBarGraph({
      scales: {
        // x: { ticks: { font: { size: calculateFontSize(labels.length) }, autoSkip: false, }, },// maxTicksLimit: 20, maxRotation: 0, minRotation: 0,
        x: { ticks: { font: { size: calculateFontSize(visibleLabels.length) }, autoSkip: false, }, },// maxTicksLimit: 20, maxRotation: 0, minRotation: 0,
        y: { 
          ticks: { font: { size: 12 } },
          suggestedMax: Math.max(...data), // Set to the maximum value in the data array
        },
      },
    });

    setShowLoadingIcon(false);
  }, [data, labels, title, currentPage]);


  const handleNextPage = () => {
    setCurrentPage((prevPage) => 
      (prevPage === Math.floor(data.length / itemsPerPage))
        ? prevPage
        : prevPage+1 );
    console.log("handleNextPage - currentPage: ",currentPage,", the floor: ",Math.floor(data.length / itemsPerPage));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    console.log("handlePrevPage - currentPage: ",currentPage);
  };

  return (
    <div>
      <Bar data={chartData} options={optionsBarGraph} />
      <div className="inline-flex align-middle text-center">
      <FaArrowLeft className="icon" onClick={handlePrevPage} 
        disabled={currentPage === 0}/>
      <div className="mx-[10px]">Page {currentPage+1} out of {1+Math.floor(data.length/itemsPerPage)}</div>
      <FaArrowRight className="icon" onClick={handleNextPage} 
        disabled={(currentPage+1) >= (Math.floor(data.length/itemsPerPage))}/>
      </div>
    </div>
  );

};


export default BarChart;
