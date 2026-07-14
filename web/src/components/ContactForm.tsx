"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { strapiUrl, contactEmail } from "@/content/site";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contactForm");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(`${strapiUrl}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            name: formData.get("name"),
            company: formData.get("company"),
            email: formData.get("email"),
            projectType: formData.get("projectType"),
            budget: formData.get("budget"),
            message: formData.get("message"),
            website: formData.get("website"),
            locale,
          },
        }),
      });

      if (!res.ok) throw new Error("request failed");

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-xl bg-white/10 p-6 text-center text-sm text-white">
        {t("success")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot — hidden from real visitors, bots that fill every field trip it. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-white/85">
            {t("name")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1.5 w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="company"
            className="text-sm font-medium text-white/85"
          >
            {t("company")}
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className="mt-1.5 w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-white/85">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="projectType"
            className="text-sm font-medium text-white/85"
          >
            {t("projectType")}
          </label>
          <input
            id="projectType"
            name="projectType"
            type="text"
            placeholder={t("projectTypePlaceholder")}
            className="mt-1.5 w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="budget"
            className="text-sm font-medium text-white/85"
          >
            {t("budget")}
          </label>
          <input
            id="budget"
            name="budget"
            type="text"
            placeholder={t("budgetPlaceholder")}
            className="mt-1.5 w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="text-sm font-medium text-white/85"
        >
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="mt-1.5 w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-white/85">
          {t("error")}{" "}
          <a href={`mailto:${contactEmail}`} className="underline">
            {contactEmail}
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-accent-strong transition-colors hover:bg-accent-soft disabled:opacity-60"
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
