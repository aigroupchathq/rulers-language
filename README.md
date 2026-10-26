# Rulers Language

Rulers Language is VD's practical guide to giving AI clear direction and judging its output against what you meant. The opening speaks directly to the reader and teaches through a before-and-after prompt, while optional sections provide project paths, tool choices, and deeper lessons. Its atmospheric dark theme uses restrained violet accents and layered surfaces.

The teaching point is deliberate: a commanding voice does not unlock extra intelligence. The AI does not reward status or authority; it responds to the context and instructions supplied, with limitations. Clear goals, boundaries, and evidence make the result easier to judge. They do not guarantee correctness.

## The three work modes

- **Design** explores options, explains trade-offs, and stops before implementation.
- **Implementation** builds an approved direction within clear boundaries, then reports the checks actually run.
- **Verification** independently checks a specific claim and reports evidence, without redesigning or repairing the work.

Choose a communication tone that fits the task. Tone shapes expression; it does not grant expertise or guarantee truth. After trying a prompt, record what happened and improve the instruction responsible for the friction.

## Learn from real projects

Four illustrative Datum vehicle-platform exercises show how to:

- Explore creative interface directions while preserving the existing architecture.
- Inspect secondary screens, nested dialogs, and loading, empty, error, and disabled states.
- Separate unanswered questions and suspected risks from evidence-backed defects.
- Research customer problems, competing alternatives, and contrary evidence without inventing demand.

The Datum scenarios are teaching examples, not claims of documented results. Commercial desk research is exploratory Design work; it can shape hypotheses but does not validate demand. Each example includes a copy-ready prompt, an instruction-to-reason comparison, expected evidence, a common failure, an exercise, and a button to load the example into the prompt studio.

The guide ends with the supplied artwork used as a full-card background behind a direct message from VD: map the work, make the change, and prove what happened. The three stages make the method concrete; they are not claims that prompt language unlocks extra intelligence.

## Project files

- `index.html` contains the page content and metadata.
- `styles.css` and `vision-tool.css` contain the responsive design and accessibility states.
- `assets/rulers-language-hero.jpg` is the supplied atmospheric homepage background.
- `assets/system-landscape.webp` is the supplied wide image used in the optional system-learning interlude.
- `assets/rulers-arsenal.png` is the artwork used as the closing card's background, with the three stages of the method layered over it.
- `script.js` contains the prompt builder, instruction explanations, coding-agent examples, copy/share actions, tool finder, and browser-local lesson and launch checklists.
- `README.md` explains how to run and publish the project.
- `PROJECT-RECORD.md` keeps repository and publishing details.

## Preview locally

Open `index.html` in a browser. This is a static site and does not require a package install or build command.

## Publish on GitHub Pages

1. Push the project files to the `main` branch of the public `rulers-language` repository.
2. In the repository, open **Settings**, then **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder, then save.
5. Wait for deployment at https://aigroupchathq.github.io/rulers-language/.

## Privacy and sharing

- Prompts and lessons are created locally in the visitor's browser. The site does not send them to an AI service or a backend.
- The lesson log stores up to 20 entries, including the actual prompt, observed outcome, concrete observation, correction, and optional evidence, in the current browser only. Older entries remain readable; information that was not recorded is shown as unavailable.
- Copy a prompt to paste it into the AI tool you choose. The share action uses the browser's share sheet when available, otherwise it copies the prompt.
- Review prompts before sharing them. Do not include passwords, API keys, private records, or sensitive personal information.
- The launch checklist stores progress in the visitor's browser only.

## Notes

- Tool features and prices change. Check each provider's official site for current details.
- Prompts can improve clarity, but generated output still needs human judgement and appropriate testing.
- Do not put passwords, API keys, or private data in public project files.
