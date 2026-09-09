# TMLR Rebuttal — Review Index and Requested Changes

This index follows the reviewer order in `tmlr_review.html`. Each note is titled by its main requested changes while retaining the reviewer ID for traceability.

## 1. [[01 - Reviewer i2V6 - Metrics, Grounding, Positioning, Controls, and Uncertainty|Reviewer i2V6 — Metrics, Grounding, Positioning, Controls, and Uncertainty]]

**Critical requests**

- Correct or redefine $G_{\mathrm{ACC}}$.
- Better separate grounding from downstream visual reasoning.
- Strengthen positioning against modern referring-expression benchmarks, especially Ref-Adv.

**Strengthening requests**

- Add controls for relevant-region extraction and graying.
- Report uncertainty for the counting split and smaller diagnostic analyses.
- Investigate the Gemini-3.x synthetic/real attribute-binding gap.

## 2. [[02 - Reviewer 8nar - Metrics, Synthetic Bias, Uncertainty, Human Baseline, and Zooming|Reviewer 8nar — Metrics, Synthetic Bias, Uncertainty, Human Baseline, and Zooming]]

- Clarify whether group accuracy is a macro average or a strict joint criterion.
- Test or properly scope the synthetic self-preference claim for Gemini-3.5-Flash and Gemini-3.1-Pro-Preview.
- Report repeated runs or uncertainty intervals for Tables 2 and 4 and Figures 5 and 8.
- Report the number of parent queries per split.
- Explain how the answering filter shapes the human baseline and human–model gap.
- Extend the zoom study to at least one stronger model.

## 3. [[03 - Reviewer z6WX - Synthetic Gap, Region Extraction, Localization, and Related Work|Reviewer z6WX — Synthetic Gap, Region Extraction, Localization, and Related Work]]

- Explain or appropriately scope the Gemini-3.x synthetic-AB anomaly and report count-conditioned sample frequencies/reliability.
- Separate localization quality from crop-resolution effects and test significance on the 800-sample subset.
- Explain why the localize-and-reason task was dropped and discuss it as a future direction.
- Connect the visual-prompting findings to internal grounding and visual-attention work in LVLMs.

## 4. [[04 - Reviewer MJZs - Positioning, Grounding, Controls, and Dataset Statistics|Reviewer MJZs — Benchmark Positioning, Grounding, Controls, and Dataset Statistics]]

- Strengthen related work and benchmark positioning across REC, phrase grounding, referring segmentation, DOD, and REIR.
- Add quantitative evidence that existing benchmarks underrepresent dense same-category and relational reasoning settings.
- Distinguish grounding failures from attribute-binding failures using an explicit grounding evaluation.
- Add controls for visual prompting, graying, and region extraction, or weaken the corresponding causal claims.
- Report basic dataset statistics, including image counts and questions per image.

## 5. [[05 - Reviewer 2b3E - Grounding, Intervention Controls, Metrics, and Counting Consistency|Reviewer 2b3E — Grounding, Intervention Controls, Metrics, and Counting Consistency]]

- Revise or strengthen the decomposition of localization, recognition, and attribute binding.
- Add proper controls for distractor reduction and relevant-region extraction.
- Correct the interpretation of $G_{\mathrm{ACC}}$ and add strict group exact match.
- Evaluate hierarchical counting consistency, exact match, MAE, and signed bias.
- Add clustered bootstrap uncertainty and paired significance analyses at appropriate grouping levels.
- Strengthen the synthetic-data analysis.
