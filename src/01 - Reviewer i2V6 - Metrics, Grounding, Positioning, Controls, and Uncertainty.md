# Reviewer i2V6 — Metrics, Grounding, Benchmark Positioning, Controls, and Uncertainty

We sincerely thank the reviewer for providing constructive feedback for our work. The feedback has allowed us to improve and tighten our work. We are encouraged that the reviewer finds the premise of the work useful for multimodal LLM research. Listed below is our response to the reviewer on the changes requested by them.  

## Requested Change R1 [Critical] — Correct or redefine $G_{\mathrm{ACC}}$

### Clarification of Group Accuracy ($G_{\mathrm{ACC}}$).

We would like to clarify that $G_{\mathrm{ACC}}$ was not intended to be an all-or-nothing criterion.
As explicitly defined in Eq. (1), for each target instance we first compute
the fraction of its valid attribute questions answered correctly, and then
average this quantity equally across target instances. Thus, an instance for
which four out of five attributes are answered correctly contributes $0.8$,
not $0$.

**Our use of the term "jointly" was intended to indicate that the valid**
**attributes associated with the same target instance are evaluated together**
**as a group, rather than pooling all attribute questions independently across**
**the benchmark.** This group-wise averaging also ensures that every target
instance receives equal weight regardless of the number of valid attributes
associated with it; consequently, an error has a larger effect on the score
of an instance characterized by fewer attributes. 


We agree that the word "jointly" may be read as implying an all-attributes-
correct criterion. We will revise this wording in the manuscript to make the intended interpretation explicit. The metric definition and reported results remain unchanged.

## Requested Change R2 [Critical] — Better separate grounding from downstream visual reasoning



### Better separating RE grounding from downstream visual reasoning.

Thank you for this important suggestion. We agree that the original
visual-prompting experiment alone did not cleanly separate referring-expression
(RE) grounding from downstream Attribute Binding (AB) performance due to additional errors that can arise from prompting artifacts. We have therefore added explicit RE-grounding evaluations and directly connected their outcomes to the corresponding AB answers.

**Explicit RE grounding.**

Unlike AB, for which MIMO-Bench defines a fixed multiple-choice output, there is
no single neutral output format for localization. We therefore evaluate two
complementary grounding interfaces on the full evaluation set.

In *box-choice grounding*, the original RE is retained and four candidate
instances are marked; the model must select the candidate referred to by the RE.
This gives a simple discrete grounding decision, but necessarily modifies the
image through the candidate overlays. In *coordinate grounding*, the model
instead receives the original unmodified image and RE and predicts the target
coordinates. This avoids candidate overlays, but introduces an additional
spatial-coordinate prediction requirement.

| **Model** | **Grounding** | $\mathbf{G^+A^+}$ | $\mathbf{G^+A^-}$ | $\mathbf{G^-A^+}$ | $\mathbf{G^-A^-}$ | **G-Acc.** | $\mathbf{P(A^+\mid G^+)}$ | $\mathbf{P(A^+\mid G^-)}$ | $\boldsymbol{\Delta}$ |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Qwen3-VL-8B | Box-choice | 36.9 | 29.6 | 15.6 | 18.0 | 66.5 | 55.5 | 46.4 | +9.1 |
|  | Coordinates | 15.9 | 10.6 | 32.4 | 41.1 | 26.5 | 59.9 | 44.1 | +15.8 |
| InternVL3-14B | Box-choice | 30.7 | 18.9 | 27.9 | 22.5 | 49.6 | 61.9 | 55.3 | +6.5 |
|  | Coordinates | 7.7 | 6.1 | 48.2 | 38.0 | 13.8 | 55.9 | 55.9 | 0.0 |
| InternVL3.5-14B | Box-choice | 26.3 | 28.0 | 17.5 | 28.3 | 54.3 | 48.4 | 38.2 | +10.3 |
|  | Coordinates | 7.1 | 8.4 | 34.0 | 50.6 | 15.4 | 45.6 | 40.2 | +5.5 |
| InternVL3-8B | Box-choice | 27.2 | 22.1 | 24.9 | 25.8 | 49.3 | 55.2 | 49.2 | +6.0 |
|  | Coordinates | 5.2 | 4.6 | 42.9 | 47.3 | 9.8 | 52.9 | 47.6 | +5.3 |
| InternVL3.5-8B | Box-choice | 21.0 | 29.4 | 17.2 | 32.4 | 50.4 | 41.6 | 34.7 | +6.9 |
|  | Coordinates | 7.0 | 11.0 | 28.9 | 53.0 | 18.1 | 38.9 | 35.3 | +3.6 |

*Explicit RE-grounding outcomes and their correspondence with
Attribute Binding (AB) answers on matched examples.
Cells report the percentage of the evaluation set falling in each outcome. $G^+$/$G^-$ denote correct/incorrect grounding and
$A^+$/$A^-$ denote correct/incorrect AB answers.
G-Acc. denotes grounding accuracy, and
$\Delta=P(A^+|G^+)-P(A^+|G^-)$.
All accuracies and conditional probabilities are percentages.
Chance accuracy for box-choice grounding is 25%.*

The box-choice results provide a clear behavioral separation. Grounding itself
is far from solved (49.3--66.5%), and for every model AB accuracy is higher
when the RE is grounded correctly:
$P(A^+|G^+)-P(A^+|G^-)=+6.0$ to $+10.3$ points. At the same time,
correct grounding is not sufficient for a correct AB answer:
$P(A^+|G^+)$ remains only 41.6--61.9%. Thus, we directly observe both
grounding failures and a large set of cases in which grounding succeeds but the
queried attribute is still answered incorrectly.

The coordinate results also reveal an important limitation of attempting to
insert "localization" as a clean intermediate stage. Coordinate grounding is
substantially weaker (9.8--26.5%) and its correspondence with AB accuracy is
less consistent. We do not interpret this as evidence that the same models
suddenly possess much poorer underlying RE comprehension. Rather, coordinate
prediction additionally requires the model to express its localization through
a precise spatial output, whereas box-choice constrains the answer space but
alters the image. The large disparity between these two grounding interfaces
therefore shows that measured localization performance itself depends on how
the grounding decision is elicited.

This ambiguity is also why we had originally refrained from introducing an
explicit localization stage into MIMO-Bench: unlike the AB output, there is no
obvious localization interface that does not introduce an additional task
requirement or input modification. We agree, however, that this limitation and
the distinction between grounding and downstream reasoning should have been
made explicit. We now report both grounding formulations rather than relying on
visual prompting alone.

Additionally the annotated data does have the bounding polygon coordinates for each and every target object. Hence, a developer who intends to benchmark their MLLM using MIMO-Bench can choose the preferred choice of intervention, either though overlaid bounding boxes on the image or through raw coordinates. 

**Revised interpretation of visual prompting.**

Visual prompting now serves a separate purpose. It replaces the compositional
textual RE with a ground-truth visual indication of the target and measures AB
performance when the target is specified directly. Its substantial IACC gain
therefore shows that replacing RE-based target identification with direct visual
target specification makes the task considerably easier. However, because the
marker itself changes the image and must be perceived and interpreted, we no
longer interpret this gain as a pure grounding-error estimate or the remaining
error as pure attribute binding. Residual errors can additionally arise from
fine-grained recognition, component identification, interpretation of the
visual marker, or other target-conditioned visual reasoning failures.

Accordingly, our revised conclusion is behavioral rather than an exact causal
partition: RE grounding is itself challenging; successful grounding is
consistently associated with better AB performance; and substantial AB error
remains even when grounding succeeds. Visual prompting provides complementary
evidence that externally supplying the target alleviates a substantial part of
the difficulty.

Finally, the benchmark already associates each RE with its ground-truth target
annotation. We will release the corresponding ground-truth target localization
(mask/bounding-box coordinates) with MIMO-Bench, enabling future work to
evaluate alternative grounding formulations without reconstructing these
annotations.

## Requested Change R3 [Critical] — Strengthen positioning against modern referring-expression benchmarks

### Positioning relative to Ref-Adv.

We thank the reviewer for pointing us to Ref-Adv, which is closely related in its study of same-category distractors and complex referring expressions. We have added it to the revised related work and comparison. Importantly, however, Ref-Adv and MIMO-Bench evaluate different capabilities and operate in substantially different scene regimes. Ref-Adv is a referring-expression comprehension (REC) benchmark: given an image and a referring expression, the model is evaluated on localization of a single target object. MIMO-Bench instead embeds reference resolution within downstream visual reasoning, requiring the model to identify the relevant instance or group and subsequently perform attribute binding or numerical counting. The density regimes are also substantially different. Ref-Adv contains at least two same-category distractors and reports 4.01 distractors per example on average, with $\geq7$ forming its highest-distractor analysis bin. In contrast, dense multi-instance structure is a defining axis of MIMO-Bench: Fig. 2 of the main paper shows median per-category instance counts of 57 for persons, 53 for pots, 49 for plants, 45 for upper-body clothing, 43 for vases, and 40 for leaves; for several categories, even the first quartile contains more than 20 instances. MIMO-Bench further combines high-resolution real ($\sim2500\times1500$) and synthetic ($1024\times1024$) scenes to enable such density. Thus, the overlap lies in the use of same-category distractors and compositional referring expressions, while MIMO-Bench targets a different question: whether MLLMs can perform downstream attribute reasoning and group-level counting when reference resolution must occur in substantially denser Multi-Instance Multi-Object scenes. We summarize these distinctions below.

**Positioning MIMO-Bench relative to Ref-Adv.**

| **Benchmark** | **Real/Syn.** | **Comp. REs** | **Primary Task** | **Scene Regime** | **Reference Role** | **Output** |
|---|---|---|---|---|---|---|
| Ref-Adv | ✓/✗ | ✓ | REC | Hard distractors | Final task | Box |
| MIMO-Bench | ✓/✓ | ✓ | AB + NC | Dense MIMO | Intermediate | Attribute / Count |

## Requested Change R4 [Strengthening] — Add controls for the diagnostic interventions

### Relevant-region extraction: localization quality and cropping controls.

**R4: Localization quality and cropping controls for relevant-region extraction.**

We thank the reviewer for suggesting that we directly evaluate the quality
of the proposed regions and compare them against a non-model-driven cropping
baseline. We have performed this additional analysis.

### Predicted-region statistics and localization quality.

Across all valid regions produced by the relevant-region extraction or manual zooming
runs, the mean predicted crop is approximately $459\times479$ pixels
($232{,}227$ px$^2$), corresponding to $12.43\%$ of the original image area.
We further compute the IoU of every proposed crop with the ground-truth
target box and condition final-answer accuracy on this localization quality.

### Comparison with a non-model-driven crop.

Our existing MIMO-Crop$_{512}$ condition provides the corresponding
externally supplied cropping baseline. In MIMO-Crop, the crop is constructed
around the annotated target independently of the evaluated MLLM, while
retaining the visual context required by the referring expression. Its
$512\times512$ spatial scale is also close to the mean size of the
model-proposed regions.

| **Model** | **Base** | **0--25** | **25--50** | **50--75** | **75--100** | **MIMO-Crop$_{512}$** |
|---|---:|---:|---:|---:|---:|---:|
| InternVL3-14B | 37.2 | 48.8 | 51.6 | 56.5 | 52.0 | 50.7 |
| InternVL3-8B | 35.9 | 35.4 | 44.9 | 51.5 | 51.0 | 46.8 |
| InternVL3.5-8B | 40.5 | 37.2 | 42.7 | 36.4 | 45.8 | 50.7 |
| Qwen3-VL-32B | 47.5 | 41.2 | 45.5 | 49.0 | 52.9 | 48.9 |
| Qwen3-VL-8B | 40.3 | 39.3 | 45.5 | 39.0 | 50.8 | 44.4 |
| Qwen2.5-VL-7B | 35.8 | 29.7 | 40.5 | 28.6 | 39.2 | 47.6 |
| **Mean** | **39.5** | **38.6** | **45.1** | **43.5** | **48.6** | **48.2** |

*Final-answer accuracy conditioned on the IoU of the predicted crop
with the ground-truth target box. MIMO-Crop$_{512}$ is an externally
constructed, non-model-driven relevant crop.*

Two observations follow. First, very poorly localized predicted crops
($0$--$25\%$ IoU) achieve $38.6\%$ mean accuracy, at or slightly below
the $39.5\%$ full-image baseline. These examples still receive the additional
inference call and crop/re-query operation, suggesting that an additional
call or rescaling alone is insufficient to explain the gain.

Second, highly overlapping model-selected crops ($75$--$100\%$ IoU) reach
$48.6\%$, closely matching the $48.2\%$ accuracy of MIMO-Crop$_{512}$.
Thus, when the model succeeds at selecting a target-relevant region, its
downstream performance approaches that obtained when a relevant crop is
externally provided.

The relationship is not strictly monotonic across intermediate IoUs, which
is expected because the useful region for a compositional referring
expression can extend beyond the target box itself and include referenced
neighboring objects. We therefore interpret IoU as a simple localization
quality proxy rather than a complete measure of crop usefulness.

### Two-pass no-crop control.

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

The second inference call alone yields only a +1.3 point mean improvement, and
no model gains more than +3.5 points. This provides
an explicit control for the additional inference step and supports the
interpretation that the relevant-region gains are associated with changing the
visual input to a useful target-relevant region, rather than merely querying
the model twice.

### Interpretation and scope.

We agree that the relevant-region experiment does not isolate localization,
rescaling, distractor reduction, and additional inference as independent
causal factors. Its purpose is instead a deliberately simple proof-of-concept
test of whether allowing the model to adaptively narrow the visual input
before answering can help in the MIMO setting.

We would like to clarify, however, that we do not present the current method
as a complete iterative visual-search system. The manuscript explicitly
introduces it as a "small exploratory study", calls it
*naive relevant-region extraction*, and describes the procedure as
"naive single-pass narrowing". Here, "dynamic visual access" refers only
to the fact that the second visual input is determined by the model's first
inference, in contrast to answering from a single fixed visual input.

The new analysis strengthens this proof-of-concept interpretation:
poorly localized regions perform approximately at the full-image baseline,
whereas highly overlapping regions approach the externally supplied
MIMO-Crop$_{512}$ condition. Thus, successful region selection is associated
with the observed benefit, while simply invoking the model a second time is
not sufficient.

Together with MIMO-Crop, these results suggest a promising future direction:
rather than operating only on a fixed full-resolution visual input, models
could be explicitly trained to predict useful regions and adapt visual
resolution/search-space during reasoning, potentially extending this
one-step proof of concept to learned multi-step visual access.

We will add the region-size statistics, IoU-conditioned analysis, and
MIMO-Crop$_{512}$ comparison to the revised manuscript, and clarify the
proof-of-concept scope of the experiment.

### Graying: controlling for the visual-highlighting effect.

<!-- Regarding the graying experiment, we agree that we cannot extract a clean causal claim. We would like to provide a clarification for the same. Whenever we discuss about distractor reduction, it would be given that there would be other image related factors that would chnage, and we would like to claim the changes are intentional. The only clean distractor reduction could be done through inpainting similar object category distractors, where we inpaint the masks of instances of similar object category. Any other way to reduce distractors lead to entanglement with other factors. Graying keeps the same number of visual tokens, and does bring a visual highlight to the target region. Zooming does reduce the resolution and provide higher relative sixze ot the target object. This does disqualify these experiments from providing clean causal isolation to characterise distractor effect. However they are useful in their own right as they show distractor reduction, through different channels can be helpful. For example, the zooming experiment shows that augmenting models to find a relevant region, with the aim to reduce distractor, which it does eventually can be helpful. Reducing distractor empirically means to put more focus on the objects that were affected by distracvtos. Human menchanism does this by shifting their foveal attention and thus elving the distractors in the periphery making them less focused or more blurred. So zooming helps putting in more focus on the target object by distractor and resolution reduction at once. GFraying does it by reducing distractors and highlighting the visual region by corrupting visual tokens corresponding to distractors. So even though they do not give a clean causal isolation -->

### Clarification on graying and visual highlighting.

We agree with the reviewer that graying changes more than the number of
visible distractors, and therefore should not be described as a clean causal
isolation of distractor count. We will revise the manuscript accordingly.

Our intended use of this experiment is to study one way of reducing the
effective influence of competing visual information in a natural image.
The image dimensions remain unchanged and, for a given model, the number of
visual tokens is unchanged before and after graying; what changes is the
visual information carried by tokens corresponding to regions outside the
retained window. This suppresses information from distractor-containing
regions while also increasing the relative salience of the retained region.

More broadly, different mechanisms for reducing distractor burden naturally
introduce different coupled changes. Cropping, for example, reduces
distractors by narrowing the visual search space and simultaneously changes
the relative scale of the target. These changes are therefore not necessarily
incidental confounds; in some cases they are part of how the effective
distractor burden is reduced.

At a high level, this is analogous to selective visual attention in humans:
task-relevant regions receive preferential processing while competing
peripheral information is de-emphasized, reducing its effective influence.
We use this only as a conceptual analogy and do not claim that the graying
operation itself models human vision.

We therefore do not attribute the observed performance change uniquely to
distractor count. Instead, we interpret the experiment as evidence that
reducing effective visual competition through spatial focusing can be useful
in the MIMO setting. A clean estimate of the causal effect of distractor
count itself would require a controlled setting in which distractor instances
are independently manipulated while other scene properties are held fixed.
We will make this distinction explicit in the revised manuscript.

### Alternative outside-region suppression: inpainting.

To test whether the graying result is specific to the use of a gray visual
mask, we additionally replace the outside-region content using inpainting.
Under the stronger suppression setting, mean accuracy across the six evaluated
models is **42.9%**, compared with **42.4%** under the corresponding
1024 / little-suppression setting, a difference of **+0.5 points**.

| Model | Strong inpainting | 1024 / little suppression | $\Delta$ |
|---|---:|---:|---:|
| Qwen2.5-VL-7B | 30.7 | 30.4 | +0.3 |
| Qwen3-VL-8B | 39.2 | 39.2 | 0.0 |
| InternVL3-8B | 40.8 | 39.7 | +1.1 |
| InternVL3.5-8B | 44.7 | 44.0 | +0.7 |
| InternVL3-14B | 54.5 | 52.7 | +1.8 |
| InternVL3.5-14B | 47.5 | 48.2 | -0.7 |
| **Mean** | **42.9** | **42.4** | **+0.5** |

The inpainting control therefore does not show a large independent gain from
outside-region suppression, but it also indicates that the behavior is not
specific to replacing the surrounding image with grayscale pixels. More
importantly, we do not interpret either graying or inpainting as a clean
causal manipulation of distractor count. Both modify the visual input in
additional ways. We therefore interpret these interventions, together with
cropping, as different operational forms of reducing the effective distractor
burden through spatial focusing, rather than as estimates of the isolated
causal effect of distractor count.

## Requested Change R5 [Strengthening] — Report uncertainty for the smaller analyses

### Confidence intervals for the main benchmark results.

We first report confidence intervals alongside all pooled scores for both
tasks: IACC and $G_{\mathrm{ACC}}$ for Attribute Binding, and IMRA, LMRA and
GMRA for Numerical Counting. Values in brackets denote 95% confidence
intervals.

| Model                      |        IACC (95% CI) | $G_{\mathrm{ACC}}$ (95% CI) |      IMRA (95% CI) |      LMRA (95% CI) |      GMRA (95% CI) |
| -------------------------- | -------------------: | --------------------------: | -----------------: | -----------------: | -----------------: |
| Gemini-3.5-Flash-Low       | 54.72 [51.51, 58.99] |        55.13 [51.85, 59.72] | 61.50 [56.7, 69.6] | 59.77 [58.9, 76.9] | 59.51 [52.4, 68.1] |
| Gemini-3.1-Pro-Preview-Low | 54.99 [51.23, 59.87] |        55.42 [51.07, 61.50] | 61.26 [60.7, 73.1] | 60.05 [54.9, 72.0] | 63.80 [54.9, 72.8] |
| Gemini-2.5-Flash           | 50.23 [47.28, 53.72] |        48.61 [44.86, 52.69] | 40.75 [38.1, 53.5] | 36.36 [31.1, 50.4] | 46.49 [39.7, 59.8] |
| Gemini-2.5-Pro             | 48.46 [46.14, 65.68] |        47.96 [44.77, 66.15] | 49.05 [48.2, 60.4] | 42.33 [32.5, 49.7] | 66.83 [56.2, 73.9] |
| GPT-5-minimal              |   30.66 [26.8, 35.2] |          28.82 [24.3, 33.3] | 44.05 [39.7, 49.1] | 43.31 [38.2, 47.9] | 43.20 [37.3, 52.4] |
| GPT-5-medium               |   51.79 [47.8, 56.2] |          51.62 [47.2, 56.3] | 49.00 [39.1, 53.0] | 47.38 [34.6, 51.5] | 55.20 [40.5, 59.7] |
| GLM-4.5V                   | 47.42 [35.04, 60.25] |        44.57 [32.14, 60.36] | 42.27 [39.6, 52.5] | 43.89 [40.7, 55.3] | 38.49 [28.5, 47.4] |
| InternVL3.5-241B-A28B      | 46.16 [43.04, 50.36] |        44.43 [40.91, 49.10] | 49.92 [41.3, 56.7] | 50.38 [46.7, 59.1] | 46.12 [38.2, 56.6] |
| InternVL3-78B              | 39.33 [36.24, 43.10] |        38.52 [35.19, 43.00] | 37.46 [29.1, 43.6] | 37.61 [25.5, 43.9] | 35.80 [23.3, 46.8] |
| Qwen3-VL-32B-Instruct      | 47.47 [44.78, 50.03] |        47.33 [44.31, 50.09] | 47.69 [45.6, 57.3] | 47.52 [45.2, 60.6] | 51.75 [39.8, 61.3] |
| Qwen3-VL-8B-Instruct       | 40.32 [37.48, 42.76] |        38.81 [35.50, 41.86] | 42.58 [39.7, 52.2] | 41.17 [38.3, 53.5] | 38.42 [22.6, 52.5] |
| Qwen3-VL-30B-A3B-Instruct  | 33.78 [27.97, 38.61] |        31.15 [25.74, 36.20] | 35.00 [32.6, 46.4] | 41.09 [33.9, 54.6] | 31.75 [22.5, 49.3] |
| Qwen2.5-VL-72B-Instruct    | 42.62 [34.85, 50.42] |        40.85 [32.62, 48.42] | 40.42 [36.6, 54.5] | 42.80 [37.9, 56.1] | 35.67 [30.8, 53.2] |
| Qwen2.5-VL-32B-Instruct    | 39.34 [35.57, 43.51] |        38.28 [34.35, 42.63] | 37.34 [33.3, 48.7] | 35.61 [30.8, 48.1] | 40.11 [32.1, 55.4] |
| Qwen2.5-VL-7B-Instruct     | 35.80 [32.01, 39.20] |        34.90 [31.38, 37.97] | 31.43 [27.3, 41.8] | 32.19 [27.1, 41.3] | 28.89 [20.3, 38.8] |
| InternVL3.5-38B            | 42.78 [36.89, 48.89] |        41.74 [36.89, 48.70] | 36.80 [33.9, 46.8] | 40.96 [32.5, 52.7] | 33.75 [31.9, 49.5] |
| InternVL3.5-14B            | 34.41 [31.50, 37.38] |        34.52 [31.39, 37.73] | 38.23 [35.7, 46.9] | 38.38 [31.0, 45.4] | 35.95 [34.0, 55.8] |
| InternVL3.5-8B             | 40.48 [37.03, 43.47] |        39.98 [36.44, 43.35] | 41.16 [36.0, 49.2] | 42.86 [33.1, 47.8] | 33.17 [33.0, 49.4] |
| InternVL3-38B              | 44.31 [37.38, 50.20] |        43.24 [36.40, 49.67] | 40.95 [38.9, 51.3] | 46.69 [38.7, 53.7] | 32.25 [25.2, 53.6] |
| InternVL3-14B              | 37.17 [34.53, 40.05] |        36.37 [33.66, 39.45] | 33.24 [26.5, 41.6] | 33.94 [26.7, 43.4] | 27.95 [20.0, 44.4] |
| InternVL3-8B               | 35.91 [33.24, 38.35] |        36.07 [33.09, 38.69] | 33.33 [30.4, 42.9] | 39.58 [30.2, 49.4] | 17.32 [14.2, 36.2] |
| GLM-4.1V-9B-Thinking       | 35.98 [32.91, 38.49] |        35.90 [32.73, 38.80] | 25.80 [19.7, 30.8] | 29.75 [18.2, 45.5] |  31.25 [0.0, 41.5] |

The NC intervals are systematically wider than the AB intervals, making the
greater uncertainty of the smaller counting split explicit.

### Uncertainty of the numerical-counting results.

We thank the reviewer for raising the question of statistical reliability,
particularly for Numerical Counting (NC), where the evaluation set is smaller
than for Attribute Binding. We therefore additionally report confidence
intervals for all pooled NC metrics: IMRA, LMRA, and GMRA. The values in
brackets denote the corresponding 95% confidence intervals.

The resulting intervals make the uncertainty in the counting analysis
explicit. For example, Gemini-3.5-Flash-Low obtains an IMRA of
61.50 [56.7, 69.6], LMRA of 59.77 [58.9, 76.9], and GMRA of
59.51 [52.4, 68.1]. Across models, the NC intervals are generally wider than
the corresponding AB intervals, as expected from the smaller number of NC
examples.

We will therefore report the NC point estimates together with their confidence
intervals in the revised manuscript, so that differences in IMRA, LMRA, and
GMRA can be interpreted together with the uncertainty arising from the
available counting data.

The Numerical Counting split contains **57 parent queries in total**,
comprising **18 parent queries from real images** and **39 parent queries from
synthetic images**. We will report these counts alongside the NC results so
that the amount of independent support underlying LMRA and GMRA is explicit.

### Uncertainty for the visual-prompting diagnostic.

Because visual prompting is evaluated on matched examples, we report the
paired change in IACC and its 95% confidence interval.

| Model                     | $\Delta$ IACC | 95% CI of $\Delta$ |
| ------------------------- | ------------: | -----------------: |
| Qwen3-VL-8B-Instruct      |     **+25.5** |     [19.84, 31.59] |
| GLM-4.5V                  |     **+18.5** |     [13.42, 23.96] |
| Qwen3-VL-32B-Instruct     |     **+18.0** |     [13.85, 22.12] |
| Qwen2.5-VL-32B-Instruct   |     **+22.5** |     [18.11, 26.98] |
| Qwen3-VL-30B-A3B-Instruct |     **+24.0** |     [16.20, 29.15] |
| InternVL3-38B             |     **+10.8** |      [6.95, 14.97] |
| InternVL3.5-38B           |     **+12.4** |      [8.04, 17.17] |
| InternVL3-14B             |     **+13.2** |      [9.81, 17.01] |
| InternVL3.5-14B           |     **+11.2** |      [7.09, 15.44] |
| InternVL3-8B              |      **+8.6** |      [5.29, 12.37] |
| InternVL3.5-8B            |      **+6.0** |       [3.87, 8.48] |

All paired 95% confidence intervals exclude zero, showing that the positive
visual-prompting differences are consistently observed under the sampling
procedure.

### Uncertainty for the reasoning-mode diagnostic (Table 4).

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

### Uncertainty for the Chain-of-Thought diagnostic (Figure 8).

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

## Requested Change R6 [Strengthening] — Investigate the large synthetic/real gap for Gemini-3.x

### Gemini-3.x synthetic--real gap.

We thank the reviewer for pointing out this anomaly. The synthetic images were generated using Gemini-2.5-Pro, and our existing self-preference analysis tests the generating model itself: on the synthetic split it obtains 47.7 AB $\mathcal{I}_{\mathrm{ACC}}$ against 49.7 for GPT-5-medium, 47.9 for Q3-32B-Instruct and 45.1 for IVL3.5-241B-A28B, so the generator is mid-pack on its own images rather than uniquely advantaged. The unusually large synthetic gain is instead specific to Gemini-3.x, while several other evaluated models show much smaller gains, no gain, or even better performance on real images.

We agree that the current experiments do not allow us to determine why Gemini-3.x performance is so strongly skewed toward the synthetic split. We therefore treat this result as an observed anomaly rather than attributing it to either genuine capability or a generator-specific effect. We will make this limitation explicit in the revised manuscript and clarify that the available self-preference control applies specifically to Gemini-2.5-Pro, the model used to generate the synthetic images.
