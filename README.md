# Vision Intelligence

Vision Intelligence is a practical language tool for giving AI clearer direction and judging the result against what you meant. It guides better requests; it does not make AI infallible.

## The three work modes

- **Design** explores options, explains trade-offs, and stops before implementation.
- **Implementation** builds an approved direction within clear boundaries, then reports the checks actually run.
- **Verification** independently checks a specific claim and reports evidence, without redesigning or repairing the work.

Choose a communication tone that fits the task. Tone shapes expression; it does not grant expertise or guarantee truth. After trying a prompt, record what happened and improve the instruction responsible for the friction.

## Project files

- `index.html` contains the page content and metadata.
- `styles.css` and `vision-tool.css` contain the responsive design and accessibility states.
- `script.js` contains the prompt builder, tone guidance, copy/share actions, tool finder, and browser-local lesson and launch checklists.
- `README.md` explains how to run and publish the project.
- `PROJECT-RECORD.md` keeps repository and publishing details.

## Preview locally

Open `index.html` in a browser. This is a static site and does not require a package install or build command.

## Publish on GitHub Pages

1. Push the project files to the `main` branch of the public `vision-intelligence` repository.
2. In the repository, open **Settings**, then **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder, then save.
5. Wait for deployment at https://aigroupchathq.github.io/vision-intelligence/.

## Privacy and sharing

- Prompts and lessons are created locally in the visitor's browser. The site does not send them to an AI service or a backend.
- The lesson log stores up to 20 entries in the current browser only; clearing browser storage removes them.
- Copy a prompt to paste it into the AI tool you choose. The share action uses the browser's share sheet when available, otherwise it copies the prompt.
- Review prompts before sharing them. Do not include passwords, API keys, private records, or sensitive personal information.
- The launch checklist stores progress in the visitor's browser only.

## Notes

- Tool features and prices change. Check each provider's official site for current details.
- Prompts can improve clarity, but generated output still needs human judgement and appropriate testing.
- Do not put passwords, API keys, or private data in public project files.
