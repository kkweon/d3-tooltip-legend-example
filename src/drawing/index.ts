import * as d3 from "d3";
import { legendSize, legendColor } from "d3-svg-legend";
import { IAxes, ICleanedData, IScale, ISize } from "../typing";

export function generateScales(data: ICleanedData[], size: ISize): IScale {
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

  const [minPop, maxPop] = d3.extent(data, d => d.population);
  const r = d3
    .scaleLinear()
    .domain([minPop || 0, maxPop || 1])
    .range([10, 40]);

  const [minPoverty, maxPoverty] = d3.extent(data, d => d.poverty_rate);
  const color = d3
    .scaleLinear()
    .domain([minPoverty || 0, maxPoverty || 1])
    .range(["limegreen", "red"] as any);

  return { x, y, r, color };
}

export function generateAxes(scales: IScale): IAxes {
  const x = d3.axisBottom(scales.x);
  const y = d3
    .axisLeft(scales.y)
    .tickFormat(d3.formatPrefix(",.2f", 1e12) as any);

  return { x, y };
}

export function render(
  year: number,
  data: ICleanedData[],
  scales: IScale,
  axes: IAxes,
  size: ISize,
) {
  const yearlyData = data
    .filter(d => d.year === year)
    .filter(
      d => d.gdp && d.poverty_rate && d.population && d.unemployment_rate,
    );

  if (yearlyData.length === 0) {
    d3
      .select("svg")
      .append("text")
      .classed("error--empty", true)
      .attr("x", size.width / 2)
      .attr("y", size.height / 2)
      .attr("text-anchor", "middle")
      .text("No data is found");
  } else {
    d3.select(".error--empty").remove();
  }

  scales.x.domain(d3.extent(yearlyData, d => d.unemployment_rate) as any);
  scales.y.domain(d3.extent(yearlyData, d => d.gdp) as any);
  scales.r.domain(d3.extent(yearlyData, d => d.population) as any);
  scales.color.domain(d3.extent(yearlyData, d => d.poverty_rate) as any);

  const countries = d3
    .select("svg")
    .selectAll(".country")
    .data(yearlyData);

  countries.exit().remove();

  countries
    .enter()
    .append("circle")
    .classed("country", true)

    .merge(countries)
    .on("mousemove", d => {
      const tooltip = d3.select(".tooltip");
      const tooltipWidth = (tooltip.node() as HTMLElement).offsetWidth;

      tooltip
        .style("left", d3.event.x - tooltipWidth / 2 + 10 + "px")
        .style("top", d3.event.y + 30 + "px")
        .style("opacity", 1)
        .html(
          `
<ul>
<li>Country: ${d.country} </li>
<li>Population: ${d3.formatPrefix(",.0", 1e6)(d.population)} </li>
<li>GDP: $ ${d3.formatPrefix(",.0", 1e6)(d.gdp)} </li>
<li>Unemployment Rate: ${d3.format(".2%")(d.unemployment_rate / 100)} </li>
<li>Poverty Rate: ${d3.format(".2%")(d.poverty_rate / 100)} </li>
</ul>
`,
        );
    })
    .on("mouseout", () => {
      d3.select(".tooltip").style("opacity", 0);
    })
    .transition()
    .attr("cx", d => scales.x(d.unemployment_rate))
    .attr("cy", d => scales.y(d.gdp))
    .attr("r", d => scales.r(d.population))
    .attr("fill", d => scales.color(d.poverty_rate));

  d3
    .select(".x-axis")
    .attr("transform", `translate(0, ${size.height})`)
    .call(axes.x as any);
  d3.select(".y-axis").call(axes.y as any);

  // create radius legend
  const radiusLegend = legendSize()
    .orient("vertical")
    .shapePadding(15)
    .labelOffset(20)
    .labels(
      ({ i, generatedLabels }: { i: number; generatedLabels: number[] }) =>
        d3.formatPrefix(",.0", 1e6)(generatedLabels[i]),
    )
    .title("Population")
    .shape("circle")
    .scale(scales.r);

  d3.select(".legend--radius").call(radiusLegend);

  // create poverty legend - color
  const povertyLegend = legendColor()
    .cells(3)
    .orient("vertical")
    .title("Poverty Rate")
    .labels(
      ({ i, generatedLabels }: { i: number; generatedLabels: number[] }) =>
        generatedLabels[i] + "%",
    )
    .shapeWidth(30)
    .scale(scales.color);

  d3.select(".legend--poverty").call(povertyLegend);
}
