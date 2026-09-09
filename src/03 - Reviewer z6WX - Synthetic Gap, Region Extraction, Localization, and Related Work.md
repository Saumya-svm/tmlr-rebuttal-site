# Reviewer z6WX — Synthetic Gap, Region Extraction, Localization, and Related Work

## Requested Change R1 — Explain the Gemini-3.x synthetic-AB anomaly and establish the reliability of count-conditioned results

### Gemini-3.x synthetic–real gap and counting reliability

We thank the reviewer for pointing out the unusually large synthetic–real gap for Gemini-3.x. The synthetic images in MIMO-Bench were generated using **Gemini-2.5-Pro**, and our existing self-preference analysis evaluates the generating model against contemporaneous non-Gemini models on the synthetic split. G2.5-Pro obtains 47.7 AB $\mathcal{I}_{\mathrm{ACC}}$ there, against 49.7 for GPT-5-medium, 47.9 for Q3-32B-Instruct and 45.1 for IVL3.5-241B-A28B; the generator is therefore mid-pack on its own images rather than uniquely advantaged.

The unusually large synthetic gain is instead observed for **Gemini-3.x**, which consists of different models accessed through different API endpoints. We therefore do not interpret the current result as evidence of direct self-preference by the model that generated the images.

At the same time, our current experiments do not allow us to determine why Gemini-3.x performance is so strongly skewed toward the synthetic split. We therefore treat this as an **observed anomaly**, rather than attributing it either to genuine capability or to a generator-specific effect. We will make this limitation explicit in the revised manuscript and clarify that the available self-preference control applies specifically to Gemini-2.5-Pro, the model used to generate the synthetic images.

**[To be added: per-ground-truth sample frequencies for the numerical-counting analysis and the corresponding uncertainty/reliability discussion.]**

---

## Requested Change R2 — Separate localization quality from crop-resolution effects and test significance on the 800-sample subset

### Relevant-region extraction: localization quality and cropping controls

The aim of the relevant-region extraction experiment was primarily to test whether even a deliberately naive mechanism for adaptively narrowing the visual input can improve performance in the MIMO setting. We agree, however, that the original presentation did not sufficiently distinguish better localization from the other changes introduced by cropping, such as target enlargement, distractor reduction, and an additional inference call.

To characterize this more directly, we analyze all valid regions produced by the relevant-region extraction procedure. Across **23,109 predicted crops**, the mean crop size is approximately **459 × 479 pixels** (232,227 px²), corresponding to **12.43%** of the original image area.

We further compute the IoU between each model-proposed crop and the ground-truth target box and condition final-answer accuracy on this localization quality. We also compare against **MIMO-Crop512**, in which a relevant local crop is constructed externally from the benchmark annotations rather than being proposed by the evaluated MLLM.

| **Model** | **Base** | **0–25** | **25–50** | **50–75** | **75–100** | **MIMO-Crop512** |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| InternVL3-14B | 37.2 | 48.8 | 51.6 | 56.5 | 52.0 | 50.7 |
| InternVL3-8B | 35.9 | 35.4 | 44.9 | 51.5 | 51.0 | 46.8 |
| InternVL3.5-8B | 40.5 | 37.2 | 42.7 | 36.4 | 45.8 | 50.7 |
| Qwen3-VL-32B | 47.5 | 41.2 | 45.5 | 49.0 | 52.9 | 48.9 |
| Qwen3-VL-8B | 40.3 | 39.3 | 45.5 | 39.0 | 50.8 | 44.4 |
| Qwen2.5-VL-7B | 35.8 | 29.7 | 40.5 | 28.6 | 39.2 | 47.6 |
| **Mean** | **39.5** | **38.6** | **45.1** | **43.5** | **48.6** | **48.2** |

*Final-answer accuracy conditioned on predicted-crop IoU with the ground-truth target box, together with the full-image baseline and the externally constructed MIMO-Crop512 condition.*

Very poorly localized predicted crops (0–25% IoU) obtain **38.6%** mean accuracy, at or slightly below the **39.5%** full-image baseline, despite still receiving the additional inference call and crop/re-query operation. In contrast, highly overlapping model-selected crops (75–100% IoU) reach **48.6%**, closely matching the **48.2%** accuracy obtained with MIMO-Crop512.

The relationship is not strictly monotonic at intermediate IoUs because the useful region for a compositional referring expression can extend beyond the target box itself and include referenced neighboring objects. We therefore treat IoU as a localization-quality proxy rather than a complete measure of crop usefulness.

These results do not isolate localization, rescaling, distractor reduction, and the additional inference call as independent causal factors. Rather, they support the more limited proof-of-concept conclusion that when the model succeeds in selecting a target-relevant region, downstream performance approaches that obtained when a relevant crop is externally supplied.

We will revise the manuscript accordingly. We do not present the current method as a complete iterative visual-search mechanism: the paper introduces it as a **small exploratory study**, calls it **naive relevant-region extraction**, and describes it as **naive single-pass narrowing**. Here, “dynamic visual access” refers only to the fact that the visual input used for the final answer is determined by the model's preceding inference, rather than being a single fixed visual input.

#### Fixed and random crops, and a two-pass control.

To further separate model-driven region selection from generic cropping, rescaling, and the additional inference call, we evaluate fixed and random 512/1024 crops and a two-pass no-crop control on the same 200 examples across six models. Fixed crops use the same centered window for every image, whereas random crops place a reproducibly sampled window of the same size independently of the model.

| Control | $\Delta$ vs. Base | Target visible | Target absent | Visibility $\Delta$ |
| --- | ---: | ---: | ---: | ---: |
| Fixed 1024 | +1.0 | 49.7 | 34.1 | **+15.6** |
| Random 1024 | +0.8 | 53.5 | 31.9 | **+21.6** |
| Fixed 512 | -5.3 | 58.3 | 33.2 | **+25.1** |
| Random 512 | -8.7 | 49.0 | 31.3 | **+17.7** |

At 1024 resolution, fixed and random cropping is essentially unchanged from the full-image baseline, while the smaller 512 crops reduce accuracy because they much more frequently remove the queried target. Conditioning on target visibility makes the effect clearer: accuracy is higher when the target remains visible in all four crop conditions, with pooled differences of 15.6--25.1 points; the direction is positive for all 24 model-by-condition comparisons. When the target is absent, accuracy falls to approximately 31--34%, close to the benchmark majority-answer baseline.

We additionally test whether the additional inference call itself explains the gain. In this control the two-turn procedure is kept exactly as in relevant-region extraction: the first turn still asks the model, in text, for a plausible region containing the target, and the second turn passes the model its own predicted region together with the **unmodified** image rather than the crop. The region-proposal turn and the extra inference call are therefore held constant, and only the change of visual input is removed.

| Model | $\Delta$ |
| --- | ---: |
| Qwen2.5-VL-7B | +1.0 |
| Qwen3-VL-8B | +1.5 |
| InternVL3-8B | +2.0 |
| InternVL3.5-8B | +1.1 |
| InternVL3-14B | -1.5 |
| InternVL3.5-14B | +3.5 |
| **Mean** | **+1.3** |

The two-pass no-crop control therefore yields only a small mean improvement of $+1.3$ points, and no model gains more than $+3.5$. Together with the MIMO-Crop and predicted-region IoU analyses above, these controls indicate that generic cropping/rescaling or simply querying the model twice does not explain the relevant-region gains. The benefit is associated with successfully retaining target-relevant visual information, rather than with cropping or an additional inference call alone.

The 512-versus-1024 comparison directly addresses the resolution question:
the resolution change introduced by cropping does not by itself produce the
observed gains, since non-model-driven crops at either resolution leave mean
accuracy at or below the full-image baseline.

#### Uncertainty for the 800-sample subset analyses

We additionally report uncertainty for the intervention and prompting experiments performed on the 800-sample MIMO-Bench subset. Because the compared conditions are evaluated on matched examples, we report the **paired change** between conditions together with its **95% confidence interval**, preserving the same-example pairing in the resampling procedure.

##### Visual prompting

For visual prompting, we evaluate

\[
\Delta_{\mathrm{VP}}
=
\mathrm{IACC}_{\mathrm{with\ visual\ prompting}}
-
\mathrm{IACC}_{\mathrm{without\ visual\ prompting}}.
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

The paired 95% confidence interval excludes zero for all eleven evaluated models. Thus, although the magnitude of the gain varies substantially across models, the positive change under visual prompting is consistently observed across the evaluated models.

##### Thinking/reasoning

For the thinking/reasoning comparison, we similarly report paired changes between the Thinking and Instruct variants for Qwen models, and between High- and Low-reasoning-effort settings for Gemini models.

| **Model** | **Δ IACC (95% CI)** | **Δ GACC (95% CI)** | **Δ IMRA (95% CI)** | **Δ LMRA (95% CI)** | **Δ GMRA (95% CI)** |
| --- | ---: | ---: | ---: | ---: | ---: |
| Qwen3-VL-8B | **+5.2 [+0.8, +9.9]** | +4.7 [-2.7, +12.1] | +3.4 [-6.0, +13.5] | **+22.3 [+11.2, +36.2]** | +5.9 [-4.4, +15.3] |
| Qwen3-VL-30B-A3B | +1.8 [-0.9, +4.4] | **+5.0 [+1.9, +7.6]** | — | — | — |
| Qwen3-VL-32B | -0.1 [-4.4, +7.4] | -2.5 [-9.5, +10.5] | +2.5 [-8.9, +11.9] | +2.8 [-10.4, +14.3] | -6.2 [-23.1, +7.6] |
| Gemini-3.1-Pro-Preview | -0.6 [-2.5, +1.1] | +0.1 [-2.4, +2.4] | -4.8 [-8.6, +1.3] | -5.9 [-12.4, +4.1] | +1.2 [-10.7, +11.9] |
| Gemini-3.5-Flash | **+3.6 [+0.6, +5.7]** | -1.9 [-4.8, +0.4] | **+6.4 [+3.2, +10.6]** | **+13.3 [+9.3, +18.0]** | **+5.0 [+0.4, +12.3]** |

Bold entries denote differences whose 95% confidence interval excludes zero. These intervals reinforce the manuscript's interpretation that test-time reasoning does not uniformly improve MIMO performance. Several nominal changes have intervals that include zero, while clear improvements occur only for particular model–metric combinations.

##### Chain-of-Thought prompting

For Chain-of-Thought prompting, we report the paired changes relative to the same Base condition,

\[
\Delta_{\mathrm{ZS-CoT}}
=
\mathrm{ZS\mbox{-}CoT}
-
\mathrm{Base},
\]

and

\[
\Delta_{\mathrm{SC-CoT}}
=
\mathrm{SC\mbox{-}CoT}
-
\mathrm{Base}.
\]

| **Model** | **Δ ZS-CoT vs. Base (95% CI)** | **Δ SC-CoT vs. Base (95% CI)** |
| --- | ---: | ---: |
| IVL3-14B | -2.0 [-5.2, +1.5] | +4.0 [-4.3, +9.6] |
| IVL3-8B | -1.0 [-4.0, +2.3] | -1.0 [-5.1, +6.5] |
| IVL3.5-14B | +1.0 [-4.3, +5.4] | +0.0 [-14.2, +9.1] |
| IVL3.5-8B | **+7.0 [+4.3, +9.6]** | +1.0 [-6.8, +6.3] |
| QVL2.5-7B | +1.0 [-3.9, +7.0] | +2.0 [-13.8, +10.6] |
| QVL2.5-32B | +0.0 [-11.2, +8.7] | -1.0 [-8.1, +4.2] |
| QVL3-8B | +0.0 [-9.0, +4.9] | +0.0 [-12.4, +8.0] |
| QVL3-32B | **-7.0 [-17.3, -1.4]** | **-11.0 [-15.3, -3.7]** |

The uncertainty analysis strengthens our original conclusion that CoT does not reliably improve MIMO performance. Most paired differences have 95% confidence intervals that include zero. The only clear positive effect is ZS-CoT for IVL3.5-8B, while QVL3-32B shows a clear degradation under both ZS-CoT and SC-CoT. Thus, neither Zero-Shot nor Self-Consistency CoT provides a consistent improvement across the evaluated models.

We will add these uncertainty estimates to the revised manuscript so that the conclusions drawn from the smaller subset analyses are accompanied by their corresponding statistical uncertainty.

---

## Requested Change R3 — Explain why the localize-and-reason task was dropped and outline it as a future direction

### Why the localize-and-reason task was not retained

We had initially explored a separate localize-and-reason formulation, but did not retain it as a benchmark task because we could not identify a localization interface that provided both a reliable and neutral intermediate evaluation.

Coordinate prediction preserves the original visual input, but introduces an additional requirement for precise spatial-coordinate generation. In our new grounding evaluation, coordinate-based localization is substantially weaker than candidate-based grounding, suggesting that the resulting score reflects not only referring-expression understanding but also the model's ability to express that localization through precise coordinates.

Candidate-box localization provides a much cleaner discrete decision, but requires adding candidate markers to the image, thereby modifying the original visual input and changing the task itself.

Our new grounding analysis makes this dependence on the localization interface explicit. Measured grounding accuracy differs substantially between the two formulations, preventing us from treating either one as a format-independent numerical estimate of the model's underlying grounding ability.

This was the primary reason for not making localization a mandatory intermediate stage of MIMO-Bench. Attribute Binding has a naturally defined answer format, whereas a localization readout necessarily introduces an additional interface choice. We agree that developing more reliable grounding readouts and localize-and-reason formulations is an important future direction, and we will clarify this motivation in the revised manuscript.

---

## Requested Change R4 — Discuss connections to internal grounding and visual-attention mechanisms in LVLMs

### Connection to internal attention and grounding mechanisms.

We thank the reviewer for highlighting this relevant line of work. We agree that our visual-prompting results connect naturally to recent studies investigating the internal vision--language mechanisms underlying visual grounding and hallucination. Our experiments approach the problem from a complementary, behavioral perspective: rather than inspecting or modifying internal attention/neuron dynamics, we intervene on the model's visual input by explicitly marking the target or restricting the relevant region, and measure the resulting change in MIMO performance. The consistent gains under these interventions suggest that improving target selection/grounding is an important direction, while our experiments do not identify the particular internal mechanism responsible for these gains. We will add the suggested works to the Related Work/Discussion and explicitly position internal attention analysis and attention-guided intervention as a promising direction for studying why MLLMs fail under dense same-category distractors.
