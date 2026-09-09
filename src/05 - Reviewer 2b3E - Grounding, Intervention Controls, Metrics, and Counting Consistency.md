# Reviewer 2b3E — Grounding, Intervention Controls, Metrics, and Counting Consistency

## Requested Change R1 — Revise or strengthen the decomposition of localization, recognition, and binding

### Localization, recognition, and Attribute Binding

We agree with the reviewer that our original statement that “the residual error is AB itself, not localization” was too strong. We have removed this statement and no longer treat visual prompting as a clean

localization--binding decomposition.

Following the reviewer's suggestion to add a predicted-localization evaluation,

we now explicitly evaluate whether the original RE can be grounded to its

ground-truth target. Because explicit localization itself requires choosing an

output interface, we report two complementary formulations on the full evaluation set

matched AB instances.

In *box-choice grounding*, the original RE is retained and four candidate

instances are visually marked; the model selects the intended candidate. This

provides a simple discrete grounding decision, but the boxes necessarily modify

the visual input. In *coordinate grounding*, the image is left unchanged

and the model predicts the target coordinates from the original RE. This avoids

marker overlays but introduces the additional requirement of producing a

precise spatial output.

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

*Explicit RE-grounding outcomes and their correspondence with Attribute Binding (AB) answers on matched examples. Cells report the percentage of the evaluation set falling in each outcome. $G^+$/$G^-$ denote correct/incorrect grounding and $A^+$/$A^-$ denote correct/incorrect AB answers. G-Acc. denotes grounding accuracy, and $\Delta=P(A^+|G^+)-P(A^+|G^-)$. All accuracies and conditional probabilities are percentages. Chance accuracy for box-choice grounding is 25%.*

The box-choice evaluation shows that RE grounding itself remains imperfect

(49.3--66.5%). More importantly, it lets us directly separate grounding

success from the AB outcome behaviorally. For every evaluated model,

P(A^+|G^+) is higher than P(A^+|G^-), with gains of 6.0--10.3 points.

However, even when the correct target is selected, AB accuracy remains only

41.6--61.9%. Thus, successful grounding improves AB performance but does not

solve the task.

We agree with the reviewer that the remaining G^+A^- cases should not all

be called binding failures. They can include fine-grained color, pattern,

material, or component recognition; small or occluded components; component

identification/localization; preprocessing or visual-token effects; as well as

genuine cross-instance attribute misbinding.

The coordinate results additionally make clear why a perfectly clean

grounding--binding decomposition is difficult to obtain behaviorally.

Coordinate localization, despite leaving the image unmodified, is much weaker

(9.8--26.5%) and shows a less uniform relationship with AB success. This does

not allow us to conclude simply that the model “cannot localize”: coordinate

prediction couples RE grounding with precise spatial-output generation. The

box-choice formulation avoids that requirement, but changes the image through

candidate overlays. Thus, the localization measurement itself depends

substantially on its elicitation format.

This format dependence motivated our original use of visual prompting rather

than inserting a separate localization prediction stage into the benchmark:

AB has a fixed task definition and answer format, whereas explicit localization

requires an additional design choice with its own confounds. We agree that the

original paper nevertheless over-interpreted visual prompting, and the revised

paper now makes this limitation explicit and reports both localization probes.

**Visual prompting is therefore reinterpreted as a ground-truth**


**
target-specification condition, not a binding-only condition.**

It replaces the original compositional RE with a visual marker on the annotated

target. The substantial IACC improvement shows that direct visual target

specification removes a substantial part of the difficulty associated with

RE-based target identification. However, because the marker itself modifies the

image and must be perceived and interpreted, we do not claim that visual

prompting constitutes perfect localization from the model's perspective, that

its gain is a pure localization-error estimate, or that its residual error is

pure AB/binding error.

The revised analysis therefore uses complementary evidence rather than clean

causal isolation: predicted-localization probes measure explicit RE grounding;

matched grounding--AB outcomes expose both grounding failures and

grounding-success/AB-failure cases; and visual prompting measures performance

when the target is externally specified.

Finally, the benchmark already contains the ground-truth localization associated

with each target and referring expression. We will release these target

mask/bounding-box coordinates with MIMO-Bench, allowing future work to evaluate

alternative localization interfaces and metrics directly.

---

## Requested Change R2 — Add proper controls for distractor reduction and relevant-region extraction

### Relevant-region extraction.

### Controls for relevant-region extraction

We agree that relevant-region extraction combines multiple changes, including

region selection, target rescaling, distractor reduction, and an additional

inference call. We therefore add a localization-quality analysis and compare

the model-selected crops against an externally constructed cropping control.

A non-model-driven cropping control is already included through

**MIMO-Crop**. In MIMO-Crop, a local window is constructed around the

ground-truth target using benchmark annotations, independently of the evaluated

MLLM, while retaining the objects required by the referring expression. Thus,

MIMO-Crop tests the benefit of externally providing a relevant local region,

whereas relevant-region extraction tests whether the model can itself identify

such a region before being re-queried.

Across **23,109 valid predicted crops**, the mean crop size is approximately

459\times479 pixels (232{,}227 px^2), corresponding to **12.43%**

of the original image area. This is close in spatial scale to our

512\times512 MIMO-Crop condition.

We additionally compute the IoU between each model-proposed crop and the

ground-truth target box and report final-answer accuracy conditioned on

predicted-region quality.

| **Model** | **Base** | **0--25** | **25--50** | **50--75** | **75--100** | **MIMO-Crop$_{512}$** |
|---|---:|---:|---:|---:|---:|---:|
| InternVL3-14B                                           | 37.2     | 48.8     | 51.6     | 56.5     | 52.0     | 50.7     |
| InternVL3-8B                                            | 35.9     | 35.4     | 44.9     | 51.5     | 51.0     | 46.8     |
| InternVL3.5-8B                                          | 40.5     | 37.2     | 42.7     | 36.4     | 45.8     | 50.7     |
| Qwen3-VL-32B                                            | 47.5     | 41.2     | 45.5     | 49.0     | 52.9     | 48.9     |
| Qwen3-VL-8B                                             | 40.3     | 39.3     | 45.5     | 39.0     | 50.8     | 44.4     |
| Qwen2.5-VL-7B                                           | 35.8     | 29.7     | 40.5     | 28.6     | 39.2     | 47.6     |
| **Mean**                                                | **39.5** | **38.6** | **45.1** | **43.5** | **48.6** | **48.2** |

*Final-answer accuracy conditioned on the IoU of the model-proposed crop with the ground-truth target box, compared with the full-image baseline and the externally constructed MIMO-Crop\_{512} condition.*

Very poorly localized predicted crops (0--25% IoU) obtain 38.6% mean

accuracy, at or slightly below the 39.5% full-image baseline, despite

still involving the additional inference call and crop/re-query operation.

In contrast, when the model proposes a region with 75--100% IoU, mean

accuracy rises to 48.6%, approximately matching the 48.2% obtained by

MIMO-Crop\_{512}.

The relationship is not strictly monotonic at intermediate IoUs because many

MIMO referring expressions require contextual objects outside the target box

itself. We therefore treat IoU as a proxy for localization quality rather

than a complete measure of crop usefulness.

These results do not isolate region selection, rescaling, distractor reduction,

and the additional model call as independent causal factors. Rather, they

support the more limited observation that when a model succeeds in proposing

a target-relevant region, its downstream performance approaches the

externally supplied cropping condition.

#### Fixed/random crop and two-pass controls

To further separate model-driven region selection from generic cropping,
rescaling, and the additional inference call, we evaluate fixed and random
512/1024 crops and a two-pass no-crop control on the same 200 examples across
six models. Fixed crops use the same centered window for every image, whereas
random crops place a reproducibly sampled window of the same size independently
of the model.

| Control | $\Delta$ vs. Base | Target visible | Target absent | Visibility $\Delta$ |
| --- | ---: | ---: | ---: | ---: |
| Fixed 1024 | +1.0 | 49.7 | 34.1 | **+15.6** |
| Random 1024 | +0.8 | 53.5 | 31.9 | **+21.6** |
| Fixed 512 | -5.3 | 58.3 | 33.2 | **+25.1** |
| Random 512 | -8.7 | 49.0 | 31.3 | **+17.7** |

At 1024 resolution, fixed and random cropping is essentially unchanged from
the full-image baseline, while the smaller 512 crops reduce accuracy because
they much more frequently remove the queried target. Conditioning on target
visibility makes the effect clearer: accuracy is higher when the target remains
visible in all four crop conditions, with pooled differences of 15.6--25.1
points; the direction is positive for all 24 model-by-condition comparisons.
When the target is absent, accuracy falls to approximately 31--34%, close to
the benchmark majority-answer baseline.

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

The two-pass no-crop control therefore yields only a small mean improvement of
$+1.3$ points, and no model gains more than $+3.5$. Together
with the MIMO-Crop and predicted-region IoU analyses above, these controls
indicate that generic cropping/rescaling or simply querying the model twice
does not explain the relevant-region gains. The benefit is associated with
successfully retaining target-relevant visual information, rather than with
cropping or an additional inference call alone.

### Distractor reduction.

### Scope of the distractor-reduction interventions

We agree that the current natural-image interventions should not be

presented as clean causal isolation of distractor count, and we will revise

the corresponding claims.

Our intention is instead to study whether reducing the effective influence

of competing same-category instances is beneficial, while recognizing that

there are multiple ways to achieve such reduction and that each mechanism

can necessarily modify other properties of the input.

In the graying experiment, the image dimensions and, for a given model, the

number of visual tokens remain unchanged, while the visual information in

regions outside the retained window is suppressed. This reduces the

effective contribution of distractor-containing regions and simultaneously

increases the relative salience of the retained region. In relevant-region

extraction, distractor reduction is achieved differently: the model narrows

the visual search space through cropping, which removes peripheral candidate

objects while also changing the relative scale and resolution of the

retained target. These coupled changes are partly constitutive of how the

respective interventions reduce effective distractor burden, rather than

being solely unintended artifacts.

This broader principle also has a natural analogy to selective visual

attention in humans. During visual search, relevant regions are prioritized

while competing peripheral information receives less processing, thereby

reducing its effective interference with the task. We do not claim that

graying or cropping reproduces this biological mechanism; rather, these

interventions provide simple external ways of realizing the same broad

computational principle of prioritizing task-relevant visual information

while suppressing competing input.

We therefore narrow our claim from a causal effect of distractor count alone

to the empirical observation that different forms of spatial focusing that

reduce effective distractor burden can improve MIMO performance. A clean

causal study of distractor count would require a separately controlled

setting in which distractor instances can be independently added or removed

while target appearance, scale, position, background, and other scene

properties remain fixed.

Accordingly, the revised manuscript will avoid describing the graying or

relevant-region experiments as clean causal isolation. The additional

relevant-region controls reported above separately characterize when

model-driven narrowing is beneficial.

We additionally test an alternative form of outside-region suppression using

inpainting, which replaces the surrounding image content rather than masking it

with grayscale pixels. This control tests whether the observed effect is

specific to grayscale masking.

| Model | Strong inpainting | 1024 / little suppression | $\Delta$ |
| --- | ---: | ---: | ---: |
| Qwen2.5-VL-7B | 30.7 | 30.4 | +0.3 |
| Qwen3-VL-8B | 39.2 | 39.2 | 0.0 |
| InternVL3-8B | 40.8 | 39.7 | +1.1 |
| InternVL3.5-8B | 44.7 | 44.0 | +0.7 |
| InternVL3-14B | 54.5 | 52.7 | +1.8 |
| InternVL3.5-14B | 47.5 | 48.2 | -0.7 |
| **Mean** | **42.9** | **42.4** | **+0.5** |

Mean accuracy under strong inpainting is **42.9%**, compared with **42.4%**
under the corresponding 1024 / little-suppression setting, a difference of only
**+0.5 points**. The control therefore does not reveal a large independent gain
from outside-region suppression, but it does show that the behavior is not
specific to replacing the surrounding image with grayscale pixels. Because inpainting
also changes the visual input in its own way, we continue to interpret this
result as evidence that suppressing competing outside-region information can
help, rather than as a clean causal estimate of distractor count alone. We do
not treat either graying or inpainting as a clean causal manipulation of
distractor count, since both modify the visual input in additional ways.

## Requested Change R3 — Correct the interpretation of $G_{\mathrm{ACC}}$ and add strict group exact match

### Clarification of Group Accuracy (G\_{\mathrm{ACC}})

We thank the reviewer for raising this point. We would like to clarify that

G\_{\mathrm{ACC}} was not intended to be an all-or-nothing criterion.

As explicitly defined in Eq. (1), for each target instance we first compute

the fraction of its valid attribute questions answered correctly, and then

average this quantity equally across target instances. Thus, an instance for

which four out of five attributes are answered correctly contributes 0.8,

not 0.

Our use of the term “jointly” was intended to indicate that the valid

attributes associated with the same target instance are evaluated together

as a group, rather than pooling all attribute questions independently across

the benchmark. This group-wise averaging also ensures that every target

instance receives equal weight regardless of the number of valid attributes

associated with it; consequently, an error has a larger effect on the score

of an instance characterized by fewer attributes.

We agree that the word “jointly” may be read as implying an

all-attributes-correct criterion, although this is not what Eq. (1) computes.

We will revise this wording in the manuscript to make the intended

interpretation explicit. The metric definition and reported results remain

unchanged.

### Group Accuracy and strict group exact match

We thank the reviewer for suggesting an all-attributes-correct complement to

G\_{\mathrm{ACC}}. As clarified above, the existing G\_{\mathrm{ACC}} is

not an all-or-nothing metric: it first computes the fraction of valid

attributes answered correctly for each target instance and then averages

equally across instances.

To additionally capture the stricter criterion suggested by the reviewer, we

now report **Exact Group Accuracy**, under which a target instance is counted

as correct only when **all of its valid attribute questions are answered**


**
correctly**.

| **Model** | **Exact Group Accuracy** |
|---|---:|
| Gemini-2.5-Flash             | 33.33% |
| Qwen3-VL-8B-Thinking         | 15.83% |
| InternVL3.5-241B-A28B        | 11.75% |
| Qwen3-VL-32B-Thinking        | 9.78%  |
| Gemini-2.5-Pro               | 9.39%  |
| Qwen2.5-VL-72B-Instruct      | 6.94%  |
| Qwen3-VL-32B-Instruct        | 6.14%  |
| InternVL3-78B                | 5.43%  |
| GLM-4.1V-9B-Thinking         | 5.42%  |
| InternVL3-38B                | 5.17%  |
| Qwen2.5-VL-32B-Instruct      | 4.60%  |
| InternVL3.5-8B               | 3.92%  |
| InternVL3.5-38B              | 3.61%  |
| InternVL3-8B                 | 3.55%  |
| InternVL3-14B                | 3.41%  |
| Qwen3-VL-8B-Instruct         | 3.13%  |
| Qwen3-VL-30B-A3B-Thinking    | 2.70%  |
| Qwen2.5-VL-7B-Instruct       | 2.34%  |
| Qwen3-VL-30B-A3B-Instruct    | 2.08%  |
| InternVL3.5-14B              | 1.71%  |
| GLM-4.5V                     | 1.15%  |

The strict metric is substantially lower than G\_{\mathrm{ACC}}, as expected:

under Exact Group Accuracy, a single incorrect attribute makes the entire

target group incorrect. We therefore view the two metrics as complementary.

G\_{\mathrm{ACC}} measures the fraction of each target's attributes answered

correctly while giving every target equal weight, whereas Exact Group Accuracy

measures complete all-attribute success.

## Requested Change R4 — Evaluate hierarchical counting consistency

### Hierarchical counting consistency

We thank the reviewer for suggesting this analysis. Our numerical-counting

questions are organized hierarchically: for each parent query, the

ground-truth parent count equals the sum of the counts of its localized

child queries. We therefore evaluate whether model predictions preserve

this same hierarchy.

For each parent--children group g, we define the consistency error as

[

e*g =*

- \hat{y}^{(g)}\*{\mathrm{parent}}

* \sum\_{c \in \mathcal{C}(g)}
   \hat{y}^{(g)}\_c .
   ]

We report *Exact Consistency*, the percentage of groups for which

e\_g=0; mean absolute error (MAE), \frac{1}{G}\sum\_g |e\_g|; and

*Signed Bias*, \frac{1}{G}\sum\_g e\_g. Negative bias indicates

that the parent prediction is smaller than the sum of its child

predictions, while positive bias indicates the converse. We evaluate only

groups for which the parent and all child predictions are available and

parseable; the maximum number of such groups is 53.

| **Model** | **Groups** | **Exact Cons. (%)** | **MAE** | **Bias** |
|---|---:|---:|---:|---:|
| IVL3.5-241B-A28B                           | 33 | 72.7 | 1.00 | -1.00 |
| Q3-32B-Thinking                            | 20 | 50.0 | 0.75 | -0.35 |
| G3.1-Pro-Preview-Low                       | 53 | 45.3 | 1.55 | -0.19 |
| G3.5-Flash-Low                             | 53 | 45.3 | 1.34 | -0.36 |
| G3.5-Flash-High                            | 53 | 43.4 | 1.58 | -1.02 |
| Q3-8B-Thinking                             | 7  | 42.9 | 0.86 | -0.86 |
| GLM-4.1V-9B-Thinking                       | 8  | 25.0 | 2.00 | -0.75 |
| Q2.5-72B                                   | 53 | 22.6 | 3.42 | -1.57 |
| IVL3-78B                                   | 53 | 20.8 | 3.62 | -3.36 |
| GPT-5-medium                               | 52 | 19.2 | 2.37 | -0.90 |
| GLM-4.5V                                   | 53 | 18.9 | 3.17 | -1.70 |
| Q3-32B-Instruct                            | 53 | 18.9 | 2.87 | -2.34 |
| G2.5-Pro                                   | 53 | 17.0 | 2.74 | -1.45 |
| Q3-30B-A3B-Instruct                        | 53 | 17.0 | 4.04 | -3.55 |
| G3.1-Pro-Preview-High                      | 33 | 15.2 | 1.55 | -0.39 |
| Q2.5-32B                                   | 53 | 11.3 | 3.53 | -2.70 |
| Q2.5-7B                                    | 53 | 11.3 | 3.68 | -2.81 |
| Q3-8B-Instruct                             | 53 | 11.3 | 3.45 | -2.96 |
| G2.5-Flash                                 | 49 | 10.2 | 4.84 | -2.76 |
| IVL3-8B                                    | 41 | 9.8  | 6.20 | -6.20 |
| IVL3-14B                                   | 33 | 9.1  | 5.55 | -4.15 |
| IVL3-38B                                   | 52 | 7.7  | 3.71 | -3.25 |
| IVL3.5-38B                                 | 53 | 7.5  | 4.42 | -4.00 |
| IVL3.5-14B                                 | 53 | 3.8  | 4.72 | -4.42 |
| IVL3.5-8B                                  | 53 | 3.8  | 3.98 | -3.79 |

*Hierarchical consistency of numerical-counting predictions. Exact Cons. is the percentage of parent--children groups for which the predicted parent count equals the sum of the predicted child counts. MAE is the mean absolute parent--child-sum difference, and Bias is the mean signed difference (parent - child sum). These metrics measure internal consistency, not correctness against ground truth.*

The results show that hierarchical consistency varies substantially across

models. IVL3.5-241B-A28B is the most internally consistent, with 72.7% of

eligible parent--children groups satisfying the hierarchy exactly, followed

by Q3-32B-Thinking at 50.0%. In contrast, most models are exactly

consistent on fewer than one-fifth of their evaluated groups. The MAE

similarly varies considerably, from below one count for Q3-32B-Thinking

to more than four counts for several InternVL variants.

The signed bias is negative for all evaluated models. Thus, when global

and localized predictions disagree, the model generally predicts fewer

objects in the parent query than are obtained by summing its own localized

child predictions. This complements our GMRA--LMRA analysis: the latter

compares accuracy of global and localized counting against ground truth,

whereas this experiment directly tests whether the model's global and

localized predictions are mutually consistent.

Importantly, hierarchical consistency does not imply correctness. For

example, a parent prediction of 5 and child predictions of 2 and 3

are exactly consistent even if the ground-truth parent count is 10.

Hence, we report this analysis as a measure of internal consistency

alongside GMRA and LMRA, rather than as an additional accuracy metric.

---

## Requested Change R5 — Add uncertainty estimates

### Uncertainty estimates for the main benchmark results.

Following the reviewer's suggestion, we additionally quantify uncertainty for
the main Attribute Binding (AB) and Numerical Counting (NC) results. We now
report confidence intervals alongside all pooled scores: IACC and
$G_{\mathrm{ACC}}$ for AB, and IMRA, LMRA, and GMRA for NC. The values in
brackets denote the corresponding 95% confidence intervals.

For example, Gemini-3.5-Flash-Low obtains an AB IACC of
54.72 [51.51, 58.99] and $G_{\mathrm{ACC}}$ of
55.13 [51.85, 59.72], while its NC IMRA, LMRA, and GMRA are
61.50 [56.7, 69.6], 59.77 [58.9, 76.9], and
59.51 [52.4, 68.1], respectively.

The pooled intervals for all evaluated models are reported below.

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

More generally, the NC intervals are often wider than those for AB, making
explicit the greater uncertainty associated with the smaller numerical-counting
evaluation set. We will include these intervals with the corresponding pooled
results in the revised manuscript rather than presenting the point estimates
alone.

### Clustered bootstrap intervals and paired significance analyses

We agree that question-level resampling is not the appropriate unit for MIMO-Bench,
since questions sharing an image, a target object, or a parent count query are not
independent. We have therefore recomputed our comparisons using clustering at the
levels the reviewer identifies.

Confidence intervals use a nonparametric percentile bootstrap with **20,000
replicates**, resampled at the following units:

| **Task** | **Metric** | **Resampling unit** |
|---|---|---|
| Attribute Binding | $\mathcal{I}_{\mathrm{ACC}}$ | image cluster (question outcomes paired within image) |
| Attribute Binding | $G_{\mathrm{ACC}}$ | object group, aggregating questions within (image, object, referring expression) |
| Numerical Counting | global vs.\ localized MRA | parent group, held together within its image cluster |

Paired significance uses two-sided sign-flip randomization tests, with condition
labels exchanged jointly within the corresponding image, object, or parent-group
unit, and Benjamini--Hochberg FDR correction applied separately within each family
of model comparisons.

**Visual prompting.** The effect survives clustering and multiple-comparison
correction for every evaluated model. All **13** models with consolidated
per-question outputs show a positive image-clustered $\mathcal{I}_{\mathrm{ACC}}$
effect after FDR correction ($q \leq 0.0312$), and all **14** models with
object-group outputs show a positive $G_{\mathrm{ACC}}$ effect
($q \leq 0.0202$).

**Global versus localized counting.** This comparison is substantially weaker under
parent-group clustering than the aggregate metrics suggest. Only
**Qwen3-VL-8B-Thinking** remains significant after correction
($\Delta_{G-L} = -24.6$, 95% CI $[-39.9, -12.8]$, paired $p = 0.0020$,
FDR $q = 0.0488$); no other model reaches $q < 0.05$. We will report this
explicitly rather than presenting the global--local gap as a general finding, and
will describe it as a tendency observed at the aggregate level whose per-model
evidence is established for a single model under paired testing.

**Uncertainty for the human baseline.** The human baseline was measured with
seven participants who did not annotate MIMO-Bench, each solving 30 groups for
Attribute Binding and 20 groups for Numerical Counting. Because participants
answer whole groups, we resample groups rather than individual questions when
constructing intervals. The resulting 95% confidence intervals for all reported
human scores are:

| **Metric** | **Human** | **95% CI** |
|---|---:|---:|
| Real $\mathcal{I}_{\mathrm{ACC}}$ | 89.3 | [81.7, 93.2] |
| Real $G_{\mathrm{ACC}}$ | 86.7 | [83.2, 89.8] |
| Syn. $\mathcal{I}_{\mathrm{ACC}}$ | 85.7 | [77.1, 89.6] |
| Syn. $G_{\mathrm{ACC}}$ | 87.5 | [84.9, 90.1] |
| Real $\mathcal{I}_{\mathrm{MRA}}$ | 87.7 | [85.1, 88.2] |
| Real $\mathcal{L}_{\mathrm{MRA}}$ | 86.4 | [83.2, 88.5] |
| Real $\mathcal{G}_{\mathrm{MRA}}$ | 90.1 | [87.9, 92.6] |
| Syn. $\mathcal{I}_{\mathrm{MRA}}$ | 89.6 | [86.9, 91.9] |
| Syn. $\mathcal{L}_{\mathrm{MRA}}$ | 87.4 | [85.7, 90.2] |
| Syn. $\mathcal{G}_{\mathrm{MRA}}$ | 92.0 | [90.1, 94.4] |

Within Attribute Binding, the intervals are wider for
$\mathcal{I}_{\mathrm{ACC}}$ than for $G_{\mathrm{ACC}}$, reflecting the
smaller number of independent groups underlying the instance-level scores. The
counting intervals are comparatively narrow because MRA is a bounded continuous
score rather than a binary outcome, so its group-level variance is lower even
though the counting split contains fewer groups.

Importantly, the human--model gap is not sensitive to this uncertainty. The
lowest human lower bound across all ten metrics is 77.1
(synthetic $\mathcal{I}_{\mathrm{ACC}}$), which remains far above the
strongest model result on the corresponding split. The reported gap therefore
does not depend on the precision of the human point estimates.

## Requested Change R6 — Strengthen the synthetic-data analysis

### Synthetic-data analysis

We would be grateful for clarification on this request, so that we address the
intended concern rather than a different one.

The submission currently reports the following analyses concerning the synthetic
split:

- a **self-preference control**, comparing the generating model against
  contemporaneous non-Gemini models on the synthetic split (G2.5-Pro obtains
  47.7 synthetic AB $\mathcal{I}_{\mathrm{ACC}}$, against 49.7 for GPT-5-medium,
  47.9 for Q3-32B-Instruct and 45.1 for IVL3.5-241B-A28B), showing that the
  generator is not uniquely advantaged on its own images;
- a **generator-selection comparison** against Grok-4 and Flux, motivating the
  choice of G2.5-Pro on grounds of scene coherence and prompt adherence; and
- **per-split reporting** of every metric for real and synthetic images
  throughout the main results, together with an explicit discussion of the
  anomalous Gemini-3.x synthetic gain.

We are happy to extend this analysis in whichever direction the reviewer
considers most useful --- for example, a broader self-preference comparison, a
systematic characterisation of the real--synthetic gap across all evaluated
models, or additional validation of synthetic-image quality. Could the reviewer
indicate which aspect of the synthetic-data analysis they would like
strengthened?
