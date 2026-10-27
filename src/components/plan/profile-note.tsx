"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { loadProfile, toAdaptations } from "@/lib/profile";
import { useHydrated } from "@/lib/use-hydrated";

// Shows that My plan reads the profile. Replaced by the real plan once Task "My plan" starts.
export function ProfileNote() {
  if (!useHydrated()) return null;

  const profile = loadProfile();
  const { stepsAtOnce } = toAdaptations(profile ?? {});
  const steps = stepsAtOnce === 1 ? "1 step at a time" : `${stepsAtOnce} steps at a time`;

  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-card p-5">
      <p className="flex items-center gap-2 font-medium">
        <Star className="size-4 shrink-0 fill-star text-star" aria-hidden />
        We&apos;ll show you {steps}.
      </p>
      <p className="text-sm text-muted-foreground">
        {profile ? "Based on your profile. " : "These are the standard settings. "}
        <Link href="/profile" className="font-medium text-foreground underline underline-offset-4">
          {profile ? "Edit your profile" : "Set up your profile"}
        </Link>
      </p>
    </div>
  );
}
