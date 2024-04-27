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

  try {
    const response = await fetch("http://127.0.0.1:5000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        images: images,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const response_data = await response.json();

    const reducedValue = response_data.reduce(
      (
        acc: { priority: number; value: number; index: number } | null,
        item: {
          traffic: string;
          value: number;
        }
      ) => {
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
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
