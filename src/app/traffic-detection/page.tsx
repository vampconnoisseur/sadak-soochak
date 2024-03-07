"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import TrafficLight from "../api/ui/traffic-density/traffic-light";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();

  const [images, setImages] = useState<string[]>([]);
  const [light, setLight] = useState({ time: -1, type: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const addImage = (imageUrl: string): void => {
    setImages((prevImages: string[]) => [...prevImages, imageUrl]);
  };

  const getLight = async () => {
    setSubmitting(true);
    setError(false);

    if (images.length !== 4) {
      setError(true);
      setSubmitting(false);
      return;
    }

    console.log(images);
    const response = await fetch("/api/lights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        light,
        images,
      }),
    });

    if (!response.ok) {
      setError(true);
      setSubmitting(false);
      return;
    }

    const lightData = await response.json();
    setLight(lightData);

    setSubmitting(false);
  };

  useEffect(() => {
    console.log("Effect called.");
    if (light.time !== -1) {
      const interval = setInterval(() => {
        console.log("Interval called.");

        setLight((prevLight) => ({
          ...prevLight,
          time: prevLight.time - 1,
        }));

        if (light.time === 0) {
          setLight({ time: -1, type: 0 });
          alert("Lights are red again, upload new photos.");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [light]);

  if (!session) {
    return redirect("/");
  }

  return (
    <>
      <main className="flex flex-col items-center justify-center h-screen my-8">
        <div className="mb-8">{light.time == -1 ? 0 : light.time}</div>
        <progress value={light.time} max={9}></progress>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-24 p-24">
          <TrafficLight light={light} lightNumber={1} addImage={addImage} />
          <TrafficLight light={light} lightNumber={2} addImage={addImage} />
          <TrafficLight light={light} lightNumber={3} addImage={addImage} />
          <TrafficLight light={light} lightNumber={4} addImage={addImage} />
        </div>
        <button
          onClick={getLight}
          disabled={submitting}
          className="text-black bg-white p-3 rounded-xl mb-4"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
        {error && <div>Error: Please upload exactly 4 images.</div>}
      </main>
    </>
  );
}
