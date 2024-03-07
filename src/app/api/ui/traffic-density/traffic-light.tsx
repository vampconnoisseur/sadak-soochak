import { useState } from "react";
import { uploadToCloudinary } from "../../../lib/utils";

export default function TrafficLight({
  light,
  lightNumber,
  addImage,
}: {
  light: {
    time: number;
    type: number;
  };
  lightNumber: number;
  addImage: (imageUrl: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(e, addImage);
      if (imageUrl) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className={`${
          light.type === lightNumber ? "bg-green-600" : "bg-red-600"
        } p-16 rounded-3xl mb-4 text-center`}
      >
        Light {lightNumber}
      </div>
      <input
        type="file"
        id="image"
        accept="image/*"
        className="input-style"
        onChange={handleImageUpload}
      />
      {loading && <div>Uploading...</div>}
    </div>
  );
}
