# Reviewer 8nar — Metrics, Synthetic Bias, Uncertainty, Human Baseline, and Zooming

## Requested Change R1 — Clarify whether group accuracy is the macro average in Eq. (1) or the joint criterion in Sec. 3.2

### Clarification of Group Accuracy (G\_ACC)

We thank the reviewer for raising this point. We would like to clarify that **G\_ACC was not intended to be an all-or-nothing criterion**. As explicitly defined in Eq. (1), for each target instance we first compute the fraction of its valid attribute questions answered correctly, and then average this quantity equally across target instances. Thus, an instance for which four out of five attributes are answered correctly contributes 0.8, not 0.

Our use of the term *jointly* was intended to indicate that the valid attributes associated with the same target instance are evaluated together as a group, rather than pooling all attribute questions independently across the benchmark. This group-wise averaging also ensures that every target instance receives equal weight regardless of the number of valid attributes associated with it; consequently, an error has a larger effect on the score of an instance characterized by fewer attributes.

We agree that the word *jointly* may be read as implying an all-attributes-correct criterion, although this is not what Eq. (1) computes. We will revise this wording in the manuscript to make the intended interpretation explicit. **The metric definition and reported results remain unchanged.**

---

## Requested Change R2 — Run or properly scope the synthetic self-preference check for Gemini-3.5-Flash and Gemini-3.1-Pro-Preview

### Scope of the synthetic self-preference control

We thank the reviewer for this suggestion, and would like to first clarify what the existing control measures. The synthetic-image self-preference check reported in the appendix is a **between-model comparison on the synthetic split**, not a real-versus-synthetic comparison. Using the same prompt, answer-format constraints and decoding setup as the main evaluation, G2.5-Pro obtains **47.7** synthetic AB $\mathcal{I}_{\mathrm{ACC}}$, against **49.7** for GPT-5-medium, **47.9** for Q3-32B-Instruct and **45.1** for IVL3.5-241B-A28B.

| **Model** | **Syn. AB $\mathcal{I}_{\mathrm{ACC}}$** |
|---|---:|
| G2.5-Pro *(generator)* | 47.7 |
| GPT-5-medium | 49.7 |
| Q3-32B-Instruct | 47.9 |
| IVL3.5-241B-A28B | 45.1 |

The generating model is therefore mid-pack on its own images rather than uniquely dominant, and is outperformed by two of the three non-Gemini models compared. This is the sense in which we report no self-preference advantage: the synthetic split does not confer an artificial benefit on the model that produced it.

We would also note that self-preference is defined only with respect to the **generating** model. Neither Gemini-3.5-Flash nor Gemini-3.1-Pro-Preview generated any MIMO-Bench image. Applying the same check to these models would therefore not test self-preference; it would test whether models within the Gemini family share an affinity for Gemini-generated images. That is a distinct hypothesis, and one the present control is not designed to isolate, since the control establishes its conclusion by comparing the generator against contemporaneous non-Gemini models rather than by comparing splits within a single model.

We agree that the Gemini-3.x synthetic gain itself remains unexplained by our current experiments. We treat it as an **observed anomaly** rather than attributing it either to genuine capability or to a generator-specific effect, and we will state this explicitly as a limitation in the revised manuscript, together with the scope of the available control.

---

## Requested Change R3 — Report repeated runs or intervals for Tables 2 and 4 and Figures 5 and 8

### Statistical uncertainty for Table 2

We thank the reviewer for requesting uncertainty estimates for the main evaluation. We now report 95% confidence intervals alongside the Table 2 metrics, for both Attribute Binding (IACC and G\_ACC) and Numerical Counting (IMRA, LMRA and GMRA).

#### Attribute Binding (AB)

| Method | Variant | Real IACC | Real G\_ACC | Syn. IACC | Syn. G\_ACC |
| ----------------------------------------------------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| **API-accessed MLLMs**                                      |                      |                      |                      |                      |                      |
| Gemini-3.x                                                  | 3.5 Flash High       | 54.58 [49.64, 60.14] | 54.89 [49.90, 60.99] | 68.24 [63.90, 73.24] | 67.91 [63.41, 73.31] |
|                                                             | 3.5 Flash Low        | 45.5 [41.54, 50.99]  | 44.8 [40.72, 50.92]  | 73.0 [68.13, 79.39]  | 75.6 [70.61, 82.25]  |
|                                                             | 3.1 Pro Preview High | 48.29 [44.52, 53.87] | 47.30 [42.47, 54.65] | 65.41 [61.40, 70.28] | 65.92 [61.32, 71.55] |
|                                                             | 3.1 Pro Preview Low  | 46.5 [41.75, 52.78]  | 46.3 [40.76, 54.56]  | 71.8 [66.23, 79.71]  | 73.5 [67.06, 81.38]  |
| Gemini-2.5                                                  | Flash                | 51.3 [47.65, 56.09]  | 51.9 [47.09, 57.43]  | 48.1 [43.46, 52.56]  | 42.1 [36.45, 47.79]  |
|                                                             | Pro                  | 49.1 [45.87, 52.46]  | 49.5 [46.28, 52.86]  | 47.2 [44.97, 99.97]  | 44.9 [38.91, 100.00] |
| GPT-5                                                       | minimal              | 32.0 [—]             | 31.2 [—]             | 28.0 [—]             | 24.1 [—]             |
|                                                             | medium               | 52.8 [—]             | 53.4 [—]             | 49.8 [—]             | 48.1 [—]             |
| GLM                                                         | 4.5V                 | 50.3 [41.44, 58.36]  | 50.0 [39.59, 60.99]  | 41.7 [15.67, 69.09]  | 33.8 [9.93, 65.63]   |
|                                                             | 4.1V-9B-Thinking     | 34.6 [31.53, 37.45]  | 36.2 [32.63, 39.60]  | 38.7 [31.92, 43.76]  | 35.3 [29.21, 40.85]  |
| InternVL3.5                                                 | 241B-A28B            | 47.6 [44.30, 51.36]  | 45.2 [41.27, 49.49]  | 43.3 [37.48, 53.70]  | 42.9 [36.32, 54.15]  |
| **Locally evaluated open-weight MLLMs**                     |                      |                      |                      |                      |                      |
| Qwen3-VL                                                    | 32B-Instruct         | 47.7 [44.38, 51.18]  | 48.5 [44.91, 52.10]  | 47.0 [42.32, 50.04]  | 45.0 [39.35, 48.95]  |
|                                                             | 32B-Thinking         | 52.25 [46.72, 58.50] | 51.46 [46.48, 63.73] | 58.46 [46.67, 85.00] | 57.44 [45.37, 84.31] |
|                                                             | 8B-Instruct          | 42.4 [39.82, 45.47]  | 42.0 [38.76, 45.67]  | 36.2 [29.60, 40.06]  | 32.5 [25.39, 37.76]  |
|                                                             | 8B-Thinking          | 56.61 [50.79, 62.45] | 57.49 [48.97, 64.63] | 40.82 [30.14, 61.29] | 45.14 [34.90, 65.62] |
|                                                             | 30B-A3B-Instruct     | 36.6 [32.63, 40.93]  | 33.2 [28.94, 37.94]  | 28.2 [14.25, 39.19]  | 27.1 [13.82, 38.37]  |
|                                                             | 30B-A3B-Thinking     | 43.28 [38.44, 47.95] | 43.05 [37.64, 48.40] | 41.49 [30.05, 50.92] | 40.29 [28.93, 50.72] |
| Qwen2.5-VL                                                  | 72B-Instruct         | 38.6 [31.24, 49.68]  | 38.7 [30.85, 48.96]  | 50.6 [32.21, 56.90]  | 45.1 [26.56, 53.83]  |
|                                                             | 32B-Instruct         | 38.4 [34.12, 44.51]  | 36.9 [32.45, 43.18]  | 41.2 [34.57, 45.16]  | 41.0 [33.83, 45.52]  |
|                                                             | 7B-Instruct          | 35.5 [32.06, 39.24]  | 35.2 [31.62, 38.88]  | 36.4 [27.79, 42.76]  | 34.3 [26.71, 39.36]  |
| InternVL3.5                                                 | 38B                  | 40.9 [38.06, 43.95]  | 40.3 [37.46, 43.27]  | 46.5 [—]             | 44.6 [—]             |
|                                                             | 14B                  | 32.1 [28.55, 35.52]  | 31.7 [27.62, 35.52]  | 39.0 [33.71, 44.20]  | 40.1 [35.35, 45.44]  |
|                                                             | 8B                   | 38.6 [36.31, 41.04]  | 38.1 [35.35, 41.00]  | 44.2 [35.22, 51.69]  | 43.7 [35.15, 51.84]  |
|                                                             | 14B-Instruct         | 36.36 [0.00, 43.75]  | 31.42 [0.00, 39.88]  | 53.20 [45.70, 58.41] | 52.42 [44.59, 57.43] |
|                                                             | 30B-A3B              | 42.04 [36.69, 45.23] | 39.33 [33.03, 42.78] | 33.83 [32.35, 34.15] | 33.75 [32.54, 37.50] |
| InternVL3                                                   | 78B                  | 40.2 [36.95, 43.87]  | 40.3 [36.53, 44.33]  | 37.6 [31.20, 46.90]  | 35.0 [28.73, 46.32]  |
|                                                             | 38B                  | 42.3 [39.42, 45.90]  | 42.5 [39.08, 46.47]  | 48.3 [30.95, 63.98]  | 44.7 [27.50, 61.96]  |
|                                                             | 14B                  | 35.9 [32.80, 39.47]  | 35.1 [32.07, 38.81]  | 39.7 [34.82, 44.20]  | 38.9 [33.80, 44.17]  |
|                                                             | 8B                   | 34.4 [31.07, 37.69]  | 35.5 [31.75, 38.88]  | 38.9 [34.78, 42.01]  | 37.2 [32.22, 40.97]  |
|                                                             | 14B-Instruct         | —                    | —                    | 48.51 [42.21, 57.14] | 47.58 [41.09, 57.30] |
| DeepEyes                                                    | —                    | 44.98 [41.15, 50.08] | 45.02 [40.89, 49.90] | 33.13 [28.15, 38.25] | 32.17 [27.63, 36.99] |

#### Numerical Counting (NC)

| Method | Variant | Real IMRA | Real LMRA | Real GMRA | Syn. IMRA | Syn. LMRA | Syn. GMRA |
| --------------------------------------------------------------------------- | -------------------- | ----------------- | ----------------- | ----------------- | ----------------- | ----------------- | ----------------- |
| **API-accessed MLLMs**                                                      |                      |                   |                   |                   |                   |                   |                   |
| Gemini-3.x                                                                  | 3.5 Flash High       | —                 | —                 | —                 | —                 | —                 | —                 |
|                                                                             | 3.5 Flash Low        | 52.5 [46.4, 58.5] | 49.4 [41.0, 58.2] | 46.7 [38.9, 53.7] | 66.9 [60.8, 72.9] | 66.0 [57.6, 74.8] | 67.2 [59.4, 74.2] |
|                                                                             | 3.1 Pro Preview High | —                 | —                 | —                 | —                 | —                 | —                 |
|                                                                             | 3.1 Pro Preview Low  | 56.7 [50.6, 62.1] | 55.8 [47.3, 63.5] | 63.3 [55.6, 70.1] | 64.0 [57.9, 69.4] | 62.6 [54.1, 70.3] | 64.1 [56.4, 70.9] |
| Gemini-2.5                                                                  | Flash                | 30.0 [23.2, 38.3] | 28.3 [19.7, 38.9] | 38.3 [28.3, 48.1] | 47.2 [40.4, 55.5] | 41.2 [32.6, 51.8] | 51.4 [41.4, 61.2] |
|                                                                             | Pro                  | 37.3 [32.1, 43.7] | 24.2 [17.2, 33.8] | 71.7 [63.2, 80.8] | 56.1 [50.9, 62.5] | 53.2 [46.2, 62.8] | 63.9 [55.4, 73.0] |
| GPT-5                                                                       | minimal              | 45.8 [—]          | 47.5 [—]          | 36.7 [—]          | 43.0 [—]          | 40.8 [—]          | 47.1 [—]          |
|                                                                             | medium               | 51.5 [45.4, 58.9] | 55.0 [47.7, 64.5] | 56.7 [46.5, 65.0] | 47.5 [41.4, 54.9] | 42.8 [35.5, 52.3] | 54.3 [44.1, 62.6] |
| GLM                                                                         | 4.5V                 | 33.9 [28.0, 40.7] | 36.2 [29.9, 44.3] | 38.3 [28.2, 47.1] | 47.3 [41.4, 54.1] | 48.5 [42.2, 56.6] | 38.6 [28.5, 47.4] |
|                                                                             | 4.1V-9B-Thinking     | 27.3 [21.7, 32.2] | 25.0 [13.4, 39.0] | 50.0 [30.0, 70.0] | 24.9 [19.3, 29.8] | 32.6 [21.0, 46.6] | 20.0 [0.0, 40.0]  |
| InternVL3.5                                                                 | 241B-A28B            | 47.8 [42.2, 58.0] | 50.0 [41.7, 64.1] | 39.5 [37.1, 45.8] | 51.2 [45.6, 61.4] | 50.6 [42.3, 64.7] | 50.1 [47.7, 56.4] |
| **Locally evaluated open-weight MLLMs**                                     |                      |                   |                   |                   |                   |                   |                   |
| Qwen3-VL                                                                    | 32B-Instruct         | 38.5 [33.0, 44.6] | 35.4 [28.4, 43.4] | 55.0 [44.6, 65.8] | 53.2 [47.7, 59.3] | 54.8 [47.8, 62.8] | 49.8 [39.4, 60.6] |
|                                                                             | 32B-Thinking         | —                 | —                 | —                 | —                 | —                 | —                 |
|                                                                             | 8B-Instruct          | 34.2 [28.0, 40.3] | 28.3 [20.2, 35.0] | 43.3 [29.8, 59.3] | 47.6 [41.4, 53.7] | 48.9 [40.8, 55.6] | 35.5 [22.0, 51.5] |
|                                                                             | 8B-Thinking          | —                 | —                 | —                 | —                 | —                 | —                 |
|                                                                             | 30B-A3B-Instruct     | 25.0 [18.8, 32.3] | 35.4 [25.7, 46.6] | 20.0 [5.8, 32.6]  | 41.0 [34.8, 48.3] | 44.5 [34.8, 55.7] | 38.8 [24.6, 51.4] |
|                                                                             | 30B-A3B-Thinking     | —                 | —                 | —                 | —                 | —                 | —                 |
| Qwen2.5-VL                                                                  | 72B-Instruct         | 30.8 [23.2, 40.8] | 35.8 [28.1, 46.2] | 23.3 [13.1, 35.3] | 46.2 [38.6, 56.2] | 47.0 [39.3, 57.4] | 43.1 [32.9, 55.1] |
|                                                                             | 32B-Instruct         | 28.9 [21.7, 36.6] | 28.3 [20.8, 37.4] | 28.3 [15.5, 38.5] | 42.4 [35.2, 50.1] | 40.0 [32.5, 49.1] | 47.2 [34.4, 57.4] |
|                                                                             | 7B-Instruct          | 27.3 [21.6, 36.0] | 30.0 [24.0, 37.9] | 31.7 [24.3, 42.6] | 33.9 [28.2, 42.6] | 33.5 [27.5, 41.4] | 27.2 [19.8, 38.1] |
| InternVL3.5                                                                 | 38B                  | 27.3 [20.9, 33.5] | 35.4 [25.2, 45.0] | 20.0 [12.7, 30.0] | 42.5 [36.1, 48.7] | 44.3 [34.1, 53.9] | 42.0 [34.7, 52.0] |
|                                                                             | 14B                  | 31.1 [25.9, 36.8] | 37.5 [29.8, 44.1] | 16.7 [7.4, 28.2]  | 42.5 [37.3, 48.2] | 38.9 [31.2, 45.5] | 47.5 [38.2, 59.0] |
|                                                                             | 8B                   | 36.1 [29.0, 42.1] | 45.8 [37.5, 52.0] | 13.3 [5.5, 20.9]  | 44.2 [37.1, 50.2] | 41.1 [32.8, 47.3] | 45.1 [37.3, 52.7] |
|                                                                             | 14B-Instruct         | —                 | —                 | —                 | —                 | —                 | —                 |
|                                                                             | 30B-A3B              | —                 | —                 | —                 | —                 | —                 | —                 |
| InternVL3                                                                   | 78B                  | 38.9 [31.1, 45.7] | 43.3 [33.6, 51.8] | 38.3 [26.9, 50.5] | 36.6 [28.8, 43.4] | 34.2 [24.5, 42.7] | 34.3 [22.9, 46.5] |
|                                                                             | 38B                  | 33.2 [28.0, 40.2] | 49.0 [42.0, 56.9] | 20.0 [7.6, 35.9]  | 45.6 [40.4, 52.6] | 45.3 [38.3, 53.2] | 39.6 [27.2, 55.5] |
|                                                                             | 14B                  | 26.8 [18.7, 33.2] | 32.5 [24.9, 41.4] | 6.7 [0.0, 15.9]   | 37.1 [29.0, 43.5] | 34.8 [27.2, 43.7] | 40.7 [28.8, 49.9] |
|                                                                             | 8B                   | 26.7 [21.2, 33.3] | 36.7 [26.8, 45.3] | 5.7 [0.0, 17.9]   | 37.3 [31.8, 43.9] | 41.3 [31.4, 49.9] | 24.3 [14.7, 36.5] |
|                                                                             | 14B-Instruct         | —                 | —                 | —                 | —                 | —                 | —                 |
| DeepEyes                                                                    | —                    | —                 | —                 | —                 | —                 | —                 | —                 |

For numerical counting, the effective number of parent groups is **57** for models with complete outputs. The exceptions in the current evaluation are **InternVL3.5-241B-A28B (41)**, **InternVL3-38B (56)**, **InternVL3-14B (36)**, **InternVL3-8B (50)**, and **GLM-4.1V-9B-Thinking (13)**. Parent-level information is unavailable for **GPT-5-minimal**.

#### Confidence intervals for Table 2.

Following the reviewer's suggestion, we have added confidence intervals to the

main results reported in Table 2. For each model, we now report confidence

intervals for both Attribute Binding metrics (IACC and G\_{\mathrm{ACC}})

and all three Numerical Counting metrics (IMRA, LMRA, and GMRA). The values

shown in brackets denote the corresponding 95% confidence intervals.

For example, Gemini-3.5-Flash-Low obtains an IACC of

54.72 [51.51, 58.99] and G\_{\mathrm{ACC}} of

55.13 [51.85, 59.72], while its NC IMRA, LMRA, and GMRA are

61.50 [56.7, 69.6], 59.77 [58.9, 76.9], and

59.51 [52.4, 68.1], respectively.

These additions allow the point estimates in Table 2 to be interpreted

together with their statistical uncertainty. In particular, the generally

wider intervals for the NC metrics make the greater uncertainty associated

with the smaller counting evaluation set explicit.

---

#### Pooled confidence intervals for Table 2

For completeness, we additionally report the pooled confidence intervals for the main MIMO-Bench metrics. For each model, the values in brackets denote the corresponding 95% confidence interval.

| Model | IACC (95% CI) | $G_{\mathrm{ACC}}$ (95% CI) | IMRA (95% CI) | LMRA (95% CI) | GMRA (95% CI) |
|---|---:|---:|---:|---:|---:|
| Gemini-3.5-Flash-Low | 54.72 [51.51, 58.99] | 55.13 [51.85, 59.72] | 61.50 [56.7, 69.6] | 59.77 [58.9, 76.9] | 59.51 [52.4, 68.1] |
| Gemini-3.1-Pro-Preview-Low | 54.99 [51.23, 59.87] | 55.42 [51.07, 61.50] | 61.26 [60.7, 73.1] | 60.05 [54.9, 72.0] | 63.80 [54.9, 72.8] |
| Gemini-2.5-Flash | 50.23 [47.28, 53.72] | 48.61 [44.86, 52.69] | 40.75 [38.1, 53.5] | 36.36 [31.1, 50.4] | 46.49 [39.7, 59.8] |
| Gemini-2.5-Pro | 48.46 [46.14, 65.68] | 47.96 [44.77, 66.15] | 49.05 [48.2, 60.4] | 42.33 [32.5, 49.7] | 66.83 [56.2, 73.9] |
| GPT-5-minimal | 30.66 [26.8, 35.2] | 28.82 [24.3, 33.3] | 44.05 [39.7, 49.1] | 43.31 [38.2, 47.9] | 43.20 [37.3, 52.4] |
| GPT-5-medium | 51.79 [47.8, 56.2] | 51.62 [47.2, 56.3] | 49.00 [39.1, 53.0] | 47.38 [34.6, 51.5] | 55.20 [40.5, 59.7] |
| GLM-4.5V | 47.42 [35.04, 60.25] | 44.57 [32.14, 60.36] | 42.27 [39.6, 52.5] | 43.89 [40.7, 55.3] | 38.49 [28.5, 47.4] |
| InternVL3.5-241B-A28B | 46.16 [43.04, 50.36] | 44.43 [40.91, 49.10] | 49.92 [41.3, 56.7] | 50.38 [46.7, 59.1] | 46.12 [38.2, 56.6] |
| InternVL3-78B | 39.33 [36.24, 43.10] | 38.52 [35.19, 43.00] | 37.46 [29.1, 43.6] | 37.61 [25.5, 43.9] | 35.80 [23.3, 46.8] |
| Qwen3-VL-32B-Instruct | 47.47 [44.78, 50.03] | 47.33 [44.31, 50.09] | 47.69 [45.6, 57.3] | 47.52 [45.2, 60.6] | 51.75 [39.8, 61.3] |
| Qwen3-VL-8B-Instruct | 40.32 [37.48, 42.76] | 38.81 [35.50, 41.86] | 42.58 [39.7, 52.2] | 41.17 [38.3, 53.5] | 38.42 [22.6, 52.5] |
| Qwen3-VL-30B-A3B-Instruct | 33.78 [27.97, 38.61] | 31.15 [25.74, 36.20] | 35.00 [32.6, 46.4] | 41.09 [33.9, 54.6] | 31.75 [22.5, 49.3] |
| Qwen2.5-VL-72B-Instruct | 42.62 [34.85, 50.42] | 40.85 [32.62, 48.42] | 40.42 [36.6, 54.5] | 42.80 [37.9, 56.1] | 35.67 [30.8, 53.2] |
| Qwen2.5-VL-32B-Instruct | 39.34 [35.57, 43.51] | 38.28 [34.35, 42.63] | 37.34 [33.3, 48.7] | 35.61 [30.8, 48.1] | 40.11 [32.1, 55.4] |
| Qwen2.5-VL-7B-Instruct | 35.80 [32.01, 39.20] | 34.90 [31.38, 37.97] | 31.43 [27.3, 41.8] | 32.19 [27.1, 41.3] | 28.89 [20.3, 38.8] |
| InternVL3.5-38B | 42.78 [36.89, 48.89] | 41.74 [36.89, 48.70] | 36.80 [33.9, 46.8] | 40.96 [32.5, 52.7] | 33.75 [31.9, 49.5] |
| InternVL3.5-14B | 34.41 [31.50, 37.38] | 34.52 [31.39, 37.73] | 38.23 [35.7, 46.9] | 38.38 [31.0, 45.4] | 35.95 [34.0, 55.8] |
| InternVL3.5-8B | 40.48 [37.03, 43.47] | 39.98 [36.44, 43.35] | 41.16 [36.0, 49.2] | 42.86 [33.1, 47.8] | 33.17 [33.0, 49.4] |
| InternVL3-38B | 44.31 [37.38, 50.20] | 43.24 [36.40, 49.67] | 40.95 [38.9, 51.3] | 46.69 [38.7, 53.7] | 32.25 [25.2, 53.6] |
| InternVL3-14B | 37.17 [34.53, 40.05] | 36.37 [33.66, 39.45] | 33.24 [26.5, 41.6] | 33.94 [26.7, 43.4] | 27.95 [20.0, 44.4] |
| InternVL3-8B | 35.91 [33.24, 38.35] | 36.07 [33.09, 38.69] | 33.33 [30.4, 42.9] | 39.58 [30.2, 49.4] | 17.32 [14.2, 36.2] |
| GLM-4.1V-9B-Thinking | 35.98 [32.91, 38.49] | 35.90 [32.73, 38.80] | 25.80 [19.7, 30.8] | 29.75 [18.2, 45.5] | 31.25 [0.0, 41.5] |

---

#### Confidence intervals for Figure 5: Visual Prompting

For the visual-prompting experiment, we report uncertainty directly on the paired performance difference,

\[
\Delta = \mathrm{IACC}_{\mathrm{Visual\ Prompting}} - \mathrm{IACC}_{\mathrm{Without\ Visual\ Prompting}}.
\]

| Model | $\Delta$ IACC | 95% CI of $\Delta$ |
|---|---:|---:|
| Qwen3-VL-8B-Instruct | **+25.5** | [19.84, 31.59] |
| GLM-4.5V | **+18.5** | [13.42, 23.96] |
| Qwen3-VL-32B-Instruct | **+18.0** | [13.85, 22.12] |
| Qwen2.5-VL-32B-Instruct | **+22.5** | [18.11, 26.98] |
| Qwen3-VL-30B-A3B-Instruct | **+24.0** | [16.20, 29.15] |
| InternVL3-38B | **+10.8** | [6.95, 14.97] |
| InternVL3.5-38B | **+12.4** | [8.04, 17.17] |
| InternVL3-14B | **+13.2** | [9.81, 17.01] |
| InternVL3.5-14B | **+11.2** | [7.09, 15.44] |
| InternVL3-8B | **+8.6** | [5.29, 12.37] |
| InternVL3.5-8B | **+6.0** | [3.87, 8.48] |

The 95% confidence interval of the paired improvement excludes zero for all 11 evaluated models. Thus, although the magnitude of the gain varies across models, the positive effect of visual prompting is consistently observed across the evaluated models.

---

#### Confidence intervals for Table 4: Thinking vs. Non-Thinking

For Table 4, we report the paired difference between reasoning conditions. For Qwen models, $\Delta=\mathrm{Thinking}-\mathrm{Instruct}$; for Gemini models, $\Delta=\mathrm{High\ reasoning}-\mathrm{Low\ reasoning}$. Bold entries denote differences whose 95% confidence interval excludes zero.

| Model | $\Delta$ IACC (95% CI) | $\Delta$ $G_{\mathrm{ACC}}$ (95% CI) | $\Delta$ IMRA (95% CI) | $\Delta$ LMRA (95% CI) | $\Delta$ GMRA (95% CI) |
|---|---:|---:|---:|---:|---:|
| Q3-8B | **+5.2 [+0.8, +9.9]** | +4.7 [-2.7, +12.1] | +3.4 [-6.0, +13.5] | **+22.3 [+11.2, +36.2]** | +5.9 [-4.4, +15.3] |
| Q3-30B-A3B | +1.8 [-0.9, +4.4] | **+5.0 [+1.9, +7.6]** | — | — | — |
| Q3-32B | -0.1 [-4.4, +7.4] | -2.5 [-9.5, +10.5] | +2.5 [-8.9, +11.9] | +2.8 [-10.4, +14.3] | -6.2 [-23.1, +7.6] |
| G3.1-Pro-Preview | -0.6 [-2.5, +1.1] | +0.1 [-2.4, +2.4] | -4.8 [-8.6, +1.3] | -5.9 [-12.4, +4.1] | +1.2 [-10.7, +11.9] |
| G3.5-Flash | **+3.6 [+0.6, +5.7]** | -1.9 [-4.8, +0.4] | **+6.4 [+3.2, +10.6]** | **+13.3 [+9.3, +18.0]** | **+5.0 [+0.4, +12.3]** |

These intervals reinforce the manuscript's interpretation that test-time reasoning does not uniformly improve MIMO performance. Several nominal changes have intervals that include zero, while clear improvements occur only for particular model--metric combinations.

---

#### Confidence intervals for Figure 8: Chain-of-Thought Prompting

For Figure 8, we report paired changes relative to the same Base condition,

\[
\Delta_{\mathrm{ZS-CoT}}=\mathrm{ZS\mbox{-}CoT}-\mathrm{Base},
\]

and

\[
\Delta_{\mathrm{SC-CoT}}=\mathrm{SC\mbox{-}CoT}-\mathrm{Base}.
\]

Bold entries denote differences whose 95% confidence interval excludes zero.

| Model | $\Delta$ ZS-CoT vs. Base (95% CI) | $\Delta$ SC-CoT vs. Base (95% CI) |
|---|---:|---:|
| IVL3-14B | -2.0 [-5.2, +1.5] | +4.0 [-4.3, +9.6] |
| IVL3-8B | -1.0 [-4.0, +2.3] | -1.0 [-5.1, +6.5] |
| IVL3.5-14B | +1.0 [-4.3, +5.4] | +0.0 [-14.2, +9.1] |
| IVL3.5-8B | **+7.0 [+4.3, +9.6]** | +1.0 [-6.8, +6.3] |
| QVL2.5-7B | +1.0 [-3.9, +7.0] | +2.0 [-13.8, +10.6] |
| QVL2.5-32B | +0.0 [-11.2, +8.7] | -1.0 [-8.1, +4.2] |
| QVL3-8B | +0.0 [-9.0, +4.9] | +0.0 [-12.4, +8.0] |
| QVL3-32B | **-7.0 [-17.3, -1.4]** | **-11.0 [-15.3, -3.7]** |

## Requested Change R4 — Report the number of parent queries per split

### Parent-query counts

The Numerical Counting split contains **57 parent queries in total**, comprising **39 synthetic parent queries** and **18 real parent queries**.

We will explicitly report the number of parent queries underlying each split so that the amount of independent support behind the corresponding question-level statistics is clear.

## Requested Change R5 — Explain how the answering filter shapes the human baseline

### Human baseline and question filtering

We would like to clarify an important distinction between the benchmark filtering process and the human baseline.

During benchmark construction, *answerable* does not mean that an annotator found a question easy or answered it correctly. Candidate questions are discarded only when the queried attribute or object is not physically present, not clearly visible, or is ambiguous in the image. As stated in Sec. 3.3, annotators were explicitly instructed to discard questions only on these grounds rather than arbitrarily. This filtering is necessary to ensure that the answer is actually recoverable from the visual input.

**Difficulty is not a filtering criterion.** A question may therefore remain highly challenging because of dense same-category instances or a complex referring expression while still being visually answerable.

The human baseline is a separate measurement performed after benchmark construction. As stated in the footnote on Page 7 and in the appendix, it was measured using seven participants who were not involved in annotating MIMO-Bench, each solving 30 groups for AB and 20 groups for NC. Humans and models are evaluated on the same retained questions.

Thus, filtering establishes that the benchmark questions are visually answerable and unambiguous; it does not determine the human accuracy. The reported human–model gap is an independently measured performance gap on the same benchmark.

## Requested Change R6 — Extend the zoom study to at least one strong model

### Extension of the zooming analysis

We have also extended the relevant-region extraction (zooming) analysis to **Qwen3-VL-32B**, addressing the limitation that the original Table 5 contained only models of 14B parameters or smaller.

The new localization-quality analysis includes Qwen3-VL-32B alongside the original models. For Qwen3-VL-32B, the full-image baseline is **47.5%**, while final-answer accuracy across predicted-crop IoU bins is **41.2%, 45.5%, 49.0%, and 52.9%** for IoU ranges 0–25%, 25–50%, 50–75%, and 75–100%, respectively. Its externally supplied MIMO-Crop512 result is **48.9%**.

These results also support the broader observation from our new diagnostic analysis that successful localization is associated with improved downstream performance: for Qwen3-VL-32B, the highest-IoU predicted regions reach 52.9%, compared with the 47.5% full-image baseline.
