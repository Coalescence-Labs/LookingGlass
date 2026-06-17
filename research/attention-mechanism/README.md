---
topic: How attention actually works
plan: plans/concepts/attention-mechanism.md
date: 2026-06-17
agent: cursor
status: draft
slug: attention-mechanism
---

## Summary

Attention is the operation that lets every token in a sequence look at every
other token and pull in what's relevant. Each token emits three vectors — a
**query** (what am I looking for?), a **key** (what do I offer?), and a
**value** (what I'll hand over if chosen). A token's query is compared against
all keys by dot product, the scores are divided by √d_k and passed through a
softmax to become weights that sum to one, and those weights mix the values
into the token's new representation: `Attention(Q,K,V) = softmax(QKᵀ/√d_k)V`
[C-01, C-02]. The √d_k scaling keeps the softmax out of its flat-gradient
region [C-03]. Transformers run several attention heads in parallel — eight in
the original paper, each on a 64-dim slice of a 512-dim model — so different
heads can specialise in different relationships [C-04, C-05]. Because every
token attends to every other, cost grows with the **square** of sequence
length [C-09], which is exactly the pressure behind context-window limits
(Concept 03) and behind FlashAttention [C-10]. Position is injected separately:
the original sinusoids, now most often **RoPE**, which rotates queries and keys
so their dot product depends on relative distance [C-06, C-07]. Interpretability
work finds heads that specialise — previous-token, syntactic, coreference,
induction heads — describable via the QK ("where to look") and OV ("what to
copy") circuits [C-11, C-12, C-13].

## Research questions

1. What are query, key, value, and how does scaled dot-product attention turn
   them into an output? → `01-qkv-and-scaled-dot-product.md`
2. Why softmax, and why divide by √d_k? → `01-qkv-and-scaled-dot-product.md`
3. What is multi-head attention and why use multiple heads? →
   `02-multi-head-attention.md`
4. How does the model know token order — sinusoids, learned, RoPE? →
   `03-positional-information.md`
5. Why is attention quadratic, and how does that tie to context windows and
   FlashAttention? → `04-quadratic-cost.md`
6. What do individual attention heads actually do, per interpretability work? →
   `05-attention-heads-interpretability.md`

## Chunk index

| File | Scope | Status |
|------|-------|--------|
| `01-qkv-and-scaled-dot-product.md` | Q/K/V projections, the equation, softmax, √d_k scaling | draft |
| `02-multi-head-attention.md` | Splitting into heads, concat + W_O, original hyperparameters | draft |
| `03-positional-information.md` | Sinusoidal, learned, and rotary (RoPE) position | draft |
| `04-quadratic-cost.md` | O(n²) cost, link to context windows, FlashAttention | draft |
| `05-attention-heads-interpretability.md` | QK/OV circuits, head specialisation, induction heads | draft |
| `numbers-and-units.md` | Quantified claims ledger | draft |
| `visuals-and-data.md` | Heatmap worked-example data brief | draft |

## Source map

| Short name | Tier | Type | URL / citation | Cited in chunks |
|------------|------|------|----------------|-----------------|
| Vaswani 2017 | A | paper | "Attention Is All You Need", arXiv:1706.03762 — https://arxiv.org/abs/1706.03762 | 01, 02, 03, 04, numbers |
| Annotated Transformer | B | annotated impl | Rush et al., 2018/2022 — https://nlp.seas.harvard.edu/annotated-transformer/ | 01, 02, 04 |
| Su 2021 (RoFormer/RoPE) | A | paper | Su et al., "RoFormer", arXiv:2104.09864 — https://arxiv.org/abs/2104.09864 | 03 |
| Shaw 2018 | A | paper | Shaw, Uszkoreit, Vaswani, "Self-Attention with Relative Position Representations", arXiv:1803.02155 — https://arxiv.org/abs/1803.02155 | 03 |
| Press 2021 (ALiBi) | A | paper | Press, Smith, Lewis, "Train Short, Test Long" (ALiBi), arXiv:2108.12409 — https://arxiv.org/abs/2108.12409 | 03 |
| Dao 2022 (FlashAttention) | A | paper | Dao et al., "FlashAttention", arXiv:2205.14135 — https://arxiv.org/abs/2205.14135 | 04 |
| Elhage 2021 (Framework) | A | research report | Elhage et al., "A Mathematical Framework for Transformer Circuits", Anthropic — https://transformer-circuits.pub/2021/framework/ | 05 |
| Olsson 2022 (Induction heads) | A | research report | Olsson et al., "In-context Learning and Induction Heads", Anthropic, arXiv:2209.11895 — https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html | 05 |
| Clark 2019 | A | paper | Clark et al., "What Does BERT Look At?", arXiv:1906.04341 — https://aclanthology.org/W19-4828/ | 05, visuals |
| Voita 2019 | A | paper | Voita et al., "Analyzing Multi-Head Self-Attention", arXiv:1905.09418 — https://arxiv.org/abs/1905.09418 | 05, visuals |

## Claim ledger (page-worthy)

| ID | Claim (short) | Value / note | Chunk | Safe for page |
|----|---------------|--------------|-------|---------------|
| C-01 | Each token emits query, key, value vectors via learned projections | — | 01 | yes |
| C-02 | Attention(Q,K,V) = softmax(QKᵀ/√d_k)V | — | 01 | yes |
| C-03 | Divide by √d_k to keep softmax gradients healthy | — | 01 | yes |
| C-04 | Softmax turns scores into weights summing to 1 | — | 01 | yes |
| C-05 | Multi-head: run h attentions in parallel, concat, project by W_O | — | 02 | yes |
| C-06 | Original transformer: d_model 512, h=8 heads, d_k=d_v=64 | 512 / 8 / 64 | 02, numbers | yes |
| C-07 | Original position signal: sinusoids of varying frequency | — | 03 | yes |
| C-08 | RoPE rotates Q and K so the dot product depends on relative position | — | 03 | yes |
| C-09 | Attention is O(n²) in sequence length n | quadratic | 04, numbers | yes |
| C-10 | FlashAttention keeps exact attention but cuts memory to linear in n | — | 04 | yes |
| C-11 | A head splits into a QK circuit (where to look) and OV circuit (what to copy) | — | 05 | yes |
| C-12 | Heads specialise: positional, syntactic, coreference, delimiter | — | 05, visuals | yes |
| C-13 | Induction heads ([A][B]…[A]→[B]) drive in-context learning; built from a previous-token head + a matching head | — | 05 | yes |

## Recommended article outline

1. **Short answer** — attention = every token looking at every other and pulling in what's relevant; the QKV sentence. Claims C-01, C-02.
2. **§ I — Query, key, value** (`01`) — the three vectors, the lookup metaphor. C-01.
3. **§ II — The attention matrix** (interactive heatmap) (`02`, `visuals`) — worked example; hover a token, see its row. C-02, C-04, C-12.
4. **§ III — The equation** (`01`) — scaled dot-product card with softmax and √d_k. C-02, C-03.
5. **§ IV — Many heads at once** (`02`, `05`) — multi-head + head specialisation captions. C-05, C-06, C-11, C-12, C-13.
6. **§ V — Position, and the quadratic price** (`03`, `04`) — RoPE + O(n²) cost, cross-link to Concept 03. C-07, C-08, C-09, C-10.
7. **Sources & notes**.

## Visual / data brief

| Visual | Purpose | Key claims | Data available? |
|--------|---------|------------|-----------------|
| Attention-matrix heatmap | Hover a token → see what it attends to, weights as heatmap | C-02, C-04, C-12 | yes — illustrative precomputed JSON, see `visuals-and-data.md` |
| Head selector | Switch between 3 documented head types with editorial captions | C-12, C-13 | yes — captions grounded in Clark 2019 / Voita 2019 / Olsson 2022 |
| Equation card | Show softmax(QKᵀ/√d_k)V with alt-text | C-02, C-03 | yes — static |

## Open questions

1. **[nice-to-have]** Live-model extraction of weights would be more "real" than
   hand-authored illustrative matrices, but the build environment has no model
   runtime and the plan explicitly forbids runtime inference. Resolution:
   ship hand-authored matrices that depict documented head taxonomies, and
   disclose this plainly in `#sources`. See `visuals-and-data.md`.

## Handoff notes

Branch `plan/attention-mechanism`, worktree `/home/ubuntu/att-wt`. All chunks
draft-complete and cross-checked against ≥2 sources. No blockers for
implementation.
