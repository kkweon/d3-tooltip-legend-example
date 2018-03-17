import * as d3 from "d3";
import { cleanData, handleFormat } from "./cleaning";
import { generateAxes, generateScales, render } from "./drawing";
import "./scss/main.scss";
import { ICountry, ISize } from "./typing";

const url =
  "https://gist.githubusercontent.com/kkweon/de072744e05167292ace05541d60a172/raw/f9e1d2b075b49d6f8abcdf2c1bcf5c06a3cc0411/world_economic_data.csv";

d3.csv(url, handleFormat as any, main as any);

function main(error: any, data: ICountry[]) {
  if (error) {
    throw new Error(error);
  }

  // cleanData
  const newData = cleanData(data);
  const [minYear, maxYear] = d3.extent(newData, d => d.year);

  if (typeof minYear === "undefined") {
    throw new Error("min year is not found");
  }

  const size: ISize = {
    height: 600,
    padding: 50,
    width: 600,
  };

  const svg = d3
    .select("svg")
    .attr("width", size.width)
    .attr("height", size.height);

  const inputSlider = d3
    .select("#year-slider")
    .property("min", minYear)
    .property("max", maxYear)
    .property("value", minYear);

  // create tooltip dom
  d3
    .select("body")
    .append("div")
    .classed("tooltip", true);

  // size legend
  svg
    .append("g")
    .classed("legend--radius", true)
    .attr("fill", "rgba(0,0,0, 0.5)")
    .attr(
      "transform",
      `translate(${size.width + size.padding}, ${size.height / 3})`,
    );

  // poverty legend - color
  svg
    .append("g")
    .classed("legend--poverty", true)
    .attr(
      "transform",
      `translate(${size.width + size.padding}, ${size.height / 10})`,
    );

  const label = svg
    .append("text")
    .classed("title", true)
    .attr("x", size.width / 2)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("font-size", "2em");

  label.text(`GDP vs Unemployment Rate (${minYear})`);

  const scales = generateScales(newData, size);
  const axes = generateAxes(scales);

  svg.append("g").classed("x-axis", true);
  svg.append("g").classed("y-axis", true);

  render(minYear, newData, scales, axes, size);

  inputSlider.on("input", () => {
    const year = +d3.event.currentTarget.value;
    render(year, newData, scales, axes, size);
    label.text(`GDP vs Unemployment Rate (${year})`);
  });
}
