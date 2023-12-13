import React, { useEffect, useState } from "react";
import { Scatter, Bubble } from "react-chartjs-2";

// Might use a bubble chart... 
// https://react-chartjs-2.js.org/examples/bubble-chart
const ScatterChart = ({ data, labels, title }) => {

  // -- From example online
  const options = { scales: { y: { beginAtZero: true, }, }, };
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const dataTest = {
    datasets: [
      {
        label: 'Red dataset',
        data: Array.from({ length: 50 }, () => ({
          x: Math.round(4*Math.random()) + Math.round(-4*Math.random()),
          y: Math.round(8*Math.random()) + Math.round(-8*Math.random()),
          // y: characters[Math.round(characters.length*Math.random())],
          r: Math.round(20*Math.random()) + Math.round(-20*Math.random()),
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Blue dataset',
        data: Array.from({ length: 50 }, () => ({
          x: Math.round(4*Math.random()) + Math.round(-4*Math.random()),
          y: Math.round(8*Math.random()) + Math.round(-8*Math.random()),
          // y: characters[Math.round(characters.length*Math.random())],
          r: Math.round(20*Math.random()) + Math.round(-20*Math.random()),
        })),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const dataTest2 = {
    datasets: [
      {
        label: title,
        data: [
          { x: 'Category A', y: 'Type 1', r: 10 },
          { x: 'Category B', y: 'Type 2', r: 20 },
          { x: 'Category C', y: 'Type 1', r: 15 },
          { x: 'Category C', y: 'Type 4', r: 5  },
          { x: 'Category E', y: 'Type 3', r: 35 },
          { x: 'Category F', y: 'Type 2', r: 15 },
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };
  const optionsTest2 = {
    scales: {
      x: {
        type: 'category', // Use a category scale for text on the X-axis
        labels: ['Category A', 'Category B', 'Category C', 'Category D', 'Category E', 'Category F'],
      },
      y: {
        type: 'category', // Use a category scale for text on the Y-axis
        labels: ['Type 1', 'Type 2', 'Type 3', 'Type 4'],
      },
    },
  };

  console.log("dataTest: ",dataTest,", dataTest2: ",dataTest2);
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

  return <>
    <h1>Work in progress</h1>
    <Bubble options={optionsTest2} data={dataTest2} />
  </>
    ;
  // return <>Work in progress</>
};

export default ScatterChart;
