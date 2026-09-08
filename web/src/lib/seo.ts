const MIN_DESCRIPTION_LENGTH = 70;
const MAX_DESCRIPTION_LENGTH = 160;

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_>~]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength - 1).trimEnd()}…`;
}

// Google treats anything outside ~70-160 chars as a weak search snippet.
// Some CMS excerpts are placeholder-short (e.g. "TL;DR") and some run long —
// this pads short ones with the start of the article body and trims long
// ones at a word boundary, so every page gets a usable meta description
// without editing the excerpt field in Strapi.
export function buildMetaDescription(
  excerpt: string | undefined,
  content: string,
): string {
  const base = excerpt?.trim() ?? "";

  if (base.length > MAX_DESCRIPTION_LENGTH) {
    return truncate(base, MAX_DESCRIPTION_LENGTH);
  }
  if (base.length >= MIN_DESCRIPTION_LENGTH) {
    return base;
  }

  // The excerpt is often just the article's opening line, so strip that
  // prefix from the body before using it as filler — otherwise the
  // description repeats the same sentence twice.
  const plainContent = stripMarkdown(content);
  const remainder = plainContent.startsWith(base)
    ? plainContent.slice(base.length).trim()
    : plainContent;
  const filler = remainder.slice(0, MAX_DESCRIPTION_LENGTH - base.length);
  const combined = base ? `${base} ${filler}` : plainContent;
  return truncate(combined, MAX_DESCRIPTION_LENGTH);
}

export type Faq = { question: string; answer: string };

// Matches the "## FAQs" / "## Preguntas Frecuentes" heading our own articles
// use, whichever locale wrote it.
const FAQ_HEADING = /^##\s*(FAQs?|Preguntas Frecuentes)\s*$/im;

// Pulls Q&A pairs out of an article's "FAQs" section for FAQPage schema.
// Two question styles show up across the catalog — a bold line ("**Q?**")
// or an emoji-prefixed line ("❓ Q?", with the answer often starting "✅ ") —
// so this walks line by line instead of one fixed regex, collecting every
// line after a question marker as that question's (possibly multi-line)
// answer. Returns [] when the article has no FAQ section, so callers can
// skip rendering the schema entirely rather than emitting an empty
// mainEntity.
export function extractFaqs(content: string): Faq[] {
  const headingMatch = content.match(FAQ_HEADING);
  if (!headingMatch || headingMatch.index === undefined) return [];

  const afterHeading = content.slice(headingMatch.index + headingMatch[0].length);
  const nextHeadingIndex = afterHeading.search(/^##\s/m);
  const section =
    nextHeadingIndex === -1 ? afterHeading : afterHeading.slice(0, nextHeadingIndex);

  const faqs: Faq[] = [];
  let question: string | null = null;
  let answerLines: string[] = [];

  const flush = () => {
    if (question && answerLines.length > 0) {
      const cleanQuestion = stripMarkdown(question).trim();
      const cleanAnswer = stripMarkdown(answerLines.join(" ")).trim();
      if (cleanQuestion && cleanAnswer) {
        faqs.push({ question: cleanQuestion, answer: cleanAnswer });
      }
    }
    question = null;
    answerLines = [];
  };

  for (const rawLine of section.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    // Some articles put the question and answer on one line:
    // "❓ **Question?** ✅ Answer." — handle that before the
    // question-only cases below, since it also contains "❓".
    const inlineEmojiPair = line.match(/^❓\s*(.+?)\s*✅\s*(.+)$/);
    if (inlineEmojiPair) {
      flush();
      question = inlineEmojiPair[1];
      answerLines = [inlineEmojiPair[2]];
      flush();
      continue;
    }
    // Others put a bold question and its answer on one line too:
    // "**Question?** Answer." — vs. a bold-only line meant to be
    // followed by the answer on the next line(s).
    const boldMatch = line.match(/^\*\*(.+?)\*\*\s*(.*)$/);
    if (boldMatch) {
      flush();
      question = boldMatch[1].trim();
      if (boldMatch[2].trim()) {
        answerLines = [boldMatch[2].trim()];
        flush();
      }
      continue;
    }
    const emojiQuestion = line.match(/^❓\s*(.+)$/);
    if (emojiQuestion) {
      flush();
      question = emojiQuestion[1].trim();
      continue;
    }
    if (question) {
      answerLines.push(line.replace(/^✅\s*/, ""));
    }
  }
  flush();

  return faqs;
}
