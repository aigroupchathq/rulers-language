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
const lessonKey = "vision-intelligence-prompt-lessons-v1";
const maxLessons = 20;

const modeDetails = {
  design: {
    help: "Use this to explore a direction and make a decision. It must stop before implementation.",
    instructions: [
      "Show up to two distinct directions and recommend one.",
      "Make the proposal concrete with a preview or example where possible. State assumptions and the main trade-off.",
      "Do not implement, edit files, or add unrequested features. Stop after presenting the proposal."
    ]
  },
  implementation: {
    help: "Use this after a design or approach is approved. Give discretion for routine decisions; make scope and checks explicit.",
    instructions: [
      "Inspect the relevant project context, then make the smallest complete change that achieves the requested outcome.",
      "Preserve existing behavior and avoid features outside the stated boundaries. Use reasonable judgement for routine choices; ask only if a blocker or consequential risk prevents safe progress.",
      "Run the relevant available checks. Report what changed and the actual check results; do not claim a check passed if it was not run."
    ]
  },
  verification: {
    help: "Use this to test a specific claim independently. The verifier reports evidence and does not repair or redesign.",
    instructions: [
      "Check the work against the stated success criteria using the most relevant available evidence or tests.",
      "Do not edit, repair, or redesign the work while verifying it. Distinguish pass, fail, and inconclusive results.",
      "Report the exact evidence, limitations, and any checks you could not run. Do not infer success from a plausible appearance."
    ]
  }
};

const toneDetails = {
  analytical: {
    description: "Compare evidence and options; avoid turning a focused decision into excessive analysis.",
    instruction: "Use an analytical, neutral tone: distinguish evidence, assumptions, options, and uncertainty. Keep analysis proportional to the decision."
  },
  direct: {
    description: "Execute a defined task; the risk is acting too quickly on ambiguity.",
    instruction: "Use a direct, instructional tone. Be concise and action-oriented, but surface consequential ambiguity instead of guessing."
  },
  socratic: {
    description: "Support learning through questions; too many questions can slow progress.",
    instruction: "Use a Socratic, coaching tone. Ask only questions that help me reason through an important choice; do not question every routine detail."
  },
  exploratory: {
    description: "Generate alternatives; keep exploration inside the stated constraints.",
    instruction: "Use an exploratory, creative tone. Offer fresh possibilities while staying within the requested scope and making trade-offs clear."
  },
  critical: {
    description: "Challenge assumptions; focus on plausible, material objections rather than endless audits.",
    instruction: "Use a critical tone. Test important assumptions and identify evidence that could change the conclusion without inventing objections."
  },
  empathetic: {
    description: "Handle sensitive conversations with care; warmth must not replace honest judgement.",
    instruction: "Use an empathetic, supportive tone. Be considerate while remaining candid about risks, uncertainty, and problems."
  },
  persuasive: {
    description: "Communicate a position; keep confidence proportional to the evidence.",
    instruction: "Use a persuasive, editorial tone. Make the case clearly, but do not overstate confidence or omit material counter-evidence."
  },
  operational: {
    description: "Handle engineering and controlled changes; avoid bureaucracy and unnecessary approval loops.",
    instruction: "Use an operational, precise tone. State actions, boundaries, checks, and completion clearly; use judgement for ordinary implementation details."
  }
};

function updatePromptGuidance() {
  modeHelp.textContent = modeDetails[modeSelect.value].help;
  toneHelp.textContent = toneDetails[toneSelect.value].description;
}

modeSelect.addEventListener("change", updatePromptGuidance);
toneSelect.addEventListener("change", updatePromptGuidance);
updatePromptGuidance();

promptForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const work = document.querySelector("#idea").value.trim();
  const success = document.querySelector("#success").value.trim();
  const boundaries = document.querySelector("#boundaries").value.trim();

  if (!work || !success || !boundaries) {
    document.querySelector("#idea").focus();
    return;
  }

  const mode = modeDetails[modeSelect.value];
  const tone = toneDetails[toneSelect.value];
  const taskType = modeSelect.options[modeSelect.selectedIndex].text.split(" — ")[0].toUpperCase();

  generatedPrompt.value = [
    `WORK MODE: ${taskType}`,
    "",
    `Work or claim: ${work}`,
    "",
    `Success means: ${success}`,
    "",
    `Boundaries: ${boundaries}`,
    "",
    "Communication style:",
    tone.instruction,
    "Tone changes expression, not the standard of evidence. Do not imply that a tone or role gives you expertise or guarantees correctness.",
    "",
    "Instructions:",
    ...mode.instructions.map((instruction) => `- ${instruction}`)
  ].join("\n");
  generatedWrap.hidden = false;
  lessonPanel.hidden = false;
  copyStatus.textContent = "Review and edit the prompt. Remove anything sensitive before sharing.";
  generatedPrompt.focus();
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
      await navigator.share({ title: "Vision Intelligence prompt", text: generatedPrompt.value });
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
      typeof lesson.note === "string"
    )) {
      throw new TypeError("Saved lessons must be a list.");
    }
    return saved.slice(0, maxLessons);
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
    const note = document.createElement("span");
    const date = document.createElement("small");
    heading.textContent = `${lesson.mode} · ${lesson.outcome}`;
    note.textContent = lesson.note;
    date.textContent = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(lesson.date));
    item.append(heading, note, date);
    lessonList.append(item);
  });
}

renderLessons();

document.querySelector("#save-lesson").addEventListener("click", () => {
  const lessons = readLessons();
  if (lessons === null) {
    return;
  }
  const outcome = document.querySelector("#lesson-outcome");
  const note = document.querySelector("#lesson-note").value.trim();
  lessons.unshift({
    date: new Date().toISOString(),
    mode: modeSelect.options[modeSelect.selectedIndex].text.split(" — ")[0],
    outcome: outcome.options[outcome.selectedIndex].text,
    note
  });

  try {
    localStorage.setItem(lessonKey, JSON.stringify(lessons.slice(0, maxLessons)));
    lessonStatus.textContent = "Lesson saved in this browser only.";
    document.querySelector("#lesson-note").value = "";
    renderLessons();
  } catch (error) {
    lessonStatus.textContent = "This browser could not save the lesson. The prompt is still available to copy.";
  }
});

document.querySelector("#clear-lessons").addEventListener("click", () => {
  try {
    localStorage.removeItem(lessonKey);
    lessonList.replaceChildren();
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
