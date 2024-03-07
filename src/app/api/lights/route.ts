import { NextRequest, NextResponse } from "next/server";

const TRAFFIC_CLASSIFICATIONS: string[] = [
  "EMPTY",
  "LOW",
  "MEDIUM",
  "HIGH",
  "JAM",
];
const TIME_VALUES: Record<string, number> = {
  EMPTY: 0,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  JAM: 5,
};

export const POST = async (req: NextRequest) => {
  const { images } = await req.json();

  console.log("Image URLs:", images);

  const response_data: { traffic: string; value: number }[] = [
    { traffic: "HIGH", value: 0.726 },
    { traffic: "MEDIUM", value: 0.87 },
    { traffic: "JAM", value: 0.9999 },
    { traffic: "MEDIUM", value: 0.9868 },
  ];

  const reducedValue = response_data.reduce(
    (acc: { priority: number; value: number; index: number } | null, item) => {
      const priority = TRAFFIC_CLASSIFICATIONS.indexOf(item.traffic);

      if (
        !acc ||
        priority > acc.priority ||
        (priority === acc.priority && item.value > acc.value)
      ) {
        return {
          priority,
          value: item.value,
          index: response_data.indexOf(item),
        };
      }

      return acc;
    },
    null
  );

  const time = TIME_VALUES[response_data[reducedValue!.index].traffic];

  await new Promise((resolve) => setTimeout(resolve, 3000));

  return new NextResponse(
    JSON.stringify({ time, type: reducedValue!.index + 1 }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
