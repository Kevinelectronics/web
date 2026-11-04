import type { ComponentProps } from "react";
import type { ExtraProps } from "react-markdown";
import { youtubeId } from "@/lib/youtube";

/**
 * A paragraph holding nothing but a YouTube link renders as an embedded
 * player — the article body is plain Markdown with no raw HTML, so this is
 * how a PythonIA video gets into an article (it then ranks on both Google
 * and YouTube).
 */
export default function MarkdownParagraph({ node, children, ...props }: ComponentProps<"p"> & ExtraProps) {
  const content = node?.children.filter((child) => !(child.type === "text" && !child.value.trim()));
  const only = content?.length === 1 ? content[0] : null;
  const href = only?.type === "element" && only.tagName === "a" ? String(only.properties.href ?? "") : "";
  const id = href ? youtubeId(href) : null;
  if (!id) return <p {...props}>{children}</p>;

  return (
    <span className="not-prose relative my-8 block aspect-video w-full overflow-hidden rounded-lg border border-line bg-black">
      <iframe
        // enablejsapi lets GA4 enhanced measurement record video_start/progress/complete.
        src={`https://www.youtube.com/embed/${id}?enablejsapi=1`}
        title="YouTube video"
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy"
        allowFullScreen
      />
    </span>
  );
}
