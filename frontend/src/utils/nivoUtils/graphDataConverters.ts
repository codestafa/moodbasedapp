export function barGraphData(
  keyArray: string[],
  scale: string
): Array<{
  scale: string;
  label: string;
}> {
  // Create an empty object to store the counts
  let keyCounts: Record<string, number> = {};
  // Iterate over the key array and count the occurrences of each key
  keyArray.forEach((key) => {
    if (keyCounts[key]) {
      keyCounts[key]++;
    } else {
      keyCounts[key] = 1;
    }
  });
  // Create an empty array to store the data objects
  let data: Array<{
    scale: string;
    label: string;
  }> = [];

  // Iterate over the keyCounts object and create a data object for each key
  for (let k in keyCounts) {
    let color = Math.floor(Math.random() * 360);

    data.push({
      [k as string]: keyCounts[k] as number,
      scale,
      label: k,
      [(k as string) + "Color"]: `hsl(${color}, 70%, 50%)`,
    });
  }

  return Object.assign({}, ...data);
}

export function pieChartData(valenceCollection: number[]): Array<{
  id: string;
  label: string;
  value: number | null;
}> {
  let data: Array<{
    id: string;
    label: string;
    value: number | null;
  }> = [];

  // Iterate over the keyCounts object and create a data object for each key

  valenceCollection = valenceCollection.sort((a, b) => a - b);

  let countBelow15 = 0;
  let count15to25 = 0;
  let count25to45 = 0;
  let count45to55 = 0;
  let count55to75 = 0;
  let count75to85 = 0;
  let countAbove85 = 0;

  valenceCollection.forEach((elem) => {
    if (elem < 0.15) {
      countBelow15++;
    } else if (elem >= 0.15 && elem < 0.25) {
      count15to25++;
    } else if (elem >= 0.25 && elem < 0.45) {
      count25to45++;
    } else if (elem >= 0.45 && elem < 0.55) {
      count45to55++;
    } else if (elem >= 0.55 && elem < 0.75) {
      count55to75++;
    } else if (elem >= 0.75 && elem < 0.85) {
      count75to85++;
    } else if (elem >= 0.85) {
      countAbove85++;
    }
  });

  data.push(
    {
      id: "☹️",
      label: "Extremely Sad/Angry/Depressed",
      value: countBelow15 ? countBelow15 : null,
    },
    {
      id: "🥺",
      label: "Very Sad/Angry/Depressed",
      value: count15to25 ? count15to25 : null,
    },
    {
      id: "🙁",
      label: "Sad/Angry/Depressed",
      value: count25to45 ? count25to45 : null,
    },
    {
      id: "😐",
      label: "Neutral",
      value: count45to55 ? count45to55 : null,
    },
    {
      id: "😉",
      label: "Happy/Euphoric/Energetic",
      value: count55to75 ? count55to75 : null,
    },
    {
      id: "😄",
      label: "Very Happy/Euphoric/Energetic",
      value: count75to85 ? count75to85 : null,
    },
    {
      id: "😃",
      label: "Extremely Happy/Euphoric/Energetic",
      value: countAbove85 ? countAbove85 : null,
    }
  );

  return data;
}
