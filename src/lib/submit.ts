// The starter file behind "Add a project": shown on /submit and prefilled into GitHub's new-file page.
// No Next APIs here, so the test can check the template against the real schema.
import { REPO_BRANCH, REPO_URL } from "./site";

export const NEW_FILE_NAME = "your-project.md";

/** The smallest valid project file; `date` (YYYY-MM-DD) fills both `verified` and `listed`. */
export const projectTemplate = (date: string) => `---
name: Your Project
url: https://your-project.example
tagline: One sentence on what it does.
categories: [Wallet]
verified: ${date}
listed: ${date}
---
`;

/**
 * GitHub's "create new file" page with the name and content filled in. Someone without write access
 * gets a fork made for them and is led to a pull request.
 */
export const newFileUrl = (date: string) =>
  `${REPO_URL}/new/${REPO_BRANCH}/content/projects?filename=${NEW_FILE_NAME}&value=${encodeURIComponent(projectTemplate(date))}`;
