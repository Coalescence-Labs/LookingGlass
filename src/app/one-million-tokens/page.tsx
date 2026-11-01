import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { SourceOutboundLink } from "@/components/site/SourceOutboundLink";
import { Reveal } from "@/components/motion/Reveal";
import { StatRow, type StatRowItem } from "@/components/stats/StatRow";
import { BigNumber } from "@/components/stats/BigNumber";
import { BookSpines } from "@/components/one-million-tokens/BookSpines";
import { TokenScale } from "@/components/one-million-tokens/TokenScale";
import {
  AVERAGES,
  AUDIO_TOKENS_PER_SEC,
  VIDEO_TOKENS_PER_SEC,
  WORKS,
  formatDuration,
  formatInt,
  wordsToTokens,
} from "@/lib/tokens";

export const metadata: Metadata = {
  title: "How much is one million tokens?",
  description:
    "Tokens are the currency language models count in. Here's what a million of them actually fits — in books, articles, videos, and hours of audio.",
};

const TEXT_STATS: StatRowItem[] = [
  {
    label: "A tweet",
    value: `~${AVERAGES.tweetTokens}`,
    equivalent: "One short burst",
    note: "280 characters, give or take.",
  },
  {
    label: "An email",
    value: `~${AVERAGES.emailTokens}`,
    equivalent: "A paragraph or two",
    note: "A typical work email.",
  },
  {
    label: "A Wikipedia article",
    value: "~930",
    equivalent: "One encyclopaedia entry",
    note: "About 700 English words, the average article length.",
  },
  {
    label: "A short story",
    value: `~${formatInt(wordsToTokens(7_500))}`,
    equivalent: "A single sitting",
    note: "Something you'd read on a train.",
  },
  {
    label: "The Great Gatsby",
    value: `~${formatInt(wordsToTokens(WORKS.gatsby.words))}`,
    equivalent: "A slim American classic",
    note: "50,061 words.",
  },
  {
    label: "An average novel",
    value: `~${formatInt(wordsToTokens(AVERAGES.novelWords))}`,
    equivalent: "A weekend's reading",
    note: "Around 90,000 words.",
  },
  {
    label: "An average textbook",
    value: `~${formatInt(wordsToTokens(AVERAGES.textbookWords))}`,
    equivalent: "A semester of study",
    note: "Around 120,000 words.",
  },
  {
    label: "War and Peace",
    value: `~${formatInt(wordsToTokens(WORKS.warAndPeace.words))}`,
    equivalent: "Almost a whole million",
    note: "Tolstoy, 587,287 words. Just fits.",
  },
  {
    label: "The King James Bible",
    value: `~${formatInt(wordsToTokens(WORKS.bibleKJV.words))}`,
    equivalent: "Slightly over the line",
    note: "783,137 words — a fraction past one million tokens.",
  },
];

const MEDIA_STATS: StatRowItem[] = [
  {
    label: "A voice message",
    value: `~${AUDIO_TOKENS_PER_SEC * 15}`,
    equivalent: "Fifteen seconds of voice",
    note: "Audio runs about 32 tokens per second.",
  },
  {
    label: "A TikTok",
    value: `~${formatInt(AVERAGES.tiktokSeconds * VIDEO_TOKENS_PER_SEC)}`,
    equivalent: "One 34-second clip",
    note: "Video runs about 258 tokens per second at default sampling.",
  },
  {
    label: "A song",
    value: `~${formatInt(3.5 * 60 * AUDIO_TOKENS_PER_SEC)}`,
    equivalent: "A 3½-minute track",
    note: "Audio-only, without video frames.",
  },
  {
    label: "A sitcom episode",
    value: `~${formatInt(22 * 60 * VIDEO_TOKENS_PER_SEC)}`,
    equivalent: "Twenty-two minutes of TV",
    note: "A third of a million tokens, already.",
  },
  {
    label: "A podcast episode",
    value: `~${formatInt(AVERAGES.podcastSeconds * AUDIO_TOKENS_PER_SEC)}`,
    equivalent: "Forty minutes of talk",
    note: "Audio-only transcription budget.",
  },
  {
    label: "A feature film",
    value: `~${formatInt(110 * 60 * VIDEO_TOKENS_PER_SEC)}`,
    equivalent: "110 minutes of cinema",
    note: "Comfortably exceeds one million tokens.",
  },
];

export default function OneMillionTokensPage() {
  // Derived headline numbers
  const novelsInOneMillion = 1_000_000 * 0.75 / AVERAGES.novelWords;
  const pagesInOneMillion = (1_000_000 * 0.75) / AVERAGES.paperbackPageWords;
  const videoMinInOneMillion = 1_000_000 / VIDEO_TOKENS_PER_SEC / 60;
  const audioHrInOneMillion = 1_000_000 / AUDIO_TOKENS_PER_SEC / 3600;

  return (
    <>
      <PageHeader
        index="01"
        kicker="On scale"
        title="How much is one million tokens?"
        lede="Language models don't read words. They read tokens — roughly three-quarter-word chunks — and count them the way a meter counts water. One million is the number you'll hear most often. Here's what it actually holds."
      />

      {/* ——— Anchor 1: the big shape of it ——— */}
      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <div className="grid gap-10 border-t border-line pt-12 md:grid-cols-[1.3fr_1fr] md:gap-16 md:pt-16">
            <div>
              <span className="type-mono-sm">The short answer</span>
              <p className="mt-6 type-display-m text-bone">
                <span className="italic text-accent">One million tokens</span>{" "}
                is about three-quarters of a million English words. Roughly{" "}
                <span className="italic text-accent">
                  {Math.round(novelsInOneMillion)} average novels
                </span>
                , or{" "}
                <span className="italic text-accent">
                  {Math.round(pagesInOneMillion / 100) * 100} paperback pages
                </span>
                , or about{" "}
                <span className="italic text-accent">
                  {Math.round(videoMinInOneMillion)} minutes of video
                </span>
                , or{" "}
                <span className="italic text-accent">
                  {audioHrInOneMillion.toFixed(1)} hours of audio
                </span>
                .
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <span className="type-mono-sm">In numbers</span>
                <div className="mt-4">
                  <BigNumber
                    value={750_000}
                    className="type-display-xl text-bone"
                  />
                  <div className="type-mono">English words</div>
                </div>
              </div>
              <div className="rule" />
              <div>
                <span className="type-mono-sm">Per token</span>
                <p className="type-body mt-2">
                  About four characters, or three-quarters of a word.{" "}
                  <span className="text-bone-3">
                    The word &ldquo;tokenisation&rdquo; is three.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ——— Anchor 2: what a token even is ——— */}
      <section className="shell pb-24 md:pb-32">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.4fr] md:gap-16">
          <Reveal>
            <h2 className="type-display-m text-bone">
              First, <span className="italic text-accent">what a token is.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex flex-col gap-6 type-body max-w-xl">
              <p>
                A token is a fragment of text — sometimes a whole word,
                sometimes a piece of one. Models don&rsquo;t read letters or
                even always words; they read these fragments, and count them
                relentlessly.
              </p>
              <p>
                For English text, the rule of thumb is simple: one token is
                about four characters, or three-quarters of a word. A short
                word like &ldquo;the&rdquo; is one token. A long, unusual word
                like &ldquo;tokenisation&rdquo; might be three. Punctuation,
                spaces, and emojis all count too.
              </p>
              <p>
                Tokens are how a model measures its appetite, and how you get
                billed. When a provider advertises a &ldquo;1M token context
                window,&rdquo; or charges <span className="font-mono text-bone">$3 per million tokens</span>,
                that number is what they mean.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— Anchor 3: in text ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ I</span>
              <h2 className="type-heading text-bone">In text</h2>
            </div>
            <span className="type-mono-sm">How many tokens it takes to…</span>
          </div>
        </Reveal>

        <div className="mt-10">
          <StatRow items={TEXT_STATS} />
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 grid gap-8 md:grid-cols-[1fr_1.2fr] md:gap-14">
            <div>
              <BookSpines count={8} />
              <p className="mt-4 type-mono-sm">
                ≈ eight average novels, spine to spine
              </p>
            </div>
            <p className="type-lede self-center max-w-md">
              Stack eight ordinary paperbacks on a desk. That is the amount of
              prose a modern model can hold in its head at once, if you hand it
              every page.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ——— Anchor 4: in moving pictures ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ II</span>
              <h2 className="type-heading text-bone">In moving pictures</h2>
            </div>
            <span className="type-mono-sm">Gemini default sampling</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-10 type-lede max-w-2xl">
            Video and audio cost a different rate. Google&rsquo;s Gemini models
            tokenise video at about{" "}
            <span className="text-bone">258 tokens per second</span> by default,
            and audio at about{" "}
            <span className="text-bone">32 tokens per second</span>. Other
            providers land in the same neighbourhood, with similar trade-offs
            between fidelity and cost.
          </p>
        </Reveal>

        <div className="mt-10">
          <StatRow items={MEDIA_STATS} />
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            <HeadlineStat
              value={`${formatDuration(1_000_000 / VIDEO_TOKENS_PER_SEC)}`}
              label="of video"
            />
            <HeadlineStat
              value={`${formatDuration(1_000_000 / AUDIO_TOKENS_PER_SEC)}`}
              label="of audio"
            />
            <HeadlineStat
              value={`~${Math.round(1_000_000 / (AVERAGES.tiktokSeconds * VIDEO_TOKENS_PER_SEC))}`}
              label="TikToks"
            />
            <HeadlineStat
              value={`~${Math.round(1_000_000 / (AVERAGES.podcastSeconds * AUDIO_TOKENS_PER_SEC))}`}
              label="podcast episodes"
            />
          </div>
        </Reveal>
      </section>

      {/* ——— Anchor 5: the scale ——— */}
      <section className="shell pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <div className="flex items-baseline gap-4">
              <span className="type-mono-sm">§ III</span>
              <h2 className="type-heading text-bone">Everything at once</h2>
            </div>
            <span className="type-mono-sm">Interactive</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mt-8 type-lede max-w-2xl">
            Slide from a handful of tokens up to ten million. Every equivalent
            follows along.
          </p>
        </Reveal>

        <div className="mt-10">
          <TokenScale />
        </div>
      </section>

      {/* ——— Sources ——— */}
      <section id="sources" className="shell pb-28">
        <Reveal>
          <div className="flex items-end justify-between border-b border-line pb-6">
            <h2 className="type-mono">Sources & notes</h2>
            <span className="type-mono-sm">Verified April 2026</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-8 flex flex-col gap-5 type-body max-w-3xl">
            <li>
              Token-to-word ratio (≈ 0.75 English words per token, ≈ 4
              characters per token) is OpenAI&rsquo;s own rule of thumb,
              documented in their{" "}
              <SourceOutboundLink
                href="https://platform.openai.com/tokenizer"
                className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
              >
                tokenizer tool
              </SourceOutboundLink>{" "}
              and pricing guides.
            </li>
            <li>
              Video and audio token rates (≈ 258 tokens/second video, ≈ 32
              tokens/second audio) follow Google&rsquo;s{" "}
              <SourceOutboundLink
                href="https://ai.google.dev/gemini-api/docs/tokens"
                className="text-bone underline decoration-line-2 underline-offset-4 hover:decoration-accent"
              >
                Gemini API documentation
              </SourceOutboundLink>{" "}
              for default media sampling. Other providers publish similar
              figures; all three treat multimodal input as a budget of
              per-second tokens.
            </li>
            <li>
              Published word counts for named works are drawn from their
              standard editions. War and Peace (587,287), the King James Bible
              (783,137), The Great Gatsby (50,061), Harry Potter and the
              Sorcerer&rsquo;s Stone (76,944).
            </li>
            <li>
              &ldquo;Average&rdquo; figures — novel length (~90k words),
              textbook length (~120k words), Wikipedia article length (~700
              words), TikTok duration (~34 seconds), podcast duration (~40
              minutes) — are rounded industry baselines. Real distributions
              vary widely; treat these as a ruler, not a measurement.
            </li>
          </ul>
        </Reveal>
      </section>
    </>
  );
}

function HeadlineStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 border-l border-line pl-5 py-2">
      <span className="font-serif text-[2rem] leading-tight tracking-[-0.02em] text-bone md:text-[2.4rem]">
        {value}
      </span>
      <span className="type-mono-sm">{label}</span>
    </div>
  );
}
