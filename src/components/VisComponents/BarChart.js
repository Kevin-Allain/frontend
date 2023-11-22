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

// import React, { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";


// const BarChart = ({ data, labels, title}) => {
//     // test parameters
//     const [axisLabelXBarGraph, setAxisLabelXBarGraph] = useState(["Category A", "Category B", "Category C", "Category D", "Category E", ]);
//     const [axisYBarGraph, setAxisYBarGraph] = useState([10, 20, 15, 25, 18]);
//     const[dataBarGraph, setDataBarGraph] = useState({    
//       labels: axisLabelXBarGraph,
//       datasets: [
//         { label: title, data: axisYBarGraph, backgroundColor: "rgba(75,192,192,0.2)", borderColor: "rgba(75,192,192,1)", borderWidth: 1, },
//       ],
//     });
    
//     console.log("-- BarChart - data: ", data, ", labels: ", labels);
//     const [chartData, setChartData] = useState({
//         labels: labels,
//         datasets: [
//             {
//                 label: title,
//                 data: data,
//                 backgroundColor:"rgba(255, 99, 132, 0.2)",
//                 borderColor: "rgba(255, 99, 132, 1)",
//                 borderWidth: 1,
//             },
//         ],
//     });

//     useEffect(() => {
//         console.log("-- BarChart useEffect - data: ",data,", labels: ",labels,", title: ",title);
//         setChartData((prevData) => ({
//             ...prevData,
//             labels: [labels],
//             datasets: [
//                 {
//                     ...prevData.datasets[0],
//                     data: data,
//                     label:title,
//                 },
//             ],
//         }));
//     }, [data, labels, title]);

//     // return <Bar data={chartData} />;
//     return <Bar data={dataBarGraph} />
// };

// export default BarChart;



import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ data, labels, title }) => {
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

  return <Bar data={chartData} />;
};

export default BarChart;
