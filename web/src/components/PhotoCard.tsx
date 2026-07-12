import Image from "next/image";
import { profilePhoto } from "@/content/site";

export default function PhotoCard({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px]">
      <div
        aria-hidden
        className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] bg-accent/90 sm:-right-6 sm:-top-6"
      />
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-paper p-2 shadow-[0_20px_60px_-25px_rgba(15,26,51,0.45)]">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-accent-soft">
          {profilePhoto ? (
            <Image
              src={profilePhoto}
              alt={name}
              fill
              sizes="(min-width: 640px) 360px, 320px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-6xl font-medium text-accent/70 sm:text-7xl">
                {initials}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
