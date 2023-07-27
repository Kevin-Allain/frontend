import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PianoRoll = ({ notes, occurrences, durations, width, height }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };

    const minNote = Math.min(...notes);
    const maxNote = Math.max(...notes);
    const minOccurrence = Math.min(...occurrences);
    // const maxOccurrence = Math.max(...occurrences);
    let maxTime = Number.MIN_VALUE;
    for (let i = 0; i < occurrences.length; i++) {
      const sum = occurrences[i] + durations[i];
      if (sum > maxTime) { maxTime = sum; }
    }
    const xScale = d3.scaleLinear()
      .domain([0, maxTime])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([minNote, maxNote])
      .range([height - margin.bottom, margin.top]);

    const barHeight = 10;
    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'white');

    // Generate an array of all integer occurrences
    const occurrenceArray = Array.from({ length: maxTime - minOccurrence + 1 }, (_, i) => i + minOccurrence);
    console.log("occurrenceArray: ", occurrenceArray);


    svg.selectAll('rect.bar')
      .data(notes)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(occurrences[i]))
      .attr('y', (d) => yScale(d) - barHeight / 2)
      .attr('width', (d, i) => xScale(durations[i] + occurrences[i]) - xScale(occurrences[i]))
      .attr('height', barHeight)
      .attr('fill', 'steelblue')
      .attr('stroke', 'black'); // Set the stroke attribute to black

    // TODO not working here...
    // Append vertical dotted lines for the x-axis values
    svg.selectAll('line.vertical')
      .data(occurrenceArray)
      .enter()
      .append('line')
      .attr('class', 'vertical')
      .attr('x1', (d) => xScale(d))
      .attr('y1', margin.top)
      .attr('x2', (d) => xScale(d))
      .attr('y2', height - margin.bottom)
      .attr('stroke', 'red') // Change the stroke color to red
      .attr('stroke-width', 2) // Increase the stroke width to 2        
      .attr('stroke-dasharray', '2,2'); // Dotted line style


    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale).ticks(maxNote - minNote + 1).tickFormat((d) => d);

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis);
  }, [notes, occurrences, durations, width, height]);

  return (
    <svg ref={svgRef} width={width} height={height}></svg>
  );
};

export default PianoRoll;
