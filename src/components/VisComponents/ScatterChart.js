import React, { useEffect, useState } from "react";
import { Scatter, Bubble } from "react-chartjs-2";

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
    const adjustedR = Math.max(minR, Math.min(maxR,
      Math.round(
        ((sum - minSum) / (maxSum - minSum === 0 ? 1 : maxSum - minSum)) *
        (maxR - minR) + minR
      )
    )
    );
    result.push({ x, y, r: adjustedR });
    resNormalSize.push({ x, y, r: sum });
  });
  return [result, resNormalSize];
}

const mergeDuplicatesByYear = (data, minR = 5, maxR = 30) => {
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
    const adjustedR = Math.max(minR, Math.min(maxR,
      Math.round(
        ((sum - minSum) / (maxSum - minSum === 0 ? 1 : maxSum - minSum)) *
        (maxR - minR) + minR
      )
    )
    );
    result.push({ x, y, r: adjustedR });
    resNormalSize.push({ x, y, r: sum });
  });
  let objBubble_andSize ={dataBubbleMerged:result, resNormalSize:resNormalSize}
  return objBubble_andSize;
}

// Might use a bubble chart... 
// https://react-chartjs-2.js.org/examples/bubble-chart
// TODO can this still be used for a scatter chart? I suppose so...
const ScatterChart = ({ dataBubble = undefined, title, mergePerYear=false, setShowLoadingIcon }) => {
  console.log("~~~~ScatterChart . dataBubble: ", dataBubble);
  const minR = 2; const maxR = 20;

  const [objBubble_andSize, setObjBubble_andSize] =
    useState(mergePerYear
      ? mergeDuplicatesByYear(dataBubble, minR, maxR)
      : mergeDuplicates(dataBubble, minR, maxR));

  const legendData = (!dataBubble.map(a => a.r).every(a => a === dataBubble[0].r))
    ? [
      { label: Math.min(...objBubble_andSize.resNormalSize.map(a => a.r)), radius: minR },
      { label: Math.max(...objBubble_andSize.resNormalSize.map(a => a.r)), radius: maxR },
    ]
    : [{ label: Math.min(...objBubble_andSize.resNormalSize.map(a => a.r)), radius: minR },];

  const [dataChart, setDataChart] = useState({
    datasets: [
      {
        label: title,
        data: objBubble_andSize.dataBubbleMerged,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  });

  let maxY = Number(Math.max(...Array([...new Set(objBubble_andSize.resNormalSize.map((a) => a.x))])[0] ));
  let minY = Number(Math.min(...Array([...new Set(objBubble_andSize.resNormalSize.map((a) => a.x))])[0]  ));
  let diffY = maxY-minY;
  let allY = Array.from( Array(diffY+1), (_,x)=> minY + x  ).map(a => `${a}`)
  // console.log("scatter chart. issue with x axis: allY: ",allY,"\n or ",(objBubble_andSize.resNormalSize.map((a) => a.x)))

  const [optionsChart, setOptionsChart] = useState({
    scales: {
      x: {
        type: "category", // Use a category scale for text on the X-axis
        labels: mergePerYear?allY:[...new Set(objBubble_andSize.resNormalSize.map((a) => a.x))],
      },
      y: {
        type: "category", // Use a category scale for text on the Y-axis
        labels: [...new Set(objBubble_andSize.resNormalSize.map((a) => a.y))],
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label;
            const value = context.formattedValue;
            return `[${objBubble_andSize.resNormalSize[context.dataIndex]?.x}, 
            ${objBubble_andSize.resNormalSize[context.dataIndex]?.y}, 
            ${objBubble_andSize.resNormalSize[context.dataIndex]?.r}]`;
          },
        },
      },
    },
    maintainAspectRatio: true, // chatgpt suggested false?
    responsive: true,
  });
  console.log("dataChart: ",dataChart,", optionsChart: ",optionsChart);

  useEffect(() => {

    setShowLoadingIcon(false);
  }, [dataBubble, title, mergePerYear])

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
          <p> <u>Size Scale:</u> </p>
          {legendData.map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: `${item.radius * 2}px`, height: `${item.radius * 2}px`,
                  border:"solid", borderColor:"rgba(255, 99, 132, 1)",
                  borderWidth:"1px", borderRadius: "50%",
                  backgroundColor: "rgba(255, 99, 132, 0.3)", marginRight: "5px",
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
