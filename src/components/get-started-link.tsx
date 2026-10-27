"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { loadProfile } from "@/lib/profile";
import { useHydrated } from "@/lib/use-hydrated";

// Returning visitors with a saved profile skip straight to their plan.
export function GetStartedLink() {
  const hasProfile = useHydrated() && loadProfile() !== null;
  return (
    <Link href={hasProfile ? "/plan" : "/profile"} className={buttonVariants({ size: "lg", className: "w-fit" })}>
      {hasProfile ? "Go to my plan" : "Get started"}
    </Link>
  );
}
