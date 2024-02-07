import { ResponsivePie } from "@nivo/pie";
import React from "react";

const theme = {
  background: "#191414",
  fontSize: 22,
  tooltip: {
    container: {
      background: "#191414",
      padding: "5px",
      borderRadius: "5px",
      color: "#ffffff",
    },
  },
  axis: {
    fontSize: "80px",
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

export const MyResponsivePie = ({ data }: any): JSX.Element => (
  <ResponsivePie
    theme={theme}
    tooltip={({ datum }) => (
      <div
        style={{
          padding: 5,
          background: "#191414",
          color: datum.color,
        }}
      >
        <span style={{ fontSize: 18 }}>
          {datum.label}: {datum.value}
        </span>
      </div>
    )}
    data={data.filter((d: any) => d.value > 0)}
    margin={{ top: 80, right: 80, bottom: 80, left: 80 }}
    startAngle={360}
    endAngle={-360}
    innerRadius={0.5}
    padAngle={0}
    cornerRadius={0}
    fit={false}
    activeOuterRadiusOffset={5}
    colors={{ scheme: "paired" }}
    borderColor={{
      from: "color",
      modifiers: [["darker", 0]],
    }}
    arcLinkLabel={function (e) {
      return `${e.id}`;
    }}
    arcLinkLabelsTextOffset={2}
    arcLinkLabelsTextColor={{ from: "color", modifiers: [] }}
    arcLinkLabelsOffset={-24}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsDiagonalLength={36}
    arcLinkLabelsStraightLength={15}
    arcLinkLabelsColor={{ from: "color" }}
    enableArcLabels={true}
    arcLabelsRadiusOffset={0.55}
    arcLabelsSkipAngle={20}
    arcLabelsTextColor={{
      from: "color",
      modifiers: [["darker", 3]],
    }}
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        size: 4,
        padding: 1,
        stagger: true,
      },
      {
        id: "lines",
        type: "patternLines",
        background: "inherit",
        color: "rgba(255, 255, 255, 0.3)",
        rotation: -45,
        lineWidth: 6,
        spacing: 10,
      },
    ]}
  />
);
