import Container from "@/components/Container";

export default function ArticleLoading() {
  return (
    <article className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <div className="h-4 w-16 animate-pulse rounded bg-accent-soft" />

        <div className="mt-6 h-3 w-28 animate-pulse rounded bg-accent-soft" />
        <div className="mt-2 h-9 w-full animate-pulse rounded bg-accent-soft" />
        <div className="mt-2 h-9 w-2/3 animate-pulse rounded bg-accent-soft" />

        <div className="relative mt-8 aspect-[16/9] w-full animate-pulse overflow-hidden rounded-lg bg-accent-soft" />

        <div className="mt-10 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-full animate-pulse rounded bg-accent-soft"
            />
          ))}
          <div className="h-4 w-2/3 animate-pulse rounded bg-accent-soft" />
        </div>
      </Container>
    </article>
  );
}
