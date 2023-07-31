import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import MIDItoNote from '../MusicInterface/MIDItoNote.json'
import NoteToColor from '../MusicInterface/NoteToColor.json'
import './PianoRoll.css'

  // const noteToColor = {
  //   A: "#FE2712",
  //   "A#": "#FC600A",
  //   B: "#FB9902",
  //   C: "#FCCC1A",
  //   "C#": "#F5DF4D",
  //   D: "#B2D732",
  //   "D#": "#66B032",
  //   E: "#347C98",
  //   F: "#0247FE",
  //   "F#": "#4424D6",
  //   G: "#8601AF",
  //   "G#": "#C21460",
  // };

//   const noteToColor = {
//     'A':"#ae4247",
//     "A#": "#FC600A",
//     'B':'#FFA500',
//     'C': '#56C6A9',
//     "C#": "#F5DF4D",
//     'D':'#4B5335',
//     "D#": "#66B032",    
//     'E':'#798EA4',
//     'F':'#FA7A35',
//     "F#": "#4424D6",
//     'G':'#00758F',
//     "G#": "#C21460",
// }

// const noteToColor = {
// 'A':'#003f5c', 'B':'#58508d', 'C':'hsl(199,100,18)','C#':'hsl(199,100,38)' , 'D':'#bc5090','E':'#de5a79','F':'#ff6361', 'G':'#ff8531'
// }


const PianoRoll = ({ notes, occurrences, durations, width, height }) => {
  const svgRef = useRef(null);

  let barHeight = height/20;

  useEffect(() => {


    // ###### FOR TEST
    const colorScheme = d3.schemeCategory10; // Get the schemeCategory10 color scheme
    console.log(colorScheme);
    // Adjust the saturation of each color to make them less saturated
    const lessSaturatedColors = colorScheme.map(color => d3.color(color).darker(0.5).toString());
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const colors = {};
    keys.forEach((key, index) => {
      colors[key] = lessSaturatedColors[index % lessSaturatedColors.length];
    });
    console.log("colors: ",colors);


    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear the SVG by removing all elements
    const margin = { top: 10, right: 10, bottom: 20, left: 50 };

    const minNote = Math.min(...notes);
    const maxNote = Math.max(...notes);
    const minOccurrence = Math.min(...occurrences);
    // const maxOccurrence = Math.max(...occurrences);
    let maxTime = Number.MIN_VALUE;
    for (let i = 0; i < occurrences.length; i++) {
      const sum = occurrences[i] + durations[i];
      if (sum > maxTime) {
        maxTime = sum;
      }
    }
    const xScale = d3
      .scaleLinear()
      .domain([0, maxTime])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([minNote, maxNote])
      .range([height - margin.bottom, margin.top]);

    // svg
    //   .append("rect")
    //   .attr('class','white_background')
    //   .attr("x", 0)
    //   .attr("y", 0)
    //   .attr("width", width)
    //   .attr("height", height)
    //   .attr("fill", "white");

    // Generate an array of all integer occurrences
    const occurrenceArray = Array.from(
      { length: maxTime - minOccurrence + 1 },
      (_, i) => i + minOccurrence
    );
    console.log("occurrenceArray: ", occurrenceArray);

    svg
      .selectAll("rect.bar")
      .data(notes)
      .enter()
      .append("rect")
      .attr("class", "bar") 
      .attr("x", (d, i) => xScale(occurrences[i]))
      .attr("y", (d) => yScale(d) - barHeight / 2)
      .attr(
        "width",
        (d, i) => xScale(durations[i] + occurrences[i]) - xScale(occurrences[i])
      )
      .attr("height", barHeight)
      .attr( "fill", (d) =>
        NoteToColor[MIDItoNote[d].replaceAll("s", "").replace(/\d+/g, "")]
      )
      .attr("stroke", "black")
      // .attr('opacity','0.65')

    // Append vertical dotted lines for the x-axis values
    svg
      .selectAll("line.vertical")
      .data(occurrenceArray)
      .enter()
      .append("line")
      .attr("class", "vertical")
      .attr("x1", (d) => xScale(d))
      .attr("y1", margin.top)
      .attr("x2", (d) => xScale(d))
      .attr("y2", height - margin.bottom)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "2,2"); // Dotted line style

    const xAxis = d3.axisBottom(xScale).ticks(10);
    
    const yAxis = d3
      .axisLeft(yScale)
      .tickValues(notes)
      .tickFormat((d, index) => MIDItoNote[d].replaceAll("s", ""));

    const yAxisElement = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    yAxisElement
      .selectAll("text")
      .attr("dx", (d, i) => 
        (MIDItoNote[d].indexOf('#')===-1 ? "-17px" : "3px")) // Apply negative offset to every alternate label
      // .attr("fill", (d) => (MIDItoNote[d].replaceAll("s", "").replace(/\d+/g, "").indexOf('#') !== -1)?'#000':
      //   NoteToColor[MIDItoNote[d].replaceAll("s", "").replace(/\d+/g, "")] || "#000" )
      .attr("fill", (d) => NoteToColor[MIDItoNote[d].replaceAll("s", "").replace(/\d+/g, "")] || "#000" )

      .attr("font-size",`${1.5 + Math.log(height*4)}px`) // size of font is ok at 8px if height is 150px.
      ;

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);


  }, [notes, occurrences, durations, width, height, barHeight]);

  return <svg className='svg_background' ref={svgRef} width={width} height={height}></svg>;
};

export default PianoRoll;
