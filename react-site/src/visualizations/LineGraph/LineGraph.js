import React from "react";
import * as d3 from "d3";

import { useD3 } from "../../hooks/useD3";

import Card from "../../components/Card";

import "./LineGraph.css";

export const LineGraph = ({
  data,
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  z = () => 1, // given d in data, returns the (categorical) z-value
  title = () => "",
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
  mixBlendMode = "multiply", // blend mode of lines
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
    const Z = d3.map(data, z);
    const O = d3.map(data, (d) => d);
    const I = d3.range(X.length);
    if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
    const D = d3.map(data, defined);

    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X);
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];

    if (title === undefined) {
      const formatDate = xScale.tickFormat(null, "%b %-d, %Y");
      const formatValue = yScale.tickFormat(100, yFormat);
      title = (i) => `${formatDate(X[i])}\n${formatValue(Y[i])}`;
    } else {
      const O = d3.map(data, (d) => d);
      const T = title;
      title = (i) => T(O[i], i, data);
    }

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
      .on("pointerenter", pointerentered)
      .on("pointermove", pointermoved)
      .on("pointerleave", pointerleft)
      .on("touchstart", (event) => event.preventDefault());

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

    const path = svg
      .select("#path")
      .attr("fill", "none")
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-opacity", strokeOpacity)
      .selectAll("path")
      .data(d3.group(I, (i) => Z[i]))
      .join("path")
      .style("mix-blend-mode", mixBlendMode)
      .attr("d", ([, I]) => line(I));

    const dot = svg.select("#dot");
    const name = svg.select("#name");
    const date = svg.select("#date");
    const listings = svg.select("#listings");

    function pointermoved(event) {
      const [xm, ym] = d3.pointer(event);
      const i = d3.least(I, (i) =>
        Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)
      ); // closest point
      path
        .style("stroke", ([z]) => (Z[i] === z ? null : "#ddd"))
        .filter(([z]) => Z[i] === z)
        .raise();
      dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);
      name.html(title(i));
      date.text(
        new Date(X[i]).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      );
      listings.text(
        Y[i].toLocaleString("en", {
          useGrouping: true,
        })
      );
      svg.property("value", O[i]).dispatch("input", { bubbles: true });
    }

    function pointerentered() {
      path.style("mix-blend-mode", null).style("stroke", "#ddd");
      dot.attr("display", null);
    }

    function pointerleft() {
      path.style("mix-blend-mode", "multiply").style("stroke", null);
      dot.attr("display", "none");
      svg.node().value = null;
      svg.dispatch("input", { bubbles: true });
    }
  });

  return (
    <>
      <svg id="linegraph" ref={ref} viewBox={viewBox}>
        <g id="xAxis"></g>
        <g id="yAxis"></g>
        <g id="path"></g>
        <g id="dot" display="none">
          <circle r="2.5"></circle>
          <text id="name" y="1em"></text>
          <text id="date" y="2em"></text>
          <text id="listings" y="3em"></text>
        </g>
      </svg>
    </>
  );
};
