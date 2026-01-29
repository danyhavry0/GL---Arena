"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Reindirizza sempre alla dashboard
  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return null;
}
