import React from "react";
import * as d3 from "d3";

import { useD3 } from "../../hooks/useD3";

import "./LineGraph.css";

export const LineGraph = ({
  data,
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  defined, // for gaps in data
  curve = d3.curveBasis, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 50, // left margin, in pixels
  xType = d3.scaleUtc, // the x-scale type
  xDomain, // [xmin, xmax]
  yType = d3.scaleLinear, // the y-scale type
  yDomain, // [ymin, ymax]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  strokeLinecap = "round", // stroke line cap of the line
  strokeLinejoin = "round", // stroke line join of the line
  strokeWidth = 1, // stroke width of line, in pixels
  strokeOpacity = 1, // stroke opacity of line
}) => {
  const viewBoxWidth = 380;
  const viewBox = `0 0 ${viewBoxWidth} ${viewBoxWidth}`;
  const width = viewBoxWidth;
  const height = viewBoxWidth;
  const xRange = [marginLeft, width - marginRight];
  const yRange = [height - marginBottom, marginTop];

  const ref = useD3((svg) => {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const I = d3.range(X.length);
    if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
    const D = d3.map(data, defined);

    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X);
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(width / 80)
      .tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    // Construct a line generator.
    const line = d3
      .line()
      .defined((i) => D[i])
      .curve(curve)
      .x((i) => xScale(X[i]))
      .y((i) => yScale(Y[i]));

    svg
      .select("#xAxis")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

    svg
      .select("#yAxis")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1)
      )
      .call((g) =>
        g
          .select("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("text-anchor", "start")
          .text(yLabel)
      );

    svg
      .select("#path")
      .attr("fill", "none")
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-opacity", strokeOpacity)
      .attr("d", line(I));
  });

  return (
    <>
      <svg id="linegraph" ref={ref} viewBox={viewBox}>
        <g id="xAxis"></g>
        <g id="yAxis"></g>
        <path id="path"></path>
      </svg>
      <div id="linegraph-tooltip"></div>
    </>
  );
};
