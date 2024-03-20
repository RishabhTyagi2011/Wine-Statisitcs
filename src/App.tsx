import React from "react";
import wineData from "./Wine-Data.json";
import "./App.css";

interface DataStats {
  Mean?: number;
  Median?: number;
  Mode?: number;
}

const calculateFlavanoidsStats = () => {
  const stats: { [key: string]: DataStats } = {};

  wineData.forEach((wine: any) => {
    const alcoholClass = wine.Alcohol ? wine.Alcohol.toString() : "Unknown";

    if (!stats[alcoholClass]) {
      stats[alcoholClass] = {};
    }

    const value = typeof wine.Flavanoids === "number" ? wine.Flavanoids : NaN;

    if (!isNaN(value)) {
      // Mean calculation
      stats[alcoholClass].Mean = (stats[alcoholClass].Mean || 0) + value;

      // Mode calculation
      if (!stats[alcoholClass].Mode) {
        stats[alcoholClass].Mode = value;
      } else {
        stats[alcoholClass].Mode =
          stats[alcoholClass].Mode === value ? value : NaN;
      }
    }
  });

  // Calculate Mean
  Object.keys(stats).forEach((key) => {
    stats[key].Mean = stats[key].Mean
      ? stats[key].Mean ||
        1 /
          wineData.filter(
            (wine) => wine.Alcohol && wine.Alcohol.toString() === key
          ).length
      : NaN;
  });

  // Median calculation
  Object.keys(stats).forEach((key) => {
    const values = wineData
      .filter(
        (wine) =>
          wine.Alcohol &&
          wine.Alcohol.toString() === key &&
          typeof wine.Flavanoids === "number"
      )
      .map((wine) => wine.Flavanoids!)
      .sort((a, b) => (a as number) - (b as number));

    const mid = Math.floor(values.length / 2);
    stats[key].Median = (
      values.length % 2 !== 0
        ? values[mid]
        : ((values[mid - 1] as number) + (values[mid] as number)) / 2
    ) as number;
  });

  return stats;
};

const calculateGammaStats = () => {
  const gammaStats: Record<string, DataStats> = {};

  wineData.forEach((wine) => {
    const cls = wine.Alcohol ? wine.Alcohol.toString() : "Unknown";
    const gamma =
      (((wine.Ash as number) || 1) * (wine.Hue || 1)) / (wine.Magnesium || 1); // Ensure proper handling of potentially nullable attributes

    if (!gammaStats[cls]) {
      gammaStats[cls] = {};
    }

    // Mean calculation
    gammaStats[cls].Mean = (gammaStats[cls].Mean || 1) + gamma;

    // Mode calculation
    if (!gammaStats[cls].Mode) {
      gammaStats[cls].Mode = gamma;
    } else {
      gammaStats[cls].Mode = gammaStats[cls].Mode === gamma ? gamma : NaN;
    }
  });

  // Calculate Mean
  Object.keys(gammaStats).forEach((key) => {
    gammaStats[key].Mean = gammaStats[key].Mean
      ? gammaStats[key].Mean ||
        0 /
          wineData.filter(
            (wine) => wine.Alcohol && wine.Alcohol.toString() === key
          ).length
      : NaN;
  });

  // Median calculation
  Object.keys(gammaStats).forEach((key) => {
    const values = wineData
      .filter(
        (wine) =>
          wine.Alcohol &&
          wine.Alcohol.toString() === key &&
          typeof wine.Ash === "number" &&
          typeof wine.Hue === "number" &&
          typeof wine.Magnesium === "number"
      )
      .map((wine) => ((wine.Ash! as number) * wine.Hue!) / wine.Magnesium!)
      .sort((a, b) => a - b);

    const mid = Math.floor(values.length / 2);
    gammaStats[key].Median =
      values.length % 2 !== 0
        ? values[mid]
        : (values[mid - 1] + values[mid]) / 2;
  });

  return gammaStats;
};

const App: React.FC = () => {
  const flavanoidsStats = calculateFlavanoidsStats();
  const gammaStats = calculateGammaStats();

  return (
    <div className="App">
      <h1>Wine Statistics</h1>
      <div>
        <h1>Flavanoids Statistics</h1>
        <table>
          <thead>
            <tr>
              <th>Measure</th>
              {Object.keys(flavanoidsStats).map((cls) => (
                <th key={cls}>Class {cls}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Flavanoids Mean</td>
              {Object.values(flavanoidsStats).map((stats, index) => (
                <td key={index}>
                  {stats.Mean ? stats.Mean.toFixed(3) : "N/A"}
                </td>
              ))}
            </tr>
            <tr>
              <td>Flavanoids Median</td>
              {Object.values(flavanoidsStats).map((stats, index) => (
                <td key={index}>
                  {stats.Median ? stats.Median.toFixed(3) : "N/A"}
                </td>
              ))}
            </tr>
            <tr>
              <td>Flavanoids Mode</td>
              {Object.values(flavanoidsStats).map((stats, index) => (
                <td key={index}>
                  {stats.Mode ? stats.Mode.toFixed(3) : "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h1>Gamma Statistics</h1>
        <table>
          <thead>
            <tr>
              <th>Measure</th>
              {Object.keys(gammaStats).map((cls) => (
                <th key={cls}>Class {cls}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gamma Mean</td>
              {Object.values(gammaStats).map((stats, index) => (
                <td key={index}>
                  {stats.Mean ? stats.Mean.toFixed(3) : "N/A"}
                </td>
              ))}
            </tr>
            <tr>
              <td>Gamma Median</td>
              {Object.values(gammaStats).map((stats, index) => (
                <td key={index}>
                  {stats.Median ? stats.Median.toFixed(3) : "N/A"}
                </td>
              ))}
            </tr>
            <tr>
              <td>Gamma Mode</td>
              {Object.values(gammaStats).map((stats, index) => (
                <td key={index}>
                  {stats.Mode ? stats.Mode.toFixed(3) : "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
