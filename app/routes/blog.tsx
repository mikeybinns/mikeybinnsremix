import type { BlogPost } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import type { ThrownResponse } from "@remix-run/react";
import type { AnyValidResponseCode } from "~/models/HTTPResponse";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { BlogPostCard } from "~/components/BlogPostCard";
import { Heading, HeadingGroup } from "~/components/Heading";
import { Hyperlink } from "~/components/Hyperlink";
import { PostSearch } from "~/components/PostSearch";
import { prisma } from "~/db.server";
import { useOptionalUser } from "~/hooks/user";

export async function loader() {
	const blogPosts = await prisma.blogPost.findMany({
		orderBy: {
			lastUpdated: "asc",
		},
		take: 5,
	});

	return json({ blogPosts });
}

export default function Component() {
	const user = useOptionalUser();
	const { blogPosts } = useLoaderData<typeof loader>();

	return (
		<main>
			<h1>Blog</h1>
			<p>
				This blog is a place to share my coding experiences, opinions or small
				tips which don't warrant a full course. Want to know my thoughts on a
				specific subject?{" "}
				<Hyperlink to={`/contact?subject="Blog idea: [MY IDEA]"`}>
					Get in touch and suggest a blog idea.
				</Hyperlink>
			</p>
			<section>
				{blogPosts.map((post) => {
					return (
						<BlogPostCard
							key={post.id}
							userReadingSpeed={user?.readingSpeed}
							{...post}
						/>
					);
				})}
			</section>
		</main>
	);
}
Component.displayName = "Blog archive route component";

export function CatchBoundary() {
	const { status, data } = useCatch<
		| ThrownResponse<
				404,
				{
					attemptedSlug: string;
					suggestedPost: SerializeFrom<BlogPost> | null;
				}
		  >
		| ThrownResponse<Exclude<AnyValidResponseCode, 404>, any>
	>();

	if (status === 404) {
		return (
			<main>
				<HeadingGroup>
					<Heading>No post found at "{data.attemptedSlug}"</Heading>
					{data.suggestedPost ? (
						<>
							<p>Were you looking for this post?</p>
							<BlogPostCard {...data.suggestedPost} />
						</>
					) : (
						<p>
							I'm sorry you couldn't find what you were looking for, please try
							searching for some keywords instead, or return to{" "}
							<Hyperlink to={`/blog`}>the blog archive</Hyperlink>.
						</p>
					)}
					<PostSearch />
				</HeadingGroup>
			</main>
		);
	}
}
