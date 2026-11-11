"use client";

import { useRef, useState } from "react";

export type Chapter = { time: number; label: string; description: string };

function timestamp(seconds: number) {
  return `0:${String(seconds).padStart(2, "0")}`;
}

/**
 * The sample launch video with its scene list beside it: the active scene
 * follows playback, and clicking one seeks the video there.
 */
export default function DemoReel({
  src,
  poster,
  title,
  chapters,
}: {
  src: string;
  poster: string;
  title: string;
  chapters: Chapter[];
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);

  function onTimeUpdate() {
    const now = video.current?.currentTime ?? 0;
    const index = chapters.findLastIndex((chapter) => chapter.time <= now);
    setActive(Math.max(index, 0));
  }

  function seek(index: number) {
    const element = video.current;
    if (!element) return;
    element.currentTime = chapters[index].time;
    setActive(index);
    void element.play();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black shadow-[0_30px_80px_-40px_rgba(15,26,51,0.6)]">
        <video
          ref={video}
          src={src}
          poster={poster}
          title={title}
          aria-label={title}
          className="absolute inset-0 h-full w-full"
          onTimeUpdate={onTimeUpdate}
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
        />
      </div>

      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {chapters.map((chapter, index) => {
          const isActive = index === active;
          return (
            <li key={chapter.time}>
              <button
                type="button"
                onClick={() => seek(index)}
                aria-current={isActive ? "step" : undefined}
                className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                  isActive
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-paper hover:border-accent"
                }`}
              >
                <span
                  className={`mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-medium ${
                    isActive ? "bg-accent text-white" : "bg-accent-soft text-accent"
                  }`}
                >
                  {timestamp(chapter.time)}
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">{chapter.label}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">
                    {chapter.description}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
