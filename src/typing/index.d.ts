import * as d3 from "d3";

export interface ICountry {
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

export interface ICleanedData {
  country: string;
  year: number;
  gdp: number;
  unemployment_rate: number;
  population: number;
  poverty_rate: number;
}

export interface ISize {
  width: number;
  height: number;
  padding: number;
}

export interface IScale {
  x: d3.ScaleLinear<number, number>;
  y: d3.ScaleLinear<number, number>;
  r: d3.ScaleLinear<number, number>;
  color: d3.ScaleLinear<number, number>;
}

export interface IAxes {
  x: d3.Axis<number | { valueOf(): number }>;
  y: d3.Axis<number | { valueOf(): number }>;
}
