"use client";

import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-center">Loading....</p>
      </div>
    );
  }

  if (session) {
    return redirect("/traffic-detection?lanes=4");
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <button
        className="bg-blue-600 py-2 px-6 rounded-md mb-2"
        onClick={() => signIn("google")}
      >
        Sign in with Google
      </button>
    </div>
  );
}
