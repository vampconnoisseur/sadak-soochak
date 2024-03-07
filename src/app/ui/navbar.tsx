"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { BeVietnamProRegular } from "../lib/fonts";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between py-4 px-6">
      <div className="flex items-center flex-shrink-0 mr-6">
        <Link href="/">
          <h1 className={`${BeVietnamProRegular.className}`}>
            TRAFFIC SAARTHI
          </h1>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
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
