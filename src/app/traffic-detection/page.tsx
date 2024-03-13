"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import TrafficLight from "../ui/traffic-light";
import { redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const lanes = parseInt(searchParams.get("lanes") ?? "");

  const { data: session } = useSession();

  const [images, setImages] = useState<string[]>([]);
  const [activeLight, setActiveLight] = useState({ time: -1, type: 0 });
  const [disabledLights, setDisabledLights] = useState<number[]>([]);
  const [status, setStatus] = useState("Submit");

  useEffect(() => {
    if (activeLight.time !== -1) {
      const interval = setInterval(() => {
        setActiveLight((prevLight) => ({
          ...prevLight,
          time: prevLight.time - 1,
        }));

        if (activeLight.time === 0) {
          setImages([]);
          setActiveLight({ time: -1, type: 0 });
          setStatus("Submit");
          alert("Lights are red again, upload new photos.");
        }
      }, 1000);

      return () => clearInterval(interval);
    }

    if (disabledLights.length === lanes) {
      setDisabledLights([]);
    }
  }, [disabledLights, activeLight, lanes]);

  const addImage = (imageUrl: string): void => {
    setImages((prevImages: string[]) => [...prevImages, imageUrl]);
  };

  const removeImage = (imageUrlToRemove: string) => {
    setImages((prevImages: string[]) => {
      const newImages = prevImages.filter(
        (imageUrl) => imageUrl !== imageUrlToRemove
      );
      return newImages;
    });
  };

  const getLight = async () => {
    setStatus("Submitting...");

    if (images.length !== lanes - disabledLights.length) {
      setStatus(
        `Error: Please upload exactly ${lanes - disabledLights.length} images.`
      );
      return;
    }

    const response = await fetch("/api/lights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        activeLight,
        images,
      }),
    });

    if (!response.ok) {
      setStatus("Error occurred while processing.");
      return;
    }

    const lightData = await response.json();

    setStatus("Releasing...");

    setActiveLight(lightData);
    setDisabledLights((prevDisabledLights) => [
      ...prevDisabledLights,
      lightData.type,
    ]);
  };

  if (!session) {
    return redirect("/");
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex justify-center items-center">
          <p className="text-center">Loading....</p>
        </div>
      }
    >
      <main className="flex flex-col items-center justify-center h-screen my-8">
        <div className="mb-8">
          {activeLight.time == -1 ? 0 : activeLight.time}
        </div>
        <progress value={activeLight.time} max={9}></progress>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-24 p-24">
          {Array.from({ length: lanes }).map((_, i) => (
            <TrafficLight
              key={i + 1}
              light={activeLight}
              lightNumber={i + 1}
              disabled={disabledLights.includes(i + 1)}
              addImage={addImage}
              removeImage={removeImage}
            />
          ))}
        </div>
        <button
          onClick={getLight}
          disabled={status === "Submitting..."}
          className="text-black bg-white p-3 rounded-xl mb-4"
        >
          {status.startsWith("Error") ? "Submit" : status}
        </button>
        {status.startsWith("Error") && <div>{status}</div>}
      </main>
    </Suspense>
  );
}
