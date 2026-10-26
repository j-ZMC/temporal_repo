import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-3xl font-semibold">Buscar trabajo, un paso a la vez</h1>
      <p className="text-lg text-muted-foreground">
        Te ayudamos a organizar tu búsqueda de empleo en pasos pequeños, a tu ritmo.
      </p>
      <Link href="/perfil" className={buttonVariants({ className: "w-fit" })}>
        Empezar
      </Link>
    </main>
  );
}
