import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const calculateFontSize = (numberOfLabels) => {
  // Define your criteria for font size adaptation
  const baseFontSize = 14; // Initial font size

  // Gradually decrease font size as the number of labels increases
  const adaptedFontSize = isFinite(Math.round(Math.max(4, baseFontSize - Math.log(numberOfLabels * 2))))
    ? Math.round(Math.max(4, baseFontSize - Math.log(numberOfLabels * 2)))
    : 5;

  console.log("adaptedFontSize: ",adaptedFontSize);  
  return adaptedFontSize;
};


const BarChart = ({ data, labels, title }) => {
  const numberOfLabels = labels.length;
  const fontSize = calculateFontSize(numberOfLabels);

  console.log("data: ",data);

  const [chartData, setChartData] = useState({
    labels: labels,
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

  const [optionsBarGraph, setOptionsBarGraph] = useState({
    scales: {
      x: { ticks: {
          font: { size: fontSize, },
          autoSkip: false,
          maxTicksLimit: 20, // or another number that fits your design
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        ticks: { font: { size: 12, },  },
      },
    },
  });


  useEffect(() => {
    // console.log("useEffect BarChart. ",{data,labels,title});
    setChartData((prevData) => ({
      ...prevData,
      labels: labels,
      datasets: [
        {
          ...prevData.datasets[0],
          data: data,
          label: title,
        },
      ],
    }));


    setOptionsBarGraph({
      scales: {
        x: {
          ticks: {
            font: { size: calculateFontSize(labels.length), },
            autoSkip: false,
            // maxTicksLimit: 20, // or another number that fits your design
            // maxRotation: 0,
            // minRotation: 0,
          },
        },
        y: { ticks: { font: { size: 12, }, },
        },
      },
    })
  }, [data, labels, title]);

  return <Bar data={chartData} options={optionsBarGraph} />;
};

export default BarChart;
