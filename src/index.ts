import * as d3 from "d3";
import { handleFormat, cleanData } from "./cleaning";
import "./scss/main.scss";

const url =
  "https://gist.githubusercontent.com/kkweon/de072744e05167292ace05541d60a172/raw/f9e1d2b075b49d6f8abcdf2c1bcf5c06a3cc0411/world_economic_data.csv";

d3.csv(url, handleFormat as any, main as any);

function main(error: any, data: ICountry[]): undefined {
  if (error) throw new Error(error);

  // cleanData
  const newData = cleanData(data);
  const [minYear, maxYear] = d3.extent(newData, d => d.year);

  if (typeof minYear === "undefined") throw new Error("min year is not found");

  const size: ISize = {
    width: 600,
    height: 600,
    padding: 50,
  };

  const svg = d3
    .select("#chart")
    .attr("width", size.width)
    .attr("height", size.height);

  const inputSlider = d3
    .select("#year-slider")
    .property("min", minYear)
    .property("max", maxYear)
    .property("value", minYear);

  inputSlider.on("input", () => {
    console.log("Input is changing");
  });

  const label = svg
    .append("text")
    .classed("title", true)
    .attr("x", size.width / 2)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .attr("font-size", "2em");

  label.text(`GDP vs Unemployment Rate (${minYear})`);

  const scales = generateScales(newData, size);

  render(minYear, newData, scales);

  return;
}

function generateScales(data: ICleanedData[], size: ISize): IScale {
  const [minRate, maxRate] = d3.extent(data, d => d.unemployment_rate);
  const x = d3
    .scaleLinear()
    .domain([minRate || 0, maxRate || 1])
    .range([size.padding, size.width - size.padding]);

  const [minGDP, maxGDP] = d3.extent(data, d => d.gdp);
  const y = d3
    .scaleLinear()
    .domain([minGDP || 0, maxGDP || 1e9])
    .range([size.height - size.padding, size.padding]);

  return { x, y };
}

function render(year: number, data: ICleanedData[], scales: IScale) {
  const yearlyData = data.filter(d => d.year === year);

  const countries = d3
    .select("#chart")
    .selectAll(".country")
    .data(yearlyData);

  countries.exit().remove();

  countries
    .enter()
    .append("circle")
    .classed("country", true)
    .attr("cx", d => scales.x(d.unemployment_rate))
    .attr("cy", d => scales.y(d.gdp));
}
