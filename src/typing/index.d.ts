import * as d3 from "d3";

interface ICountry {
  country_code: string;
  country_name: string;
  series_code: string;
  series_name: string;
  y2008: string | number;
  y2009: string | number;
  y2010: string | number;
  y2011: string | number;
  y2012: string | number;
  y2013: string | number;
  y2014: string | number;
  y2015: string | number;
  y2016: string | number;
  y2017: string | number;
  [country: string]: string | number;
}

interface ICleanedData {
  country: string;
  year: number;
  gdp: number;
  unemployment_rate: number;
  population: number;
  poverty_rate: number;
}

interface ISize {
  width: number;
  height: number;
  padding: number;
}

interface IScale {
  x: d3.ScaleLinear<number, number>;
  y: d3.ScaleLinear<number, number>;
}
