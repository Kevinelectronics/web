"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { Link } from "@/i18n/navigation";

type NavItem = { href: string; label: string };

export default function MobileMenu({
  items,
  openLabel,
  closeLabel,
}: {
  items: NavItem[];
  openLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);

  // Lock page scroll while the menu is open, and close it on Escape.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? closeLabel : openLabel}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
      >
        {open ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
      </button>

      {/* Portalled to <body>: the header's backdrop-blur would otherwise make
          it the containing block for this fixed panel. */}
      {open &&
        createPortal(
          <div
            id="mobile-menu"
            className="mobile-menu fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-line bg-paper"
          >
            <nav className="flex flex-col px-6 py-6">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-line py-4 font-display text-2xl font-medium tracking-tight text-ink transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
