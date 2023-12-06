import React, { useEffect, useState } from "react";
import { Scatter, Bubble } from "react-chartjs-2";

// Might use a bubble chart... 
// https://react-chartjs-2.js.org/examples/bubble-chart
const ScatterChart = ({ data, labels, title }) => {

  // -- From example online
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const dataTest = {
    datasets: [
      {
        label: 'Red dataset',
        data: Array.from({ length: 50 }, () => ({
          x: Math.round(4*Math.random()) + Math.round(-4*Math.random()),
          y: Math.round(8*Math.random()) + Math.round(-8*Math.random()),
          r: Math.round(20*Math.random()) + Math.round(-20*Math.random()),
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Blue dataset',
        data: Array.from({ length: 50 }, () => ({
          x: Math.round(4*Math.random()) + Math.round(-4*Math.random()),
          y: Math.round(8*Math.random()) + Math.round(-8*Math.random()),
          r: Math.round(20*Math.random()) + Math.round(-20*Math.random()),
        })),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  console.log("dataTest: ",dataTest);
  // -- 

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
  }, [data, labels, title]);

  return <Bubble options={options} data={dataTest} />;
  // return <>Work in progress</>
};

export default ScatterChart;
