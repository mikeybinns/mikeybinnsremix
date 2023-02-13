import type { BlogPost } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import { Button } from "~/components/Button";
import { Heading, HeadingGroup } from "~/components/Heading";
import { DatePHP } from "~/models/DatePHP";
import { getReadTime } from "~/models/reading";

export function BlogPostCard({
	title,
	slug,
	excerpt,
	lastUpdated,
	wordCount,
	userReadingSpeed,
}: SerializeFrom<BlogPost> & { userReadingSpeed?: number | undefined }) {
	return (
		<article className="blog-card">
			<HeadingGroup>
				<Heading>{title}</Heading>
				<div className="excerpt">{excerpt}</div>
				<p>
					Last updated: {new DatePHP(lastUpdated).format("jS F Y a\t H:i")} —{" "}
					{getReadTime(wordCount, userReadingSpeed)} min read
				</p>
				<Button to={`/blog/${slug}`}>Read this post</Button>
			</HeadingGroup>
		</article>
	);
}
