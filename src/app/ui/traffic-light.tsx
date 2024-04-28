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

  const truncateFileName = (fileName: string, maxLength: number) => {
    const MAX_FILENAME_LENGTH = maxLength || 25;
    let truncatedName = fileName;
    const parts = fileName.split(".");
    const extension = parts.length > 1 ? parts.pop() || "" : "";

    if (truncatedName.length > MAX_FILENAME_LENGTH) {
      truncatedName =
        truncatedName.substring(0, MAX_FILENAME_LENGTH - extension.length - 3) +
        "..." +
        extension;
    }

    return truncatedName;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    setLoading(true);
    try {
      const truncatedName = truncateFileName(file.name, 25);
      const imageUrl = await uploadToCloudinary(file);
      if (imageUrl) {
        setLoading(false);
        setFile({ name: truncatedName, imageUrl: imageUrl });
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
            className="ml-2 bg-red-500 text-white rounded-3xl h-8 w-8 text-center"
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
