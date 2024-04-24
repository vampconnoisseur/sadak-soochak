"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { insertReport } from "../lib/actions";
import { uploadToCloudinary } from "../lib/utils";

const initialState: { message: string | null } = {
  message: null,
};

const SubmitButton = ({ isUploaded }: { isUploaded: boolean }) => {
  const { pending } = useFormStatus();

  if (!isUploaded) console.log("disabled button");

  return (
    <div>
      {!pending ? (
        <button
          type="submit"
          disabled={pending || !isUploaded}
          className="btn mb-8"
        >
          Submit
        </button>
      ) : (
        <div className="loader mb-8 "></div>
      )}
    </div>
  );
};

const PAGE = () => {
  const [state, formAction] = useFormState(insertReport, initialState);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState({ name: "", imageUrl: "" });
  const { data: session } = useSession();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      if (imageUrl) {
        setLoading(false);
        setFile({ name: file.name, imageUrl: imageUrl });
        console.log(imageUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
    }
  };

  if (!session) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto items-center">
      <h1 className="mt-28 mb-20 text-5xl font-bold text-center">
        Add New Report
      </h1>
      <form
        action={formAction}
        className="grid grid-cols-2 gap-8 text-xl w-full"
      >
        <div className="col-span-1">
          <div className="font-bold">Location:</div>
          <input
            type="text"
            name="location"
            id="location"
            required
            className="border rounded-md p-3 text-black w-full"
          />
        </div>
        <div className="col-span-1">
          <div className="font-bold">Description:</div>
          <input
            name="description"
            id="description"
            type="text"
            required
            className="border rounded-md p-3 text-black w-full"
          />
        </div>
        <div className="col-span-1">
          <div className="font-bold">Email:</div>
          <input
            type="email"
            name="email"
            id="email"
            className="border rounded-md p-3 text-black w-full"
          />
        </div>
        <div className="col-span-1">
          <div className="font-bold">Phone:</div>
          <input
            type="tel"
            name="phone"
            id="phone"
            className="border rounded-md p-3 text-black w-full"
          />
        </div>
        <div className="col-span-1">
          <div className="font-bold">Contact Name:</div>
          <input
            type="text"
            name="contactName"
            id="contactName"
            className="border rounded-md p-3 text-black w-full"
          />
        </div>
        <div className="col-span-1">
          <div className="font-bold">Severity:</div>
          <select
            name="severity"
            id="severity"
            required
            className="border rounded-md p-3 text-black w-full"
          >
            <option value="">Select Severity</option>
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>
        <div className="col-span-1">
          <div className="font-bold">Date of Observation:</div>
          <input
            type="date"
            name="date"
            id="date"
            required
            className="border rounded-md p-3 text-black w-full"
          />
        </div>
        <div className="col-span-1">
          <div className="font-bold">Feedback:</div>
          <input
            name="feedback"
            id="feedback"
            className="border rounded-md p-3 text-black w-full"
          ></input>
        </div>
        <div className="col-span-2 flex justify-center items-center mt-8">
          <label
            htmlFor={`image`}
            className="bg-white text-black text-lg text-center py-2 px-4 rounded-md mb-2 btn "
          >
            {loading
              ? "Uploading..."
              : file.name !== ""
              ? `${file.name}`
              : "Upload Image"}
          </label>
        </div>
        <div className="col-span-2 flex flex-col justify-center items-center">
          <SubmitButton isUploaded={file.imageUrl !== ""} />
          {state && state.message && <p>{state.message}</p>}
        </div>
        <input
          readOnly
          hidden
          type="text"
          name="imageURL"
          id="imageURL"
          value={file.imageUrl}
          className="border rounded-md p-2 text-black w-full"
        />
        <input
          required
          hidden
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </form>
    </div>
  );
};

export default PAGE;
