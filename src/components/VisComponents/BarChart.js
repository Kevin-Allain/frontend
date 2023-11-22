// import React, { useRef, useEffect, useState } from "react";
// import {
//     Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Tooltip, Legend,
// } from "chart.js";

// const BarChart = ({ data, labels }) => {
//     console.log("-- BarChart - data: ", data, ", labels: ", labels);
//     const chartRef = useRef(null);
//     const [myChart, setMyChart] = useState(null);
//     useEffect(() => {
//         if (!chartRef) return;
//         const ctx = chartRef.current.getContext("2d");
//         const myChart = new ChartJS(ctx, {
//             type: "bar",
//             data: {
//                 labels: [],
//                 datasets: [
//                     {
//                         label: "Bar Chart",
//                         data: [],
//                         backgroundColor: Array(data.length).fill("rgba(255, 99, 132, 0.2)"),
//                         borderColor: Array(data.length).fill("rgba(255, 99, 132, 1)"),
//                         borderWidth: 1
//                     }
//                 ]
//             },
//             options: {
//                 scales: {
//                     yAxes: [{
//                         ticks: { beginAtZero: true }
//                     }]
//                 }
//             }
//         });
//         setMyChart(myChart);
//     }, [chartRef]);

//     useEffect(() => {
//         if (!myChart) return;
//         myChart.data.datasets[0].data = data;
//         myChart.data.labels[0] = labels;
//         myChart.update();
//     }, [data, myChart]);

//     return <canvas ref={chartRef} id="myChart" width="400" height="400" />;
// };

// export default BarChart;


import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ data, labels }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Bar Chart",
        data: [],
        backgroundColor: Array(data.length).fill("rgba(255, 99, 132, 0.2)"),
        borderColor: Array(data.length).fill("rgba(255, 99, 132, 1)"),
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    setChartData((prevData) => ({
      ...prevData,
      labels: [labels],
      datasets: [
        {
          ...prevData.datasets[0],
          data: data,
        },
      ],
    }));
  }, [data, labels]);

  return <Bar data={chartData} />;
};

export default BarChart;
