import Image from "next/image";
import { useTranslations } from "next-intl";
import { FaLinkedin, FaProductHunt, FaYoutube } from "react-icons/fa";
import {
  HiArrowUpRight,
  HiOutlineBell,
  HiOutlineBolt,
  HiOutlineFilm,
  HiOutlineSparkles,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineHandThumbUp,
  HiOutlineNewspaper,
  HiOutlineArrowPathRoundedSquare,
  HiPlay,
} from "react-icons/hi2";
import { avatarPhoto } from "@/content/site";

// Decorative hero visuals for the LinkedIn, YouTube and demo video landings. All motion is
// CSS (see the `li-*` / `yt-*` / `dv-*` rules in globals.css) and stops under
// prefers-reduced-motion, leaving the final state visible.

const card =
  "rounded-2xl border border-line bg-white shadow-[0_24px_60px_-30px_rgba(15,26,51,0.55)] dark:bg-paper";

function Avatar({ size }: { size: number }) {
  return avatarPhoto ? (
    <Image
      src={avatarPhoto}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  ) : (
    <span className="shrink-0 rounded-full bg-accent-soft" style={{ width: size, height: size }} />
  );
}

export function LinkedInAnimation() {
  const t = useTranslations("services.linkedin.mock");
  const hero = useTranslations("hero");

  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[380px] pt-8">
      {/* Newsletter toast */}
      <div className={`li-toast absolute -right-2 top-0 z-10 flex items-center gap-2.5 px-3 py-2 sm:-right-6 ${card}`}>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a66c2] text-white">
          <HiOutlineNewspaper className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[11px] font-medium text-ink">{t("newsletter")}</p>
          <p className="text-[11px] font-semibold text-[#0a66c2] dark:text-[#5aa9f5]">
            {t("newsletterCount")}
          </p>
        </div>
      </div>

      {/* The post */}
      <div className={`${card} p-4`}>
        <div className="flex items-center gap-3">
          <Avatar size={40} />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
              {hero("name")}
              <FaLinkedin className="h-3.5 w-3.5 text-[#0a66c2]" />
            </p>
            <p className="text-[11px] text-ink-soft">{t("role")}</p>
          </div>
        </div>

        <p className="mt-3 text-sm font-medium leading-snug text-ink">{t("post")}</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">{t("postBody")}</p>

        {/* Chart "image" with growing bars */}
        <div className="mt-3 flex h-28 items-end gap-2 rounded-xl bg-gradient-to-br from-[#0a66c2] to-accent px-4 pb-3">
          {[38, 62, 48, 80, 95].map((height, index) => (
            <span
              key={height}
              className="li-bar flex-1 rounded-t-md bg-white/85"
              style={{ height: `${height}%`, animationDelay: `${index * 0.12}s` }}
            />
          ))}
        </div>

        {/* Reactions */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-ink-soft">
          <span className="flex items-center gap-1.5">
            <span className="flex -space-x-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#378fe9] text-[9px]">👍</span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#df704d] text-[9px]">❤️</span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f5bb5c] text-[9px]">💡</span>
            </span>
            <span className="li-count font-medium text-ink" />
            {t("reactions")}
          </span>
          <span>{t("comments")}</span>
        </div>

        <div className="mt-3 grid grid-cols-3 border-t border-line pt-2 text-ink-soft">
          <span className="li-like flex items-center justify-center gap-1.5 py-1">
            <HiOutlineHandThumbUp className="h-4 w-4" />
          </span>
          <span className="flex items-center justify-center py-1">
            <HiOutlineChatBubbleOvalLeft className="h-4 w-4" />
          </span>
          <span className="flex items-center justify-center py-1">
            <HiOutlineArrowPathRoundedSquare className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Incoming comment */}
      <div className={`li-comment absolute -left-2 bottom-20 flex items-center gap-2 px-3 py-2 sm:-left-8 ${card}`}>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
          CT
        </span>
        <p className="text-[11px] text-ink">{t("comment")}</p>
      </div>
    </div>
  );
}

export function YouTubeAnimation() {
  const t = useTranslations("services.youtube.mock");

  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[420px]">
      <div className={`${card} overflow-hidden`}>
        {/* Player */}
        <div className="relative aspect-video bg-[#0f0f0f]">
          {/* Fake code editor on screen */}
          <div className="absolute inset-0 space-y-2 px-4 pt-10 font-mono text-[11px] leading-none text-[#e6edf3]">
            <p><span className="text-[#c792ea]">import</span> requests</p>
            <p>r = requests.get(url)</p>
            <p>print(r.json())</p>
            <p className="text-emerald-400">✓ 200 OK</p>
          </div>

          <p className="absolute left-3 top-3 right-3 truncate text-xs font-medium text-white">
            {t("title")}
          </p>

          <span className="absolute left-[74%] top-[55%] flex h-10 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-[#ff0000] text-white sm:h-11 sm:w-16">
            <span className="yt-pulse absolute inset-0 rounded-xl border-2 border-[#ff0000]" />
            <HiPlay className="h-6 w-6" />
          </span>

          {/* Progress bar with chapter marks */}
          <div className="absolute inset-x-3 bottom-3">
            <div className="relative h-1 rounded-full bg-white/25">
              <div className="yt-progress absolute inset-y-0 left-0 rounded-full bg-[#ff0000]" />
              {[22, 48, 74].map((left) => (
                <span key={left} className="absolute top-0 h-1 w-0.5 bg-[#0f0f0f]" style={{ left: `${left}%` }} />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-white/80">
              <span>{t("chapters")}</span>
              <span>4:52</span>
            </div>
          </div>
        </div>

        {/* Channel row */}
        <div className="flex items-center gap-3 p-4">
          <Avatar size={36} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
              {t("channel")}
              <FaYoutube className="h-4 w-4 text-[#ff0000]" />
            </p>
            <p className="text-[11px] text-ink-soft">
              {t("subscribers")} · <span className="yt-count font-medium text-ink" /> {t("views")}
            </p>
          </div>
          <span className="relative inline-grid text-xs font-medium">
            <span className="yt-sub col-start-1 row-start-1 rounded-full bg-ink px-3 py-1.5 text-paper">
              {t("subscribe")}
            </span>
            <span className="yt-subbed col-start-1 row-start-1 flex items-center justify-center gap-1 rounded-full bg-line px-3 py-1.5 text-ink">
              <HiOutlineBell className="h-3.5 w-3.5" />
              {t("subscribed")}
            </span>
          </span>
        </div>
      </div>

      {/* Incoming comment */}
      <div className={`li-comment absolute -right-2 -bottom-6 flex items-center gap-2 px-3 py-2 sm:-right-8 ${card}`}>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[10px] font-semibold text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
          JD
        </span>
        <p className="text-[11px] text-ink">{t("comment")}</p>
      </div>
    </div>
  );
}

export function DemoAnimation() {
  const t = useTranslations("services.demo.mock");
  const toggles = t.raw("toggles") as string[];

  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[440px] pt-6">
      {/* Floating launch chips */}
      <span className="dv-chip absolute -right-1 top-0 z-10 flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-medium text-rose-600 sm:-right-6 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300">
        <HiOutlineSparkles className="h-3.5 w-3.5" />
        {t("chipNew")}
      </span>

      {/* The "frame" of the video, on grid paper like the reel */}
      <div className={`${card} overflow-hidden`}>
        <div className="dv-grid relative aspect-video">
          <div className="dv-pill absolute left-1/2 top-[14%] flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 shadow-[0_10px_30px_-14px_rgba(15,26,51,0.5)] dark:bg-paper">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
              <HiOutlineBolt className="h-3.5 w-3.5" />
            </span>
            <span className="whitespace-nowrap text-sm font-semibold text-ink">{t("product")}</span>
            <HiArrowUpRight className="h-3.5 w-3.5 text-ink-soft" />
          </div>

          <div className="absolute left-[8%] top-[42%] w-[46%] space-y-1.5">
            {toggles.map((label, index) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-lg border border-line bg-white px-2.5 py-1.5 dark:bg-paper"
              >
                <span className="truncate text-[11px] font-medium text-ink">{label}</span>
                <span
                  className="dv-track relative h-3.5 w-6 shrink-0 rounded-full"
                  style={{ animationDelay: `${0.6 + index * 0.5}s` }}
                >
                  <span
                    className="dv-knob absolute left-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-white shadow"
                    style={{ animationDelay: `${0.6 + index * 0.5}s` }}
                  />
                </span>
              </div>
            ))}
          </div>

          <p className="dv-bubble absolute right-[6%] top-[46%] max-w-[42%] rounded-lg bg-ink px-2.5 py-1.5 text-[11px] font-medium leading-snug text-paper">
            {t("prompt")}
          </p>

          <span className="dv-cta absolute bottom-[16%] right-[6%] rounded-md bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">
            {t("cta")}
          </span>

          {/* Scrubber with scene marks */}
          <div className="absolute inset-x-3 bottom-2.5">
            <div className="relative h-1 rounded-full bg-ink/10 dark:bg-white/15">
              <div className="dv-play absolute inset-y-0 left-0 rounded-full bg-accent" />
              {[8, 16, 27, 50, 62].map((left) => (
                <span key={left} className="absolute top-0 h-1 w-0.5 bg-white dark:bg-paper" style={{ left: `${left}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export toast */}
      <div className={`dv-export absolute -bottom-7 -left-2 flex items-center gap-2.5 px-3 py-2 sm:-left-8 ${card}`}>
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <HiOutlineFilm className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[11px] font-medium text-ink">{t("render")}</p>
          <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-line">
            <div className="dv-play h-full rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      <span className="dv-chip-late absolute -right-2 -bottom-4 flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 sm:-right-6 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
        <FaProductHunt className="h-3.5 w-3.5" />
        {t("chipLaunch")}
      </span>
    </div>
  );
}
