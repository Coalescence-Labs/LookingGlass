// ——— Token equivalence constants ———
// Sources: OpenAI tokenizer docs (1 token ≈ 4 chars ≈ 0.75 English words),
// Google Gemini docs (video ≈ 258 tokens/second default, audio ≈ 32 tokens/second),
// published word counts for named works.
// All numbers are English-language approximations. See /one-million-tokens#sources.

export const WORDS_PER_TOKEN = 0.75;
export const CHARS_PER_TOKEN = 4;

export const VIDEO_TOKENS_PER_SEC = 258;
export const AUDIO_TOKENS_PER_SEC = 32;

// Canonical reference works (words → tokens via WORDS_PER_TOKEN)
export const WORKS = {
  gatsby: { title: "The Great Gatsby", words: 50_061 },
  harryPotter1: { title: "Harry Potter & the Sorcerer's Stone", words: 76_944 },
  hobbit: { title: "The Hobbit", words: 95_356 },
  mobyDick: { title: "Moby-Dick", words: 209_117 },
  bibleKJV: { title: "The King James Bible", words: 783_137 },
  warAndPeace: { title: "War and Peace", words: 587_287 },
} as const;

// Average lengths
export const AVERAGES = {
  novelWords: 90_000,
  textbookWords: 120_000,
  wikipediaArticleWords: 700,
  tweetTokens: 70,
  emailTokens: 400,
  paperbackPageWords: 275,
  tiktokSeconds: 34,
  podcastSeconds: 2_400, // 40 min
} as const;

export function wordsToTokens(words: number) {
  return words / WORDS_PER_TOKEN;
}

export function tokensToWords(tokens: number) {
  return tokens * WORDS_PER_TOKEN;
}

export function formatTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n < 10_000_000 ? 2 : 1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1_000).toLocaleString()}K`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.round(n).toLocaleString();
}

export function formatInt(n: number) {
  return Math.round(n).toLocaleString("en-US");
}

export function formatDuration(seconds: number) {
  if (seconds < 90) return `${Math.round(seconds)} seconds`;
  const mins = seconds / 60;
  if (mins < 90) return `${mins.toFixed(mins < 10 ? 1 : 0)} minutes`;
  const hrs = mins / 60;
  if (hrs < 10) {
    const wholeHrs = Math.floor(hrs);
    const rem = Math.round((hrs - wholeHrs) * 60);
    return rem === 0 ? `${wholeHrs} hours` : `${wholeHrs} hr ${rem} min`;
  }
  return `${hrs.toFixed(1)} hours`;
}

export function formatDecimal(n: number, digits = 1) {
  if (n >= 100) return Math.round(n).toLocaleString();
  if (n >= 10) return n.toFixed(0);
  return n.toFixed(digits);
}
