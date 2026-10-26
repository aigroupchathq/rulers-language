const toolCards = [...document.querySelectorAll(".tool-card")];
const filterButtons = [...document.querySelectorAll(".filter-button")];

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    toolCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

const recommendationDetails = {
  simple: {
    title: "Start with a visual builder.",
    detail: "Make one page first. Keep it static until you know what needs to change or be saved.",
    tool: "v0",
    href: "https://v0.dev/",
    next: "Write a one paragraph brief in the prompt lab below."
  },
  interactive: {
    title: "Start with a small app prototype.",
    detail: "Choose one workflow and test it with sample information before connecting real user data.",
    tool: "Lovable",
    href: "https://lovable.dev/",
    next: "List the screens and the information each one needs."
  },
  code: {
    title: "Start with your project and a safe checkpoint.",
    detail: "Save a copy in GitHub, then ask for one change. Review the files changed before accepting it.",
    tool: "Cursor",
    href: "https://cursor.com/",
    next: "Describe the current behavior, the change you want and how you will check it."
  }
};

const finderForm = document.querySelector("#finder-form");
const recommendation = document.querySelector("#recommendation");

finderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const type = document.querySelector("#project-type").value;
  const experience = document.querySelector("#experience").value;
  const result = recommendationDetails[type];
  const extra = experience === "new"
    ? "Since you are new to code, ask the tool to explain each step in plain language."
    : experience === "some"
      ? "Ask the tool to show which files it plans to change so you can review the work."
      : "Ask the tool to propose a plan and tests before editing the project.";

  recommendation.innerHTML = `<strong>${result.title}</strong> ${result.detail}<br><a href="${result.href}" target="_blank" rel="noreferrer">Explore ${result.tool}</a><br>${result.next} ${extra}`;
  recommendation.hidden = false;
});

const promptForm = document.querySelector("#prompt-form");
const generatedWrap = document.querySelector("#generated-wrap");
const generatedPrompt = document.querySelector("#generated-prompt");
const copyStatus = document.querySelector("#copy-status");
const modeSelect = document.querySelector("#work-mode");
const toneSelect = document.querySelector("#tone");
const modeHelp = document.querySelector("#mode-help");
const toneHelp = document.querySelector("#tone-help");
const lessonPanel = document.querySelector("#lesson-panel");
const lessonList = document.querySelector("#lesson-list");
const lessonStatus = document.querySelector("#lesson-status");
const lessonCopyStatus = document.querySelector("#example-studio-status");
const promptExplanation = document.querySelector("#prompt-explanation-list");
const lessonKey = "vision-intelligence-prompt-lessons-v1";
const maxLessons = 20;
let generatedPromptMode = "";

const modeDetails = {
  design: {
    label: "Design",
    help: "Use this to explore a direction and make a decision. It stops before anything is built.",
    instructions: [
      "Show up to two distinct directions and recommend one.",
      "Make the proposal concrete with a preview or example where possible. State assumptions and the main trade-off.",
      "Do not implement, edit files, or add unrequested features. Stop after presenting the proposal."
    ],
    explanations: [
      "A small set of choices is easier to compare than an open-ended list.",
      "A preview and named trade-off make the recommendation easier to judge.",
      "A clear stopping point keeps exploration separate from changes."
    ]
  },
  implementation: {
    label: "Implementation",
    help: "Use this after you approve an approach. Give discretion for routine choices, while making the boundaries and checks clear.",
    instructions: [
      "Inspect the relevant project context, then make the smallest complete change that achieves the requested outcome.",
      "Preserve existing behavior and avoid features outside the stated boundaries. Use reasonable judgement for routine choices; ask only if a blocker or consequential risk prevents safe progress.",
      "Run the relevant available checks. Report what changed and the actual check results; do not claim a check passed if it was not run."
    ],
    explanations: [
      "Reading the project first reduces changes based on guesses.",
      "Clear boundaries prevent unrequested scope, while routine discretion avoids needless approval loops.",
      "Actual check results distinguish verified behavior from assumptions."
    ]
  },
  verification: {
    label: "Verification",
    help: "Use this to check a specific claim independently. Ask for evidence, not a repair or a redesign.",
    instructions: [
      "Check the work against the stated success criteria using the most relevant available evidence or tests.",
      "Do not edit, repair, or redesign the work while verifying it. Distinguish pass, fail, and inconclusive results.",
      "Report the exact evidence, limitations, and any checks you could not run. Do not infer success from a plausible appearance."
    ],
    explanations: [
      "A specific claim and criteria make the check measurable.",
      "Separating inspection from repair preserves an independent result.",
      "Evidence and limitations keep certainty proportional to what was actually checked."
    ]
  }
};

const toneDetails = {
  analytical: {
    description: "Compare evidence and options without turning a focused decision into a long analysis.",
    instruction: "Use an analytical, neutral tone. Separate evidence from assumptions, compare the relevant options, and keep the analysis proportionate to the decision."
  },
  direct: {
    description: "Move a clearly defined task forward. If an ambiguity could change the result, surface it instead of guessing.",
    instruction: "Use a direct, instructional tone. Be concise and practical. If an ambiguity could materially change the result, say what is unclear rather than guessing."
  },
  socratic: {
    description: "Help me reason through an important choice. Do not make routine progress depend on answering a string of questions.",
    instruction: "Use a Socratic, coaching tone. Ask a question when it helps me think through an important choice. Use sensible judgement for routine details."
  },
  exploratory: {
    description: "Make room for fresh possibilities while keeping the exploration connected to the goal.",
    instruction: "Use an exploratory, creative tone. Offer fresh possibilities within the stated boundaries, and explain the meaningful trade-offs."
  },
  critical: {
    description: "Test important assumptions. Focus on concerns that could change the decision, not objections for their own sake.",
    instruction: "Use a critical tone. Examine important assumptions and identify evidence that could change the conclusion. Do not invent objections."
  },
  empathetic: {
    description: "Handle sensitive moments with care while staying honest about what is difficult or uncertain.",
    instruction: "Use an empathetic, supportive tone. Be considerate and candid about risks, uncertainty, and problems. Do not soften facts until they become unclear."
  },
  persuasive: {
    description: "Make a clear case without making the evidence sound stronger than it is.",
    instruction: "Use a persuasive, editorial tone. Explain the case clearly, while including material counter-evidence and keeping confidence proportionate to the evidence."
  },
  operational: {
    description: "Keep engineering work clear and controlled without asking permission for every ordinary detail.",
    instruction: "Use an operational, precise tone. State the actions, boundaries, checks, and completion clearly. Use judgement for routine choices and raise only consequential blockers."
  }
};

const projectExamples = {
  quickstart: {
    mode: "design",
    tone: "exploratory",
    work: "Explore two image-led ways to browse the vehicles already on the Motor World site.",
    success: "Show a concrete preview of each direction, explain the trade-off, and recommend one.",
    boundaries: "Use existing content, routes, and features. Do not add new features or change files. Stop after the design proposal."
  },
  creative: {
    mode: "design",
    tone: "exploratory",
    work: "Explore two distinctive visual directions for vehicle discovery in the hypothetical Datum platform.",
    success: "Show a concrete preview for each direction, explain the trade-off, and recommend one while preserving the existing architecture.",
    boundaries: "Inspect existing screens, design tokens, routes, components, data flow, and working behavior. Do not edit files or add features. Treat Datum as illustrative, not a documented success."
  },
  consistency: {
    mode: "implementation",
    tone: "operational",
    work: "Improve interface consistency across the hypothetical Datum vehicle platform's secondary screens and nested dialogs.",
    success: "Inventory applicable screens and loading, empty, error, and disabled states; align the in-scope patterns and report the checks actually run.",
    boundaries: "Use existing design tokens and components where they fit. Preserve routes, data behavior, and unrelated features. Do not claim unchecked states are verified."
  },
  verification: {
    mode: "verification",
    tone: "critical",
    work: "Verify stated vehicle-filter and dialog behaviors in the hypothetical Datum platform.",
    success: "Classify each item as an unanswered question, suspected risk, or confirmed defect with reproduction steps and observed evidence.",
    boundaries: "Do not edit or repair files. Mark unchecked items inconclusive. Do not promote suspicion to fact or invent test results."
  },
  research: {
    mode: "design",
    tone: "exploratory",
    work: "Explore the customer problem and alternatives a hypothetical vehicle platform called Datum might address.",
    success: "Present up to two evidence-backed problem hypotheses, current alternatives, contrary evidence, and questions for real customer research.",
    boundaries: "Use verifiable sources and dates; separate facts, interpretations, and questions. Do not invent customers, interviews, market sizes, demand, or competitor capabilities. Desk research does not validate demand."
  }
};

function openGuideForTarget(target) {
  const guide = target?.closest("details.optional-guide");
  if (guide) {
    guide.open = true;
  }
}

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (link) {
    openGuideForTarget(document.getElementById(decodeURIComponent(link.hash.slice(1))));
  }
});

function openGuideFromLocation() {
  if (location.hash) {
    openGuideForTarget(document.getElementById(decodeURIComponent(location.hash.slice(1))));
  }
}

window.addEventListener("hashchange", openGuideFromLocation);
openGuideFromLocation();

function updatePromptGuidance() {
  modeHelp.textContent = modeDetails[modeSelect.value].help;
  toneHelp.textContent = toneDetails[toneSelect.value].description;
}

modeSelect.addEventListener("change", updatePromptGuidance);
toneSelect.addEventListener("change", updatePromptGuidance);
updatePromptGuidance();

function renderPromptExplanation(modeKey, toneKey) {
  promptExplanation.replaceChildren();
  const instructions = modeDetails[modeKey];

  instructions.instructions.forEach((instruction, index) => {
    const item = document.createElement("li");
    const instructionText = document.createElement("strong");
    const reason = document.createElement("span");
    instructionText.textContent = instruction;
    reason.textContent = instructions.explanations[index];
    item.append(instructionText, reason);
    promptExplanation.append(item);
  });

  const toneItem = document.createElement("li");
  const toneName = document.createElement("strong");
  const toneReason = document.createElement("span");
  toneName.textContent = "Selected tone";
  toneReason.textContent = `${toneDetails[toneKey].description} Tone changes expression, not expertise or evidence.`;
  toneItem.append(toneName, toneReason);
  promptExplanation.append(toneItem);
}

promptForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const work = document.querySelector("#idea").value.trim();
  const success = document.querySelector("#success").value.trim();
  const boundaries = document.querySelector("#boundaries").value.trim();

  const firstMissing = [
    [work, document.querySelector("#idea")],
    [success, document.querySelector("#success")],
    [boundaries, document.querySelector("#boundaries")]
  ].find(([value]) => !value);
  if (firstMissing) {
    firstMissing[1].focus();
    return;
  }

  const mode = modeDetails[modeSelect.value];
  const tone = toneDetails[toneSelect.value];
  generatedPromptMode = mode.label;

  generatedPrompt.value = [
    `WORK MODE: ${generatedPromptMode.toUpperCase()}`,
    "",
    `Work or claim: ${work}`,
    "",
    `Success means: ${success}`,
    "",
    `Boundaries: ${boundaries}`,
    "",
    "Communication style:",
    tone.instruction,
    "Tone shapes expression, not truth. Do not imply that a tone or role grants expertise or guarantees correctness.",
    "",
    "Instructions:",
    ...mode.instructions.map((instruction, index) => `${index + 1}. ${instruction}`)
  ].join("\n");
  generatedWrap.hidden = false;
  lessonPanel.hidden = false;
  renderPromptExplanation(modeSelect.value, toneSelect.value);
  copyStatus.textContent = "Review and edit the prompt. Remove anything sensitive before sharing.";
  generatedPrompt.focus();
});

document.querySelectorAll("[data-copy-lesson]").forEach((button) => {
  button.addEventListener("click", async () => {
    const prompt = document.querySelector(`#lesson-prompt-${button.dataset.copyLesson}`);
    const status = document.querySelector(`#lesson-copy-status-${button.dataset.copyLesson}`);

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable.");
      }
      await navigator.clipboard.writeText(prompt.value);
      status.textContent = "Example prompt copied.";
    } catch (error) {
      prompt.focus();
      prompt.select();
      status.textContent = "Clipboard unavailable. The prompt is selected so you can copy it.";
    }
  });
});

document.querySelectorAll("[data-use-example]").forEach((button) => {
  button.addEventListener("click", () => {
    const example = projectExamples[button.dataset.useExample];
    if (!example) {
      lessonCopyStatus.textContent = "This example could not be loaded.";
      return;
    }

    modeSelect.value = example.mode;
    toneSelect.value = example.tone;
    document.querySelector("#idea").value = example.work;
    document.querySelector("#success").value = example.success;
    document.querySelector("#boundaries").value = example.boundaries;
    generatedPromptMode = "";
    generatedPrompt.value = "";
    generatedWrap.hidden = true;
    lessonPanel.hidden = lessonList.children.length === 0;
    updatePromptGuidance();
    lessonCopyStatus.textContent = "Example loaded into the prompt studio. Review or edit the fields, then create the prompt when you are ready.";
    promptForm.scrollIntoView({ behavior: "smooth", block: "start" });
    modeSelect.focus({ preventScroll: true });
  });
});

document.querySelector("#copy-prompt").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(generatedPrompt.value);
    copyStatus.textContent = "Copied. You can paste the brief into your chosen tool.";
  } catch (error) {
    generatedPrompt.focus();
    generatedPrompt.select();
    copyStatus.textContent = "Clipboard access is unavailable here. The brief is selected so you can copy it with Ctrl+C.";
  }
});

document.querySelector("#share-prompt").addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({ title: "Rulers Language prompt", text: generatedPrompt.value });
      copyStatus.textContent = "Share sheet opened. Review the prompt before sending it.";
    } catch (error) {
      copyStatus.textContent = error.name === "AbortError"
        ? "Sharing was cancelled."
        : "The share action failed. You can still copy the prompt instead.";
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(generatedPrompt.value);
    copyStatus.textContent = "This browser has no share sheet, so the prompt was copied for you to paste where you choose.";
  } catch (error) {
    generatedPrompt.focus();
    generatedPrompt.select();
    copyStatus.textContent = "Sharing and clipboard access are unavailable here. The prompt is selected so you can copy it with Ctrl+C.";
  }
});

function readLessons() {
  try {
    const saved = JSON.parse(localStorage.getItem(lessonKey) || "[]");
    if (!Array.isArray(saved) || !saved.every((lesson) =>
      lesson &&
      typeof lesson.date === "string" &&
      Number.isFinite(Date.parse(lesson.date)) &&
      typeof lesson.mode === "string" &&
      typeof lesson.outcome === "string" &&
      (typeof lesson.note === "string" || typeof lesson.correction === "string") &&
      (lesson.prompt === undefined || typeof lesson.prompt === "string") &&
      (lesson.correction === undefined || typeof lesson.correction === "string") &&
      (lesson.observation === undefined || typeof lesson.observation === "string") &&
      (lesson.evidence === undefined || typeof lesson.evidence === "string")
    )) {
      throw new TypeError("Saved lessons must be a list.");
    }
    return saved.map((lesson) => ({
      date: lesson.date,
      mode: lesson.mode,
      prompt: lesson.prompt || "",
      outcome: lesson.outcome,
      observation: lesson.observation || "",
      correction: lesson.correction ?? lesson.note ?? "",
      evidence: lesson.evidence || ""
    })).slice(0, maxLessons);
  } catch (error) {
    lessonStatus.textContent = "Saved lessons could not be read. You can still use the prompt builder.";
    return null;
  }
}

function renderLessons() {
  const lessons = readLessons();
  if (lessons === null) {
    return;
  }
  lessonList.replaceChildren();
  lessons.forEach((lesson) => {
    const item = document.createElement("li");
    const heading = document.createElement("strong");
    const promptDetails = document.createElement("details");
    const promptSummary = document.createElement("summary");
    const promptText = document.createElement("pre");
    const date = document.createElement("small");
    heading.textContent = `${lesson.mode} · ${lesson.outcome}`;
    promptSummary.textContent = "Saved prompt";
    promptText.textContent = lesson.prompt || "This older saved entry did not include the prompt text.";
    promptDetails.append(promptSummary, promptText);
    date.textContent = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(lesson.date));
    item.append(heading, promptDetails);

    if (lesson.observation) {
      const observation = document.createElement("p");
      const label = document.createElement("strong");
      label.textContent = "What happened: ";
      observation.append(label, document.createTextNode(lesson.observation));
      item.append(observation);
    }
    if (lesson.correction) {
      const correction = document.createElement("p");
      const label = document.createElement("strong");
      label.textContent = "Correction: ";
      correction.append(label, document.createTextNode(lesson.correction));
      item.append(correction);
    }
    if (lesson.evidence) {
      const evidence = document.createElement("p");
      const label = document.createElement("strong");
      label.textContent = "Evidence: ";
      evidence.append(label, document.createTextNode(lesson.evidence));
      item.append(evidence);
    }
    item.append(date);
    lessonList.append(item);
  });
  lessonPanel.hidden = lessons.length === 0 && !generatedPrompt.value.trim();
}

renderLessons();

document.querySelector("#save-lesson").addEventListener("click", () => {
  const lessons = readLessons();
  if (lessons === null) {
    return;
  }
  const outcome = document.querySelector("#lesson-outcome");
  if (!generatedPrompt.value.trim()) {
    lessonStatus.textContent = "Create a prompt before saving a lesson.";
    return;
  }
  const observation = document.querySelector("#lesson-observation");
  const observationText = observation.value.trim();
  if (!observationText) {
    lessonStatus.textContent = "Add a brief, concrete observation before saving. What did you actually see?";
    observation.focus();
    return;
  }
  lessons.unshift({
    date: new Date().toISOString(),
    mode: generatedPromptMode || modeDetails[modeSelect.value].label,
    outcome: outcome.options[outcome.selectedIndex].text,
    prompt: generatedPrompt.value,
    observation: observationText,
    correction: document.querySelector("#lesson-correction").value.trim(),
    evidence: document.querySelector("#lesson-evidence").value.trim()
  });

  try {
    localStorage.setItem(lessonKey, JSON.stringify(lessons.slice(0, maxLessons)));
    lessonStatus.textContent = "Lesson saved in this browser only.";
    observation.value = "";
    document.querySelector("#lesson-correction").value = "";
    document.querySelector("#lesson-evidence").value = "";
    renderLessons();
  } catch (error) {
    lessonStatus.textContent = "This browser could not save the lesson. The prompt is still available to copy.";
  }
});

document.querySelector("#clear-lessons").addEventListener("click", () => {
  try {
    localStorage.removeItem(lessonKey);
    renderLessons();
    lessonPanel.hidden = false;
    lessonStatus.textContent = "Saved lessons cleared from this browser.";
  } catch (error) {
    lessonStatus.textContent = "This browser could not clear saved lessons.";
  }
});

const checklist = document.querySelector("#checklist");
const checklistInputs = [...checklist.querySelectorAll("input[type=checkbox]")];
const progressText = document.querySelector("#check-progress");
const progressPercent = document.querySelector("#check-percent");
const progressFill = document.querySelector("#progress-fill");
const progressBar = progressFill.parentElement;
const checklistKey = "aigroupchat-launch-checklist-v1";
const storageStatus = document.querySelector("#storage-status");

function updateProgress() {
  const completed = checklistInputs.filter((input) => input.checked).length;
  const percentage = Math.round((completed / checklistInputs.length) * 100);
  progressText.textContent = `${completed} of ${checklistInputs.length} checked`;
  progressPercent.textContent = `${percentage}%`;
  progressFill.style.width = `${percentage}%`;
  progressBar.setAttribute("aria-valuenow", String(percentage));
}

try {
  const saved = JSON.parse(localStorage.getItem(checklistKey) || "{}");
  checklistInputs.forEach((input) => {
    input.checked = saved[input.dataset.check] === true;
  });
} catch (error) {
  storageStatus.textContent = "This browser could not restore saved checklist progress. You can still use the checklist for this visit.";
}
updateProgress();

checklistInputs.forEach((input) => {
  input.addEventListener("change", () => {
    const saved = Object.fromEntries(checklistInputs.map((item) => [item.dataset.check, item.checked]));
    try {
      localStorage.setItem(checklistKey, JSON.stringify(saved));
    } catch (error) {
      storageStatus.textContent = "Progress is updated for this visit, but this browser could not save it.";
    }
    updateProgress();
  });
});

document.querySelector("#reset-checklist").addEventListener("click", () => {
  checklistInputs.forEach((input) => {
    input.checked = false;
  });
  try {
    localStorage.removeItem(checklistKey);
  } catch (error) {
    storageStatus.textContent = "The checklist was reset for this visit, but saved progress could not be cleared from this browser.";
  }
  updateProgress();
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  mainNav.classList.toggle("is-open", !expanded);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("is-open");
  });
});

document.querySelectorAll("[data-recommend]").forEach((link) => {
  link.addEventListener("click", () => {
    const type = link.dataset.recommend;
    const select = document.querySelector("#project-type");
    select.value = type;
  });
});
