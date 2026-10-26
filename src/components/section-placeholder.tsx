// Página temporal mientras cada quien construye su módulo.
export function SectionPlaceholder({ title, what, owner }: { title: string; what: string; owner: string }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-4 py-10">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{what}</p>
      <p className="w-fit rounded-md bg-secondary px-3 py-1 text-sm">En construcción · {owner}</p>
    </main>
  );
}
