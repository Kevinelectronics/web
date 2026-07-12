import { FaLinkedinIn, FaGithub, FaYoutube, FaMedium } from "react-icons/fa";
import { socials } from "@/content/site";

const links = [
  { key: "linkedin", href: socials.linkedin, Icon: FaLinkedinIn },
  { key: "medium", href: socials.medium, Icon: FaMedium },
  { key: "youtube", href: socials.youtube, Icon: FaYoutube },
  { key: "github", href: socials.github, Icon: FaGithub },
] as const;

export default function SocialLinks({
  labels,
  size = "md",
}: {
  labels: Record<"linkedin" | "medium" | "youtube" | "github", string>;
  size?: "sm" | "md";
}) {
  const dimension = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const iconSize = size === "sm" ? 15 : 18;

  return (
    <ul className="flex items-center gap-3">
      {links.map(({ key, href, Icon }) => (
        <li key={key}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels[key]}
            title={labels[key]}
            className={`flex ${dimension} items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-100 dark:hover:text-neutral-100`}
          >
            <Icon size={iconSize} />
          </a>
        </li>
      ))}
    </ul>
  );
}
