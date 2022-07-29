import * as d3 from "d3";
import styled from "styled-components";
import { useEffect, useRef } from "react";

const Container = styled.div`
  flex: 1;
`;
// interface Props {
//   data: Array<any>;
//   color: any;
// }

function LineChart({ chartData }) {
  const data = chartData;
  const color = "gray";
  const ref = useRef(null);

  useEffect(() => {
    draw();
    // eslint-disable-next-line
  }, [data]);

  const draw = () => {
    // Remove the existing svg
    d3.select(ref.current).select("svg").remove();

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", "150px")
      .attr("height", "80px");

    // Get width and height from svg
    const svgDimensions = svg.node()?.getBoundingClientRect();

    // Calculate width and height
    const height = svgDimensions ? svgDimensions.height : 50;
    const width = svgDimensions ? svgDimensions.width : 100;

    const yMinValue = d3.min(data, (d) => d);
    const yMaxValue = d3.max(data, (d) => d);

    //setting the scaling
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([yMinValue - 1, yMaxValue + 2])
      .range([height, 0]);

    const generateScaledLine = d3
      .line()
      .x((d, i) => xScale(i))
      .y(yScale);

    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("d", (d) => generateScaledLine(d))
      .attr("fill", "none")
      .attr("stroke", color);
  };
  return <Container ref={ref} />;
}

export default LineChart;
