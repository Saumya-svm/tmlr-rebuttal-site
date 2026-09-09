# Reviewer MJZs — Benchmark Positioning, Grounding, Controls, and Dataset Statistics

## Requested Change R1 — Strengthen the related-work discussion and benchmark positioning

### Relation to referring-expression and grounding tasks.

We thank the reviewer for highlighting this missing connection. We have expanded the related-work discussion to cover Referring Expression Comprehension (REC), phrase grounding, referring segmentation, Described Object Detection (DOD), and Referring Expression Instance Retrieval (REIR). We agree that fine-grained referring expressions, relational descriptions, and disambiguation among visually similar candidates are not unique to MIMO-Bench.

The distinction lies primarily in *what is evaluated*. REC evaluates localization of a referred instance; phrase grounding evaluates phrase–region correspondence; referring segmentation predicts the referred region at pixel level; DOD predicts all objects satisfying a description, including zero- and multi-instance cases; and REIR extends referring expressions to retrieval and localization across an image gallery. MIMO-Bench instead evaluates two visual-reasoning tasks---attribute binding and numerical counting---under the MIMO setting. In attribute binding, a referring expression specifies the instance about which a separate attribute is queried. In numerical counting, it specifies the group whose cardinality must be estimated. Thus, referring expressions are part of the problem formulation, while localization, segmentation, detection, or retrieval are not the benchmark outputs. MIMO-Bench further treats dense repeated-instance structure across object categories as the scene regime in which these reasoning tasks are evaluated. This positioning is summarized below.

**Positioning MIMO-Bench relative to referring-expression and grounding tasks.**

| **Task** | **Loc.** | **Multi-target** | **MIMO** | **AB** | **NC** |
|---|---|---|---|---|---|
| REC | ✓ | × | × | × | × |
| Phrase Grounding | ✓ | ✓ | × | × | × |
| Ref. Segmentation | ✓ | × | × | × | × |
| DOD | ✓ | ✓ | × | × | × |
| REIR | ✓ | × | × | × | × |
| **MIMO-Bench** | × | ✓ | ✓ | ✓ | ✓ |

**Positioning MIMO-Bench.** Distractor count reports the mean number of SAM3-based distractor instances per target prompt.

| **Lineage** | **Benchmark(s)** | **Real/Syn** | **Template** | **Comp. REs** | **Image Res.** | **Distractor** | **Mean Distractors** |
|---|---|---|---|---|---|---|---:|
| Compositional | CLEVR | ×/✓ | ✓ | ✓ | ×/✓ | × | -- |
|  | GQA | ✓/× | ✓ | ✓ | ×/✓ | × | 1.67 |
| Vision-centric (general) | MMStar, NaturalBench, VQAv2 | ✓/× | × | × | ×/✓ | × | 2.49 / -- / 1.46 |
| Visual difficulty | V\*Bench | ✓/× | × | × | ✓/× | ~ | 0.12 |
|  | HR-Bench, MME-RealWorld | ✓/× | × | × | ✓/× | ~ | 2.01 / 6.54 |
| **Ours** | **MIMO-Bench** | ✓/✓ | ✓ | ✓ | ✓/✓ | ✓ | **47.7** |

## Requested Change R2 — Provide stronger evidence for the limitations of existing benchmarks

We thank the reviewer for asking for direct quantitative evidence rather than an
illustrative comparison. We compare MIMO-Bench against existing benchmarks along
two measurable axes: same-category distractor density, and the compositional
structure of the referring expressions.

**Same-category distractor density.** The positioning table above reports the
mean number of SAM3-based distractor instances per target prompt. MIMO-Bench
averages **47.7** same-category distractors per target, against **0.12--6.54**
for every other benchmark considered. Dense same-category structure is therefore
not simply more frequent in MIMO-Bench; it is present at a different order of
magnitude.

**Compositional structure of referring expressions.** We parse each referring
expression with the same benchmark-agnostic schema used for MIMO-Bench and
decompose it into attribute/action bindings (CAO), inter-object relations, and
plain objects; the number of visual subtasks is their sum.

| **Benchmark** | **Objects** | **CAO** | **Relations** | **\# Subtasks** |
|---|---:|---:|---:|---:|
| CLEVR | 2.50 | 3.50 | 1.20 | 7.20 |
| GQA | 2.24 | 0.42 | 0.43 | 3.10 |
| MMStar | 3.36 | 0.08 | 0.46 | 3.90 |
| NaturalBench | 1.87 | 0.53 | 0.30 | 2.70 |
| VQAv2 | 1.76 | 0.35 | 0.49 | 2.60 |
| V\*Bench | 1.92 | 0.07 | 0.40 | 2.40 |
| HR-Bench | 2.92 | 0.44 | 1.34 | 4.70 |
| MME-RealWorld | 2.70 | 0.25 | 0.95 | 3.90 |
| **MIMO-Bench** | **4.01** | **2.33** | **3.23** | **9.56** |

*Mean per-expression decomposition under a common parsing schema. Totals
correspond to the mean subtask counts reported in Table 1 of the main paper.*

The decomposition localizes where the difference lies. MIMO-Bench references the
largest number of objects per expression (4.01 against 3.36 for the next
highest), but object count alone is not what separates it: several benchmarks
reach comparable values. Attribute/action binding is also not unique to
MIMO-Bench, and indeed CLEVR is higher on this axis (3.50 against 2.33),
reflecting its synthetic, attribute-exhaustive construction.

The axis on which MIMO-Bench separates decisively is **cross-object relational
structure**. MIMO-Bench expressions contain **3.23** inter-object relations on
average, against a maximum of **1.34** across all other benchmarks, a factor of
$2.4\times$ over the next highest and more than $2.7\times$ the mean of the
remaining benchmarks. This is precisely the property the reviewer identifies:
resolving a MIMO-Bench referring expression requires reasoning over relations
*between* multiple objects rather than recognizing attributes of a single
referent in isolation.

Taken together, the two axes support the motivation the reviewer asked us to
substantiate. Existing benchmarks are not merely lower on a single difficulty
scale; they occupy a different regime, with roughly an order of magnitude fewer
same-category distractors and a fraction of the cross-object relational
composition. This also clarifies the distinction from REC-style evaluation
raised in R1: the additional difficulty in MIMO-Bench comes from relational
disambiguation among dense same-category instances, not from expression length
alone.

## Requested Change R3 — Distinguish grounding failures from attribute-binding failures more clearly

### Separating grounding from Attribute Binding.

We agree with the reviewer that the original submission relied too strongly on final AB accuracy and visual prompting to distinguish failures in RE grounding from failures after the target has been identified. In the revision, we add an explicit grounding evaluation on the same examples and directly relate grounding success to the corresponding AB answer.

**Two explicit grounding formulations.**

A practical difficulty is that, unlike AB---which has a fixed multiple-choice output in MIMO-Bench---localization has no unique evaluation interface that is neutral with respect to the original task. We therefore evaluate two complementary formulations over the full evaluation set.

In the first, *box-choice grounding*, four candidate instances are marked and the model selects the candidate described by the original RE. This gives a well-defined discrete localization decision, but the candidate boxes modify the visual input. In the second, *coordinate grounding*, the original image is left unchanged and the model predicts the target coordinates from the RE. This avoids visual overlays, but additionally requires spatial-coordinate generation.

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

*Explicit RE-grounding outcomes and their correspondence with Attribute Binding (AB) answers on matched examples. Cells report the percentage of the evaluation set falling in each outcome. $G^+$/$G^-$ denote correct/incorrect grounding and $A^+$/$A^-$ correct/incorrect AB answers. G-Acc. denotes grounding accuracy and $\Delta=P(A^+|G^+)-P(A^+|G^-)$. All accuracies and conditional probabilities are percentages. Chance accuracy for box-choice grounding is 25%.*

The candidate-based evaluation gives a consistent result across models. Grounding accuracy is only 49.3--66.5%, showing directly that resolving the compositional RE to the intended target is itself challenging. Moreover, $P(A^+|G^+)$ exceeds $P(A^+|G^-)$ for every model, by 6.0--10.3 percentage points. Thus, examples on which the model successfully grounds the RE are systematically more likely to receive a correct AB answer.

At the same time, this analysis directly exposes the second failure regime requested by the reviewer. Even conditional on correct grounding, AB accuracy is only 41.6--61.9%; therefore a large fraction of examples are $G^+A^-$---the intended target is selected correctly, but the queried attribute is still answered incorrectly. We do not equate all $G^+A^-$ cases with pure "binding" failures, since downstream errors may also reflect fine-grained recognition or component-level reasoning.

Importantly, the coordinate evaluation cautions against interpreting any single localization output format as a clean intermediate variable. Coordinate grounding is substantially lower (9.8--26.5%) and its relationship with AB success is weaker and less uniform. This formulation preserves the original image but adds the burden of precise coordinate generation; conversely, box-choice grounding removes coordinate-generation difficulty but adds candidate overlays to the image. The disparity between the two therefore prevents us from claiming a format-independent numerical estimate of "localization accuracy."

This was the main reason we had not originally inserted localization as an explicit intermediate task: AB has a naturally defined answer format, whereas a localization readout necessarily requires choosing an additional interface. The new experiments make this ambiguity explicit rather than hiding it, and provide two complementary views of grounding.

**What can we conclude about the dominant bottleneck?**

The revised evidence does not support assigning one universally dominant stage. Candidate grounding itself remains substantially imperfect, and successful grounding consistently improves the probability of a correct AB answer. However, substantial AB errors remain among correctly grounded examples. Furthermore, the absolute grounding accuracy depends strongly on the localization interface. We therefore conclude that both RE-based target identification and downstream target-conditioned visual reasoning contribute to MIMO difficulty, rather than assigning a precise fraction of errors to either stage.

**Visual prompting.**

We accordingly revise visual prompting from a decomposition mechanism to a target-specification intervention. The original textual RE is replaced by a ground-truth visual cue on the target. The substantial IACC improvement under this condition remains informative: directly supplying the target makes the AB task considerably easier, providing complementary evidence that RE-based target identification is an important source of difficulty. However, the visual cue changes the input and itself has to be perceived and interpreted. We therefore no longer treat the standard--visual-prompting difference as a pure measure of grounding difficulty, nor the residual error as pure attribute binding.

Finally, every RE in MIMO-Bench is associated with its annotated ground-truth target localization. We will release the corresponding target mask/bounding-box coordinates with the dataset so that future work can evaluate other grounding interfaces and localization metrics directly.

## Requested Change R4 — Strengthen controls for the diagnostic experiments or weaken the corresponding claims

### Relevant-region extraction.

#### Controls and interpretation of relevant-region extraction.

We thank the reviewer for raising this point. We agree that the original presentation did not make the relationship between our relevant-region extraction experiment and the existing cropping control sufficiently explicit, and we have performed an additional localization-quality analysis.

#### Comparison with ordinary cropping.

A non-model-driven cropping control is already included in our evaluation through **MIMO-Crop**. In MIMO-Crop, a local window is constructed around the ground-truth target using the benchmark annotations, independently of the evaluated MLLM, while retaining the objects required by the referring expression. Thus, MIMO-Crop tests the benefit of being externally provided a relevant local region, whereas relevant-region extraction tests whether the MLLM can *itself* identify such a useful region from the full image and question before being re-queried.

To make this comparison more direct, we analyzed all valid regions produced during relevant-region extraction. Across 23,109 predicted crops, the mean crop size is approximately $459\times479$ pixels ($232{,}227$ px$^2$), corresponding to $12.43\%$ of the original image area. This is close in spatial scale to our $512\times512$ MIMO-Crop condition, making MIMO-Crop$_{512}$ a natural non-model-driven local-cropping comparison.

#### Quality of the model-proposed regions.

We additionally compute the IoU between each model-proposed crop and the ground-truth target box, and report final-answer accuracy conditioned on crop quality. We restrict the comparison below to InternVL models up to 14B and Qwen models up to 32B for which both analyses are available.

| **Model** | **Base** | **0--25** | **25--50** | **50--75** | **75--100** | **MIMO-Crop$_{512}$** |
|---|---:|---:|---:|---:|---:|---:|
| InternVL3-14B | 37.2 | 48.8 | 51.6 | 56.5 | 52.0 | 50.7 |
| InternVL3-8B | 35.9 | 35.4 | 44.9 | 51.5 | 51.0 | 46.8 |
| InternVL3.5-8B | 40.5 | 37.2 | 42.7 | 36.4 | 45.8 | 50.7 |
| Qwen3-VL-32B | 47.5 | 41.2 | 45.5 | 49.0 | 52.9 | 48.9 |
| Qwen3-VL-8B | 40.3 | 39.3 | 45.5 | 39.0 | 50.8 | 44.4 |
| Qwen2.5-VL-7B | 35.8 | 29.7 | 40.5 | 28.6 | 39.2 | 47.6 |
| **Mean** | **39.5** | **38.6** | **45.1** | **43.5** | **48.6** | **48.2** |

*Final-answer accuracy conditioned on the IoU of the model-proposed crop with the ground-truth target box, compared with the full-image baseline and the externally constructed MIMO-Crop$_{512}$ condition.*

The resulting pattern is informative. Very poorly localized predicted crops ($0$--$25\%$ IoU) obtain $38.6\%$ mean accuracy, at or slightly below the $39.5\%$ full-image baseline, despite still involving the additional inference call and crop/re-query operation. In contrast, when the model proposes a region with $75$--$100\%$ IoU, mean accuracy rises to $48.6\%$, approximately matching the $48.2\%$ obtained by MIMO-Crop$_{512}$.

The relationship is not strictly monotonic at intermediate IoUs, which is expected because many MIMO referring expressions require contextual objects outside the target box itself. Nevertheless, the endpoints are informative: poorly localized crops largely remove the benefit, whereas well-localized model-selected regions recover approximately the performance obtained when a relevant crop is externally supplied.

#### Comparison with fixed and random crops, and a two-pass control.

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

#### Scope of the dynamic visual-access claim.

We would also like to clarify that we do not present the proposed procedure as a complete iterative visual-search system. In the manuscript, we explicitly introduce it as a "small exploratory study", call the method *naive relevant-region extraction*, and describe it as "naive single-pass narrowing". The purpose of this experiment is precisely to test, at a proof-of-concept level, whether departing from a single static visual input can benefit MIMO reasoning.

Our use of "dynamic visual access" refers to this distinction: the visual input used for the final answer is adaptively determined by the model's first inference. The model first observes the full scene, predicts the region it considers sufficient for answering the question, and is then re-queried on that region. We agree that this one-step procedure is not itself a multi-step iterative visual-search mechanism; rather, our claim is that the success of even this deliberately naive one-step intervention provides evidence that adaptive visual re-access is a promising direction.

This is also how the experiment is motivated in the manuscript. We discuss mechanisms such as Qwen3-VL's DeepStack and interleaved image--text reasoning only as motivation for repeated access to visual information, and explicitly state that we cannot verify that these mechanisms are responsible for the corresponding models' performance.

Taken together, MIMO-Crop and naive relevant-region extraction provide a simple proof-of-concept signal: externally providing a relevant local region helps, and when an untrained model itself succeeds in proposing such a region, its downstream performance approaches the externally supplied crop condition. We therefore view these results as motivation for future learned, potentially multi-step region-selection mechanisms that can adapt visual resolution and suppress irrelevant distractors, rather than as claiming that the present one-step procedure is already a complete iterative visual-search system.

We will revise the manuscript to make this scope explicit and add the predicted-region size statistics, IoU-conditioned analysis, and comparison with MIMO-Crop$_{512}$.

### Graying and distractor reduction.

#### Clarification on graying and distractor reduction.

We agree that the graying experiment should not be interpreted as a clean causal intervention on distractor count alone, and we will revise the manuscript to make this scope explicit.

More generally, in natural images there are different ways of reducing the effective burden of distractors, and these interventions can necessarily change other properties of the visual input. For example, cropping reduces the number of competing instances precisely by narrowing the visual search space, while simultaneously increasing the relative scale of the retained target. Graying achieves a related reduction through a different mechanism: the image dimensions are unchanged and, for a given model, the pre- and post-graying inputs contain the same number of visual tokens, while the visual information carried by regions outside the retained window is suppressed. This also increases the relative salience of the retained region. Thus, these associated changes are not all incidental artifacts; some are part of the mechanism through which the effective distractor burden is reduced.

This interpretation is also consistent, at a high level, with selective visual attention in humans. During visual search, processing is preferentially allocated to task-relevant regions while competing peripheral information is de-emphasized, thereby reducing its effective influence on the task. We do not claim that graying or cropping reproduces the biological mechanism; rather, they are simple external analogues of the broader principle of spatially prioritizing relevant information while suppressing competing visual input.

Accordingly, we do not use either intervention to estimate the isolated causal effect of distractor count. We revise our interpretation to the more limited empirical observation that reducing effective visual competition through different forms of spatial focusing can improve performance in MIMO scenes. A strict causal characterization of distractor count would require a separately controlled setting in which distractor instances can be independently added or removed while target appearance, scale, position, background, and scene structure are held fixed.

The graying and relevant-region experiments should therefore be viewed as complementary interventions that reduce effective distractor burden through different channels, rather than as clean causal decompositions. The localization-quality and MIMO-Crop analyses reported above further characterize the relevant-region intervention without attributing its gain to any single factor.

## Requested Change R5 — Report basic dataset statistics

We thank the reviewer for this suggestion and agree that reporting only the
total number of QA pairs makes image coverage and question reuse difficult to
assess. We now report the underlying image statistics.

MIMO-Bench is built from **120 images in total: 60 real and 60 synthetic**.
Images are distributed across the two tasks, and the two task image sets are
not disjoint: some images are used only for attribute binding, some only for
numerical counting, and some are shared by both tasks. Question counts per
image therefore differ substantially between the two tasks, reflecting the
different granularity of the two annotations.

| **Task** | **Images** | **Questions** | **Mean questions / image** |
|---|---|---:|---:|
| Attribute binding | real + synthetic | 3,402 | ~47 |
| Numerical counting | real + synthetic | 400 | 8 |
| **Total** | **120** (60 real, 60 syn.) | **3,802** | -- |

For attribute binding, an image contributes on average **47 questions**,
because each retained target instance in an image is queried for each of its
valid attributes, and MIMO images contain many same-category instances by
construction. For numerical counting, an image contributes **8 questions**,
comprising the parent query for a target group together with its localized
child queries. The counting split contains **57 parent queries**, of which
**39 come from synthetic images** and **18 from real images**.

The high questions-per-image ratio for attribute binding is a direct
consequence of the MIMO setting rather than of question reuse: a single dense
scene supports many distinct referring expressions, each resolving to a
different target instance, and each target instance supports several distinct
attribute queries. We will report these statistics, together with the
per-image question distribution, in the revised manuscript.
