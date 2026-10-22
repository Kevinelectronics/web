import Image from "next/image";
import type { CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  FiBookOpen,
  FiCode,
  FiColumns,
  FiFileText,
  FiTarget,
  FiYoutube,
} from "react-icons/fi";
import { profilePhoto } from "@/content/site";

/** Radius (in % of the square) where the nodes sit, and the photo's radius. */
const NODE_RADIUS = 41;
const PHOTO_RADIUS = 23;

// Clockwise from the top. Side nodes sit closer to vertical so the wide
// pills don't spill past the square. Icons line up with `hero.orbit` by index.
const ANGLES = [-90, -38, 38, 90, 142, 218];
const ICONS: IconType[] = [
  FiFileText,
  FiCode,
  FiYoutube,
  FiBookOpen,
  FiTarget,
  FiColumns,
];

function point(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
}

export default function HeroOrbit({
  name,
  labels,
}: {
  name: string;
  labels: string[];
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px] sm:max-w-[420px]">
      {/* Soft glow behind everything */}
      <div
        aria-hidden
        className="absolute inset-[12%] rounded-full bg-accent/20 blur-3xl"
      />

      {/* Rings + connector lines */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="orbit-fade absolute inset-0 h-full w-full overflow-visible"
      >
        <circle
          cx="50"
          cy="50"
          r={NODE_RADIUS}
          fill="none"
          stroke="var(--line)"
          strokeWidth="0.3"
        />
        <circle
          cx="50"
          cy="50"
          r={PHOTO_RADIUS + 6}
          fill="none"
          stroke="var(--line)"
          strokeWidth="0.3"
        />
        {ANGLES.map((angle) => {
          const from = point(angle, PHOTO_RADIUS + 1);
          const to = point(angle, NODE_RADIUS);
          return (
            <line
              key={angle}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--accent)"
              strokeOpacity="0.55"
              strokeWidth="0.35"
              strokeDasharray="1.2 1.2"
              strokeLinecap="round"
              className="orbit-flow"
            />
          );
        })}
      </svg>

      {/* Light dot travelling along the outer ring */}
      <div
        aria-hidden
        className="orbit-spin absolute"
        style={{ inset: `${50 - NODE_RADIUS}%` }}
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_3px_var(--accent)]" />
      </div>

      {/* Photo in the centre */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: `${PHOTO_RADIUS * 2}%`, height: `${PHOTO_RADIUS * 2}%` }}
      >
        <span
          aria-hidden
          className="orbit-pulse absolute inset-0 rounded-full border-2 border-accent/50"
        />
        <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-paper bg-accent-soft shadow-[0_20px_50px_-20px_rgba(15,26,51,0.55)] ring-1 ring-line">
          {profilePhoto && (
            <Image
              src={profilePhoto}
              alt={name}
              fill
              sizes="(min-width: 640px) 200px, 140px"
              className="object-cover object-[50%_25%]"
              priority
            />
          )}
        </div>
      </div>

      {/* Nodes */}
      <ul>
        {ANGLES.map((angle, i) => {
          const { x, y } = point(angle, NODE_RADIUS);
          const Icon = ICONS[i];
          return (
            <li
              key={angle}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div
                className="orbit-pop"
                style={{ animationDelay: `${300 + i * 120}ms` } as CSSProperties}
              >
                <div
                  className="orbit-float flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] font-medium text-ink shadow-[0_8px_20px_-12px_rgba(15,26,51,0.5)] sm:px-3 sm:py-1.5 sm:text-xs"
                  style={{ animationDelay: `${-i * 0.9}s` } as CSSProperties}
                >
                  <Icon aria-hidden className="h-3.5 w-3.5 text-accent" />
                  {labels[i]}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
