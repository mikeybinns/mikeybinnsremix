import type { BlogPost } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import type { ThrownResponse } from "@remix-run/react";
import type { LoaderArgsWithParams } from "user";
import type { AnyValidResponseCode } from "~/models/HTTPResponse";
import { Prisma } from "@prisma/client";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { default as fuzzysort } from "fuzzysort";
import { BlogPostCard } from "~/components/BlogPostCard";
import { Heading, HeadingGroup } from "~/components/Heading";
import { Hyperlink } from "~/components/Hyperlink";
import { PostSearch } from "~/components/PostSearch";
import { prisma } from "~/db.server";
import { useOptionalUser } from "~/hooks/user";
import { stopWords } from "~/models/search";

export async function loader({
	request,
	params,
}: LoaderArgsWithParams<"/blog/:postSlug">) {
	const searchParams = new URL(request.url).searchParams;
	const showSpecificRevision = searchParams.get("showRevision");
	const showRevisions =
		showSpecificRevision || searchParams.get("showRevisions");

	let blogPosts: BlogPost[];

	try {
		const singlePost = await prisma.blogPost.findUniqueOrThrow({
			where: {
				slug: params.postSlug,
			},
		});
		blogPosts = [singlePost];
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2025"
		) {
			const fuzzyMatchedPost = await getClosestMatchingPost(params.postSlug);
			throw json(
				{ attemptedSlug: params.postSlug, suggestedPost: fuzzyMatchedPost },
				{ status: 404 }
			);
		}
		throw error;
	}

	return json(
		await Promise.all([blogPosts]).then((values) => ({
			blogPosts: values[0],
		}))
	);
}

export default function Component() {
	const user = useOptionalUser();
	const { blogPosts } = useLoaderData<typeof loader>();

	return null;
}
Component.displayName = "Blog single route component";

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

export async function getClosestMatchingPost(searchedPostSlug: string) {
	const newSearchablePostSlug = searchedPostSlug
		.split(" ")
		.filter((part) => !stopWords.includes(part))
		.join(" ");

	const closestBlogPostResult = fuzzysort.go(
		newSearchablePostSlug,
		await prisma.blogPost.findMany(),
		{ key: "slug", limit: 1, threshold: -20000 }
	);
	if (closestBlogPostResult.total === 1) {
		return closestBlogPostResult[0].obj;
	}
	return null;
}
