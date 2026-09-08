import Container from "@/components/Container";

export default function ArticlesLoading() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="h-4 w-24 animate-pulse rounded bg-accent-soft" />
        <div className="mt-2 h-8 w-72 max-w-full animate-pulse rounded bg-accent-soft" />

        <div className="mt-6 flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 animate-pulse rounded-full bg-accent-soft"
            />
          ))}
        </div>

        <div className="mt-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-6 border-b border-line py-8 first:pt-0"
            >
              <div className="hidden aspect-video w-56 shrink-0 animate-pulse rounded-lg bg-accent-soft sm:block" />
              <div className="min-w-0 flex-1">
                <div className="h-3 w-24 animate-pulse rounded bg-accent-soft" />
                <div className="mt-3 h-6 w-3/4 animate-pulse rounded bg-accent-soft" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-accent-soft" />
                <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-accent-soft" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
