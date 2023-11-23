import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";

const ScatterChart = ({ data, labels, title }) => {
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

  // return <Bar data={chartData} />;
  return <>Work in progress</>
};

export default ScatterChart;
