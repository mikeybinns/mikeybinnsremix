import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundleMDX } from "mdx-bundler";
import { simpleGit } from "simple-git";
import { DatePHP } from "app/models/DatePHP";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const git = simpleGit();
const modifiedBlogFiles = await git
	.diff({
		"--name-only": null,
		"--cached": null,
		"--diff-filter": "A",
	})
	.then((output) => {
		return output
			.split("\n")
			.filter((line) => line.trim().length > 0)
			.filter(
				(line) => line.startsWith("content/blog/") && line.endsWith(".mdx")
			);
	});

if (modifiedBlogFiles.length > 0) {
	// spellchecker:ignore revparse
	const currentCommitShortHash = await git.revparse({ "--short": "HEAD" });
	const blogPostsFrontMatter = [];
	for (const modifiedBlogFileURL of modifiedBlogFiles) {
		const blogPostPath = path.resolve(__dirname, "../", modifiedBlogFileURL);
		blogPostsFrontMatter.push(
			bundleMDX({
				file: blogPostPath,
				cwd: path.dirname(blogPostPath),
			}).then((result) => result.frontmatter)
		);
	}

	for (const frontmatter of Promise.all(blogPostsFrontMatter)) {
		if (
			frontmatter.blogRevisions.includes(currentCommitShortHash) ||
			new DatePHP.parseString(frontmatter.lastUpdated, "Y-m-d").getTime() !==
				new Date(
					new Date().getFullYear(),
					new Date().getMonth(),
					new Date().getDate()
				).getTime()
		) {
			console.error(
				"You've updated a blog post but you haven't updated the blog meta in the frontmatter."
			);
			console.error(
				"Please run the updateBlogPostMeta script to update the frontmatter automatically."
			);
			process.exitCode = 1;
		}
	}
}
