"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

const HIDE_NAVBAR_PREFIXES = ["/dashboard", "/login", "/signup"];

export function ConditionalNavbar() {
  const pathname = usePathname();
  const hidden = HIDE_NAVBAR_PREFIXES.some((p) => pathname.startsWith(p));
  if (hidden) return null;
  return <Navbar />;
}
