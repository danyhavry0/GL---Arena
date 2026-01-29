"use client";

import { type ReactNode } from "react";
import { LocaleProvider } from "@/contexts/LocaleContext";

export default function Providers({ children }: { children: ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
