import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import MIDItoNote from '../MusicInterface/MIDItoNote.json'
import NoteToColor from '../MusicInterface/NoteToColor.json'
import './PianoRoll.css'

const PianoRoll = ({ notes, occurrences, durations, width, height }) => {
  const svgRef = useRef(null);

  let barHeight = height/20;

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    // svg.selectAll("*").remove(); // Clear the SVG by removing all elements
    const margin = { top: 20, right: 40, bottom: 20, left: 50 };

    const minNote = Math.min(...notes);
    const maxNote = Math.max(...notes);
    const minOccurrence = Math.min(...occurrences);
    const minTime = occurrences[0]; // We assume the times are ordered...
    let maxTime = Number.MIN_VALUE;
    for (let i = 0; i < occurrences.length; i++) {
      const sum = occurrences[i] + durations[i];
      if (sum > maxTime) {
        maxTime = sum;
      }
    }
    const xScale = d3
      .scaleLinear()
      .domain([minTime, maxTime])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([minNote, maxNote])
      .range([height - margin.bottom, margin.top]);

    // Generate an array of all integer occurrences
    const occurrenceArray = Array.from(
      { length: maxTime - minOccurrence + 1 },
      (_, i) => i + minOccurrence
    );

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

    const xAxis = d3.axisBottom(xScale)
      .ticks(10);
    
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .attr("class", "x-axis") // Add class name for x-axis
      .call(xAxis);

    const yAxis = d3
      .axisLeft(yScale)
      .tickValues(notes)
      .tickFormat((d, index) => MIDItoNote[d].replaceAll("s", ""));

    const yAxisElement = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)      
      .attr("class", "y-axis") // Add class name for x-axis
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



    // Append text for the horizontal axis label "time" after the end of the horizontal axis
    svg
      .append("text")
      .attr("x", width - margin.right + 10) // Adjust the x position to go after the end of the axis
      .attr("y", height - margin.bottom / 2)
      .attr("text-anchor", "start") // Set text-anchor to "start" to align the text to the left
      .attr("font-size", "12px") // Set a smaller font size
      .text("Time");

    // Append text for the vertical axis label "notes" after the end of the vertical axis
    svg
      .append("text")
      .attr("x", margin.left)
      .attr("y", margin.top / 2) // Adjust the y position to go after the end of the axis
      .attr("text-anchor", "start") // Set text-anchor to "start" to align the text to the left
      .attr("font-size", "12px") // Set a smaller font size
      .text("Notes");




  }, [notes, occurrences, durations, width, height, barHeight]);

  return <svg className='svg_background' ref={svgRef} width={width} height={height}></svg>;
};

export default PianoRoll;
