"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { BeVietnamProRegular } from "../lib/fonts";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between py-4 px-6 bg-black">
      <div className="flex items-center flex-shrink-0">
        <Link href="/traffic-detection?lanes=4">
          <h1 className={`${BeVietnamProRegular.className} mr-4`}>TRAFFIC</h1>
        </Link>
        <Link href="/grievances">
          <h1 className={`${BeVietnamProRegular.className} mr-2`}>
            GRIEVANCES
          </h1>
        </Link>
      </div>

      <div className="flex items-center">
        <Link href="/grievance-form" className="ml-2 mr-8">
          <button className="">NEW REPORT</button>
        </Link>
        <button
          onClick={() => {
            signOut();
          }}
        >
          {session ? "LOGOUT" : ""}
        </button>
      </div>
    </nav>
  );
}
