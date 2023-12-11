import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const calculateFontSize = (numberOfLabels) => {
  // Define your criteria for font size adaptation
  const baseFontSize = 14; // Initial font size

  // Gradually decrease font size as the number of labels increases
  const adaptedFontSize = isFinite(
    Math.round(Math.max(4, baseFontSize - Math.log(numberOfLabels * 2)))
  )
    ? Math.round(Math.max(4, baseFontSize - Math.log(numberOfLabels * 2)))
    : 5;

  console.log("adaptedFontSize: ", adaptedFontSize);
  return adaptedFontSize;
};

// Function to generate all months and years in the range
const generateAllYears = (labels) => {
    let result = [];
    for( let i=0; i<labels.length-1; i++ ){
      const [year, month, day] = labels[i].split("-").map(a => parseInt(a) );
      result.push(parseInt(year));
      if(
          labels[i+1] 
          && labels[i+1]!=="No date" 
          && parseInt(labels[i+1].split("-")[0]) <= year+1 
      ){
          for(let j = year; j<parseInt(labels[i+1].split("-")[0]); j++){
              result.push(parseInt(j));
          }
      }
    }
    result = result.filter(a => !isNaN(a))
    return result;
  };
  
  

// TODO work in progress 
const generateAllValuesYears = (labels,data) => {
    let result = {};
    for( let i=0; i<labels.length; i++ ){
      const [year, month, day] = labels[i].split("-").map(a => parseInt(a) );
      const nextYear = parseInt(labels[i+1].split("-")[0]);
        console.log("year: ",year,", nextYear: ",nextYear,", labels[i+1]: ",labels[i+1],", typeof parseInt(labels[i+1]): ",typeof parseInt(labels[i+1]),", parseInt(labels[i+1]): ",parseInt(labels[i+1]),", !isNaN(year): ",!isNaN(year),", !isNaN(nextYear): ",!isNaN(nextYear));
  
  if (!isNaN(year) && !isNaN(nextYear)){
        console.log("!isNaN(year) && !isNaN(nextYear)")
        if(result[year]){
            result[year]+=data[i];
        } else {
          result[year]=data[i];
        }
        
      if( !isNaN(nextYear) && (year<nextYear)
          ){
              console.log("year<nextYear");
              for(let j = year; j<nextYear; j++){
                  console.log("--- j: ",j);
                  result[j]=0;
              }
          }
        }
    }
    console.log("generateAllYears - result: ", result);
    return result;
  };
  

// Function to format a date as month-year string
const formatAsMonthYear = (date) => {
  return `${date.month}-${date.year}`;
};

const HistogramChart = ({ data, labels, title }) => {
  console.log("data: ", data, ", labels: ", labels);
  const numberOfLabels = labels.length;
  const fontSize = calculateFontSize(numberOfLabels);

  // Ensure that all months and years are included in the labels array
  const allMonthsAndYears = generateAllYears(labels);
  const updatedLabels = allMonthsAndYears.map((date) => formatAsMonthYear(date) );

  const [chartData, setChartData] = useState({
    labels: updatedLabels,
    datasets: [
      {
        label: title,
        data: data,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [optionsHistogramGraph, setOptionsHistogramGraph] = useState({
    scales: {
      x: {
        ticks: {
          font: { size: fontSize },
          autoSkip: false,
          maxTicksLimit: 20,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: { ticks: { font: { size: 12 } } },
    },
  });

  useEffect(() => {
    setChartData((prevData) => ({
      ...prevData,
      labels: updatedLabels,
      datasets: [{ ...prevData.datasets[0], data: data, label: title }],
    }));

    setOptionsHistogramGraph({
      scales: {
        x: {
          ticks: {
            font: { size: calculateFontSize(updatedLabels.length) },
            autoSkip: false,
          },
        },
        y: { ticks: { font: { size: 12 } } },
      },
    });
  }, [data, updatedLabels, title]);

  return <Bar data={chartData} options={optionsHistogramGraph} />;
};

export default HistogramChart;
