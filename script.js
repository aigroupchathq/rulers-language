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

promptForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const idea = document.querySelector("#idea").value.trim();
  const audience = document.querySelector("#audience").value.trim() || "People who need this solution";
  const task = document.querySelector("#main-task").value.trim() || "Complete the most important task";
  const keepSimple = document.querySelector("#keep-simple").checked;

  if (!idea) {
    document.querySelector("#idea").focus();
    return;
  }

  const limits = keepSimple
    ? "Keep the first version small. Do not add accounts, payment handling, sensitive data collection or features that are not essential to this first task."
    : "Keep the scope focused on the first task. Ask before adding accounts, payments, sensitive data collection or other major features.";

  generatedPrompt.value = `I want to make: ${idea}\n\nIt is for: ${audience}\n\nThe first thing a user should be able to do is: ${task}\n\nPlease start by proposing a short plan for the smallest useful first version. Describe the screens, user flow and any assumptions. Do not write code yet. Ask me questions if important details are missing.\n\n${limits}\n\nAfter I approve the plan, build one step at a time. Explain important decisions in plain language. Tell me how to preview the result and what I should test. Do not invent claims, data or integrations.`;
  generatedWrap.hidden = false;
  copyStatus.textContent = "Review this brief and edit it to fit your idea.";
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
