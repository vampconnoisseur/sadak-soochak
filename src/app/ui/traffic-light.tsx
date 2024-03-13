import { useState, useEffect } from "react";
import { uploadToCloudinary } from "../lib/utils";
import Image from "next/image";

export default function TrafficLight({
  light,
  lightNumber,
  disabled,
  addImage,
  removeImage,
}: {
  light: {
    time: number;
    type: number;
  };
  lightNumber: number;
  disabled: boolean;
  addImage: (imageUrl: string) => void;
  removeImage: (imageUrl: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState({ name: "", imageUrl: "" });

  useEffect(() => {
    if (light.time === 0) {
      setFile({ name: "", imageUrl: "" });
      const inputElement = document.getElementById(
        `image${lightNumber}`
      ) as HTMLInputElement;

      if (inputElement) {
        inputElement.value = "";
      }
    }
  }, [file.imageUrl, light, removeImage, lightNumber]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      if (imageUrl) {
        setLoading(false);
        setFile({ name: file.name, imageUrl: imageUrl });
        addImage(imageUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    removeImage(file.imageUrl);
    setFile({ name: "", imageUrl: "" });

    const inputElement = document.getElementById(
      `image${lightNumber}`
    ) as HTMLInputElement;

    if (inputElement) {
      inputElement.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`${
          light.type === lightNumber ? "bg-green-600" : "bg-red-600"
        } ${file.imageUrl ? "p-2" : "p-16"} rounded-3xl mb-4 text-center`}
      >
        {file.imageUrl ? (
          <Image
            src={file.imageUrl}
            alt=""
            width={200}
            height={200}
            style={{
              borderRadius: "10%",
            }}
          />
        ) : (
          <span>Light {lightNumber}</span>
        )}
      </div>

      <div className="flex">
        <label
          htmlFor={`image${lightNumber}`}
          className={`${
            disabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-white hover:bg-gray-400"
          } text-black text-sm text-center font-bold py-2 px-4 rounded-xl`}
        >
          {loading
            ? "Uploading..."
            : disabled
            ? "Released"
            : file.name
            ? file.name
            : "Upload Image"}
        </label>
        {file.name && !disabled && (
          <button
            onClick={handleRemoveImage}
            className="ml-2 px-3.5 w-full bg-red-500 text-white rounded-3xl"
          >
            x
          </button>
        )}
      </div>
      <input
        type="file"
        id={`image${lightNumber}`}
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
        disabled={disabled}
      />
    </div>
  );
}
