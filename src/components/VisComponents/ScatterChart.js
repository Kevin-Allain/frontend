import React, { useEffect, useState } from "react";
import { Scatter, Bubble } from "react-chartjs-2";

// Might use a bubble chart... 
// https://react-chartjs-2.js.org/examples/bubble-chart
const ScatterChart = ({ data, labels, dataBubble = undefined, title, mergePerYear=false }) => {
  console.log("dataBubble: ", dataBubble);
  const minR = 5; const maxR = 30;

  const mergeDuplicates = (data, minR = 5, maxR = 30) => {
    const result = [];
    // Create a map to store the sums of 'r' values for each unique combination of 'x' and 'y'
    const sumMap = new Map();
    // Iterate through the original array
    data.forEach((item) => {
      const { x, y, r } = item;
      const key = `${x}*${y}`;
      // If the combination of 'x' and 'y' is already in the map, add 'r' to the existing sum
      if (sumMap.has(key)) {
        sumMap.set(key, sumMap.get(key) + r);
      } else {
        // If it's a new combination, add it to the map with the current 'r' value
        sumMap.set(key, r);
      }
    });
    // Find the minimum and maximum sums
    let minSum = Number.POSITIVE_INFINITY;
    let maxSum = Number.NEGATIVE_INFINITY;
    console.log("sumMap: ", sumMap);
    sumMap.forEach((sum) => {
      minSum = Math.min(minSum, sum);
      maxSum = Math.max(maxSum, sum);
    });
    const resNormalSize = [];
    // Convert the map back to an array of objects with adjusted 'r' values
    sumMap.forEach((sum, key) => {
      const [x, y] = key.split("*");
      // Adjust 'r' to be between minR and maxR
      // TODO: do we actually want to scale the data? => normalize?
      const adjustedR = Math.max( minR, Math.min( maxR,
          Math.round(
            ((sum - minSum) / (maxSum - minSum === 0 ? 1 : maxSum - minSum)) *
              (maxR - minR) + minR
          )
        )
      );
      result.push({ x, y, r: adjustedR });
      resNormalSize.push({ x, y, r: sum });
    });
    return [result,resNormalSize];
  }


  const mergeDuplicatesByYear = (data, minR=5, maxR=30) =>{
    const result = [];
    // Create a map to store the sums of 'r' values for each unique combination of 'x' and 'y'
    const sumMap = new Map();
    // Iterate through the original array
    data.forEach((item) => {
      const { x, y, r } = item;
      const key = `${x.split('-')[0]}*${y}`;
      // If the combination of 'x' and 'y' is already in the map, add 'r' to the existing sum
      if (sumMap.has(key)) {
        sumMap.set(key, sumMap.get(key) + r);
      } else {
        // If it's a new combination, add it to the map with the current 'r' value
        sumMap.set(key, r);
      }
    });
    // Find the minimum and maximum sums
    let minSum = Number.POSITIVE_INFINITY;
    let maxSum = Number.NEGATIVE_INFINITY;
    console.log("sumMap: ", sumMap);
    sumMap.forEach((sum) => {
      minSum = Math.min(minSum, sum);
      maxSum = Math.max(maxSum, sum);
    });
    const resNormalSize = [];
    // Convert the map back to an array of objects with adjusted 'r' values
    sumMap.forEach((sum, key) => {
      const [x, y] = key.split("*");
      // Adjust 'r' to be between minR and maxR
      // TODO: do we actually want to scale the data? => normalize?
      const adjustedR = Math.max( minR, Math.min( maxR,
          Math.round(
            ((sum - minSum) / (maxSum - minSum === 0 ? 1 : maxSum - minSum)) *
              (maxR - minR) + minR
          )
        )
      );
      result.push({ x, y, r: adjustedR });
      resNormalSize.push({ x, y, r: sum });
    });
    return [result,resNormalSize];    
  }

  const [dataBubbleMerged,resNormalSize] = mergePerYear
  ? mergeDuplicatesByYear(dataBubble, minR, maxR)
  : mergeDuplicates(dataBubble, minR, maxR);
  // console.log("Post calculation, resNormalSize: ",resNormalSize);
  // Custom legend data
  const legendData = [
    { label: Math.min(...resNormalSize.map(a => a.r)), radius: minR },
    { label: Math.max(...resNormalSize.map(a => a.r)), radius: maxR },
  ];

  const options = { scales: { y: { beginAtZero: true } } };
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const dataTest = {
    datasets: [
      {
        label: "Red dataset",
        data: Array.from({ length: 50 }, () => ({
          x: Math.round(4 * Math.random()) + Math.round(-4 * Math.random()),
          y: Math.round(8 * Math.random()) + Math.round(-8 * Math.random()),
          // y: characters[Math.round(characters.length*Math.random())],
          r: Math.round(20 * Math.random()) + Math.round(-20 * Math.random()),
        })),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Blue dataset",
        data: Array.from({ length: 50 }, () => ({
          x: Math.round(4 * Math.random()) + Math.round(-4 * Math.random()),
          y: Math.round(8 * Math.random()) + Math.round(-8 * Math.random()),
          // y: characters[Math.round(characters.length*Math.random())],
          r: Math.round(20 * Math.random()) + Math.round(-20 * Math.random()),
        })),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  const dataTest2 = {
    datasets: [
      {
        label: title,
        data: [
          { x: "Category A", y: "Type 1", r: 10 },
          { x: "Category B", y: "Type 2", r: 20 },
          { x: "Category C", y: "Type 1", r: 15 },
          { x: "Category C", y: "Type 4", r: 5 },
          { x: "Category E", y: "Type 3", r: 35 },
          { x: "Category F", y: "Type 2", r: 15 },
        ],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };
  const optionsTest2 = {
    scales: {
      x: {
        type: "category", // Use a category scale for text on the X-axis
        labels: [
          "Category A",
          "Category B",
          "Category C",
          "Category D",
          "Category E",
          "Category F",
        ],
      },
      y: {
        type: "category", // Use a category scale for text on the Y-axis
        labels: ["Type 1", "Type 2", "Type 3", "Type 4"],
      },
    },
  };
  const dataChart = {
    datasets: [
      {
        label: title,
        data: dataBubbleMerged,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  console.log("Array([...new Set(resNormalSize.map((a) => a.x))]): ",Array([...new Set(resNormalSize.map((a) => a.x))])[0] );
  let maxY = Number(Math.max(...Array([...new Set(resNormalSize.map((a) => a.x))])[0] ));
  let minY = Number(Math.min(...Array([...new Set(resNormalSize.map((a) => a.x))])[0]  ));
  console.log("diffY: ", maxY-minY)
  let diffY = maxY-minY;
  let allY = Array.from(
    Array(diffY+1),
    (_,x)=> minY + x  )
    .map(a => `${a}`)
    console.log("allY: ",allY);
  console.log("All years? : ", Array.from(
    Array(diffY+1),
    (_,x)=> minY + x  )  
    .sort())

  const optionsChart = {
    scales: {
      x: {
        type: "category", // Use a category scale for text on the X-axis
        labels: mergePerYear?allY:[...new Set(resNormalSize.map((a) => a.x))],
      },
      y: {
        type: "category", // Use a category scale for text on the Y-axis
        labels: [...new Set(resNormalSize.map((a) => a.y))],
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            // console.log("context: ",context);
            const label = context.label;
            const value = context.formattedValue; // resNormalSize.filter(a => a.x!==context.label.split(',')[0] && a.y!==context.label.split(',')[1])[0].r;
            return `[${resNormalSize[context.dataIndex]?.x}, ${resNormalSize[context.dataIndex]?.y}, ${resNormalSize[context.dataIndex]?.r}]`;
          },
        },
      },
    },
  };
  console.log("dataChart: ",dataChart,", optionsChart: ",optionsChart);

  // const [chartData, setChartData] = useState({
  //   labels: labels,
  //   datasets: [
  //     {
  //       label: title,
  //       data: data,
  //       backgroundColor: "rgba(255, 99, 132, 0.2)",
  //       borderColor: "rgba(255, 99, 132, 1)",
  //       borderWidth: 1,
  //     },
  //   ],
  // });

  // useEffect(() => {
  //   setChartData((prevData) => ({
  //     ...prevData,
  //     labels: labels,
  //     datasets: [
  //       {
  //         ...prevData.datasets[0],
  //         data: data,
  //         label: title,
  //       },
  //     ],
  //   }));
  // }, [data, labels, dataBubble, title]);

  return (
    <>
      (Sizes of circles are scaled for visibility)
      <div className="flex w-[90%]">
        {/* Bubble Chart */}
        <Bubble
          options={optionsChart ? optionsChart : null}
          data={dataChart ? dataChart : null}
        />

        {/* Custom Legend */}
        <div style={{ marginLeft: "20px" }}>
          <p>
            <u>Size Scale:</u>
          </p>
          {legendData.map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: `${item.radius * 2}px`,
                  height: `${item.radius * 2}px`,
                  border:"solid",
                  borderColor:"rgba(255, 99, 132, 1)",
                  borderWidth:"1px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 99, 132, 0.3)",
                  marginRight: "5px",
                }}
              ></div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ScatterChart;
