import type { LinksFunction } from "@remix-run/node";
import { Button } from "~/components/Button";
import { Heading, HeadingGroup } from "~/components/Heading";
import { Hyperlink } from "~/components/Hyperlink";

export const links: LinksFunction = () => [];

export default function Component() {
	return (
		<main>
			<section id="hero">
				<h1>
					Creating value through code, and teaching others to do the same.
				</h1>
				<Button to={`/blog`}>Read my thoughts on my blog</Button>
				<Button to={`/courses`}>Learn from me by taking a course</Button>
			</section>
			<section id="about-me">
				<HeadingGroup>
					<Heading>A bit about me</Heading>
					<p>
						Hi ☺️ I'm Mikey Binns. If you're listening to that from a screen
						reader, it's actually pronounced "my key bins". I'm a developer from
						the U.K who's passionate about progressive enhancement and
						accessibility.
					</p>
					<p>
						Want to know more?{" "}
						<Button to={"/about"}>
							Click here to view my "about me" page.
						</Button>
					</p>
				</HeadingGroup>
			</section>
			<section id="blog">
				<HeadingGroup>
					<Heading>My blog</Heading>
					<p>
						This blog is a place to share my coding experiences or small tips
						which don't warrant a full course. Want to know my thoughts on a
						specific subject?{" "}
						<Hyperlink to={`/contact?subject="Blog idea: [MY IDEA]"`}>
							Get in touch and suggest a blog idea.
						</Hyperlink>
					</p>
				</HeadingGroup>
			</section>
		</main>
	);
}
Component.displayName = "Home page route component";
