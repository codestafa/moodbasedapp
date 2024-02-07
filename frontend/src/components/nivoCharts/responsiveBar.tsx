import { ResponsiveBar } from "@nivo/bar";
import React from "react";

const theme = {
  background: "#191414",
  fontSize: 14,
  axis: {
    fontSize: "40",
    tickColor: "#eee",
    ticks: {
      line: {
        stroke: "#1DB954",
      },
      text: {
        fill: "#ffffff",
      },
    },
    legend: {
      text: {
        fill: "#aaaaaa",
      },
    },
  },
  grid: {
    line: {
      stroke: "#1DB954",
    },
  },
};

export const MyResponsiveBar = ({ data }: any): JSX.Element => (
  <ResponsiveBar
    theme={theme}
    borderRadius={2.5}
    tooltip={({ id, value, color }) => (
      <div
        style={{
          padding: 5,
          color,
          background: "#191414",
        }}
      >
        <span>
          {id}: {value}
        </span>
      </div>
    )}
    data={data}
    keys={["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]}
    indexBy="scale"
    margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    padding={0.35}
    valueScale={{ type: "linear" }}
    indexScale={{ type: "band", round: true }}
    colors={{ scheme: "paired" }}
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "#FFFFFF",
        size: 4,
        padding: 1,
        stagger: true,
      },
      {
        id: "lines",
        type: "patternLines",
        background: "inherit",
        color: "#FFFFFF",
        rotation: -45,
        lineWidth: 6,
        spacing: 10,
      },
    ]}
    borderColor={{
      from: "color",
      modifiers: [["darker", 1.6]],
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Scale",
      legendPosition: "middle",
      legendOffset: 32,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      format: (e) => Math.floor(e) === e && e,
      legend: "Keys",
      legendPosition: "middle",
      legendOffset: -40,
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{
      from: "color",
      modifiers: [["darker", 2]],
    }}
    legends={[
      {
        itemTextColor: "white",
        dataFrom: "keys",
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: "left-to-right",
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
          {
            on: "hover",
            style: {
              itemTextColor: "#1DB954",
              itemOpacity: 5,
            },
          },
        ],
      },
    ]}
    role="application"
    barAriaLabel={function (e) {
      return e.id + ": " + e.formattedValue + " from scale: " + e.indexValue;
    }}
  />
);
