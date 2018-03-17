import { yearlyKeys, featureX, featureY, featureR, featureC } from "./features";

function getNewKey(feature: string): string {
  switch (feature) {
    case featureX:
      return "unemployment_rate";
    case featureY:
      return "gdp";
    case featureR:
      return "population";
    case featureC:
      return "poverty_rate";
    default:
      return "";
  }
}

export function handleFormat(data: ICountry): ICountry {
  yearlyKeys.forEach(k => {
    data[k] = +data[k];
  });

  return data;
}

/**
 * Clean data. That means
 *   { country, featureX, featureY, featureR, featureC, year }
 */
export function cleanData(data: ICountry[]): ICleanedData[] {
  const cleanedData = new Map();

  data.forEach(d => {
    const country = d.country_name;

    if ([featureX, featureY, featureR, featureC].includes(d.series_name))
      yearlyKeys.forEach(yearKey => {
        const year = +yearKey.slice(1);
        const result = cleanedData.get([country, year]);

        const newKey = getNewKey(d.series_name);

        cleanedData.set([country, year], {
          ...result,
          [newKey]: d[yearKey],
          year,
        });
      });
  });

  const dataArray = Array.from(cleanedData.entries());
  return dataArray.map(x => {
    const country = x[0][0];
    const result = x[1];

    return {
      ...result,
      country,
    };
  });
}
