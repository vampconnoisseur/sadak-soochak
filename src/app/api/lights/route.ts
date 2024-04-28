import { NextRequest, NextResponse } from "next/server";

const TRAFFIC_CLASSIFICATIONS: string[] = [
  "Empty",
  "Low",
  "Medium",
  "High",
  "Traffic_Jam",
];
const TIME_VALUES: Record<string, number> = {
  Empty: 4,
  Low: 3,
  Medium: 3,
  High: 4,
  Traffic_Jam: 5,
};

export const POST = async (req: NextRequest) => {
  const { images } = await req.json();

  console.log(images);

  console.log("12345678");

  try {
    const response = await fetch("http://127.0.0.1:5000/api/lights", {
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
    console.log(response_data);

    // const response_data: { traffic: string; value: number }[] = [
    //   { traffic: "HIGH", value: 0.726 },
    //   { traffic: "JAM", value: 0.9999 },
    //   { traffic: "JAM", value: 0.9868 },
    //   { traffic: "JAM", value: 0.9868 },
    // ];

    let reducedValue = response_data.reduce(
      (
        acc: { priority: number; value: number; index: number } | null,
        item: {
          traffic: string;
          value: number;
        }
      ) => {
        if (item.traffic == "Traffic Jam") item.traffic = "Traffic_Jam";

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

    if (
      reducedValue &&
      response_data[reducedValue.index].traffic === "Traffic Jam"
    ) {
      reducedValue.traffic = "Traffic_Jam";
    }

    console.log("reducedValue", reducedValue.index + 1);

    const time = TIME_VALUES[response_data[reducedValue.index].traffic];

    return new NextResponse(
      JSON.stringify({ time, type: reducedValue.index + 1 }),
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
