"use client";

import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export default function PAGE() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (session) {
    return redirect("/grievances");
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
