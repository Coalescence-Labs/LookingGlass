---
topic: What attention heads actually do
plan: plans/concepts/attention-mechanism.md
date: 2026-06-17
agent: cursor
status: draft
chunk: 05
related-chunks:
  - 02-multi-head-attention.md
  - 01-qkv-and-scaled-dot-product.md
---

## Summary

Interpretability research shows individual heads often do legible, specialised
jobs. Anthropic's transformer-circuits framework decomposes a head into two
independent circuits: the **QK circuit** decides *where* a token looks (the
attention pattern), and the **OV circuit** decides *what* gets copied from the
attended token into the output. Empirically, heads specialise: some attend to
the previous token or a fixed offset (positional), some to syntactic relations
like a verb's direct object or a noun's determiner, some to coreferent mentions,
and many to delimiter tokens. A famous two-head construction is the **induction
head**, which completes patterns of the form [A][B]…[A] → [B] and underlies a
lot of in-context learning.

## Method

- Elhage et al., "A Mathematical Framework for Transformer Circuits", Anthropic
  Transformer Circuits Thread, 2021. Read QK/OV-circuit and induction-head
  sections via https://transformer-circuits.pub/2021/framework/, 2026-06-17.
- Olsson et al., "In-context Learning and Induction Heads", Anthropic, 2022
  (arXiv:2209.11895). Read induction-head definition and [A][B]…[A]→[B]
  description, 2026-06-17.
- Clark et al., "What Does BERT Look At? An Analysis of BERT's Attention",
  arXiv:1906.04341 (BlackboxNLP 2019). Read head-taxonomy findings, 2026-06-17.
- Voita et al., "Analyzing Multi-Head Self-Attention", arXiv:1905.09418 (ACL
  2019). Read positional/syntactic/rare-word head categories + pruning result.

## Claims

| ID | Claim | Confidence | Source A | Source B | Notes |
|----|-------|------------|----------|----------|-------|
| C-11 | A head decomposes into a QK circuit (where to look) and an OV circuit (what to copy) | high | Elhage 2021 (Framework) | learnmechinterp.com (B, summarises Elhage) | W_QK = W_Q W_Kᵀ; W_OV = W_V W_O |
| C-12 | Heads specialise: positional/previous-token, syntactic (direct object, determiner), coreference, delimiter | high | Clark 2019 | Voita 2019 | Voita: syntactic, positional, rare-word |
| C-13 | Induction heads complete [A][B]…[A] → [B] and are built from a previous-token head + a token-matching head; major driver of in-context learning | high | Olsson 2022 | Elhage 2021 | K-composition mechanism |

## Findings

### 1. Two circuits per head (C-11)

Elhage et al. show the four weight matrices of a head factor into two products
that can be studied separately. The **QK circuit** (W_Q W_Kᵀ) produces the
attention pattern — which source tokens each destination token looks at. The
**OV circuit** (W_V W_O) produces the effect of attending — what information
moves from the attended token to the output. "Where to look" and "what to copy"
are independent. This vocabulary ("previous-token head", "induction head") is
how the field now describes head function. [Elhage 2021]

### 2. Heads specialise (C-12)

Clark et al. find BERT heads that attend to fixed positional offsets, broadly
over the sentence, heavily to the delimiter token [SEP] (a likely "no-op"), and
— most strikingly — heads that track specific syntactic relations: direct
objects attending to their verbs, determiners to their nouns, objects of
prepositions, and coreferent mentions, sometimes with high accuracy.
Concurrently, Voita et al. categorised heads in translation models as
positional, syntactic, or rare-word, and showed that most heads can be pruned
with little loss — the specialised ones do the heavy lifting. [Clark 2019;
Voita 2019]

These documented categories are the editorial basis for the heatmap's three
head captions (see `visuals-and-data.md`): a **previous-token / positional**
head, a **syntactic** head (e.g. determiner→noun, subject→verb), and a
**coreference** head (e.g. a pronoun→its antecedent).

### 3. Induction heads (C-13)

An induction head looks back for a previous occurrence of the current token A,
finds the token B that followed it, and raises the probability of B next —
completing [A][B]…[A] → [B]. Mechanically it is a two-head circuit: a
previous-token head writes "what came before me" into each position, and the
induction head's QK circuit (via K-composition) matches the current token
against those shifted keys. Olsson et al. argue induction heads are a primary
mechanism of in-context learning. [Elhage 2021; Olsson 2022]

## Terminology

| Term | Definition | Source |
|------|------------|--------|
| QK circuit | Computes the attention pattern (where to look) | Elhage 2021 |
| OV circuit | Computes what is copied if attended (what to move) | Elhage 2021 |
| Previous-token head | Attends to the immediately preceding token | Elhage 2021 / Clark 2019 |
| Induction head | Completes [A][B]…[A] → [B] | Olsson 2022 |

## Implications for the article

- § "Many heads at once" — pair the multi-head math (chunk 02) with the
  specialisation story: different heads, different jobs. Anchors C-11, C-12,
  C-13.
- The head selector's three captions must be grounded: previous-token
  (Clark/Elhage), syntactic determiner/subject-verb (Clark), coreference
  (Clark). Disclose in `#sources` that the displayed weights are illustrative,
  not extracted from a specific model.
- Induction head is the one "wow" mechanism — a tight paragraph or a caption.

## Sources

1. **Elhage, N. et al. (2021)** — A Mathematical Framework for Transformer
   Circuits. Anthropic. https://transformer-circuits.pub/2021/framework/
2. **Olsson, C. et al. (2022)** — In-context Learning and Induction Heads.
   Anthropic. arXiv:2209.11895.
3. **Clark, K. et al. (2019)** — What Does BERT Look At? arXiv:1906.04341.
4. **Voita, E. et al. (2019)** — Analyzing Multi-Head Self-Attention. arXiv:1905.09418.

## Open questions

- None blocking.
