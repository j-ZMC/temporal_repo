import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-3xl font-semibold">Copiloto de empleo</h1>
      <p className="text-muted-foreground">
        Proyecto listo. Aquí irá el perfil, Mi plan, vacantes y entrevistas.
      </p>
      <p className="dyslexic text-lg">Así se ve el texto en modo OpenDyslexic.</p>
      <Button className="w-fit">Empezar</Button>
    </main>
  );
}
