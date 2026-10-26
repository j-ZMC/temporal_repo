import Link from "next/link";
import { Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-4 py-16">
      <p className="text-sm font-semibold tracking-wide text-muted-foreground">Constela · by Astralis</p>
      <h1 className="text-4xl font-bold text-balance">Find a job, one step at a time</h1>
      <p className="text-lg text-muted-foreground">
        Every step is a star. Together they map your path to a job, at your own pace.
      </p>
      <div aria-hidden className="flex gap-3">
        <Star className="size-5 fill-star text-star" />
        <Star className="size-5 fill-star text-star" />
        <Star className="size-5 text-border" />
      </div>
      <Link href="/profile" className={buttonVariants({ size: "lg", className: "w-fit" })}>
        Get started
      </Link>
    </main>
  );
}
