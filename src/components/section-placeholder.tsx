// Temporary page while each teammate builds their module.
export function SectionPlaceholder({
  title,
  what,
  owner,
  children,
}: {
  title: string;
  what: string;
  owner: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-4 py-10">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{what}</p>
      <p className="w-fit rounded-md bg-secondary px-3 py-1 text-sm">In progress · {owner}</p>
      {children && <div className="mt-4">{children}</div>}
    </main>
  );
}
