import { Heading, HeadingGroup } from "~/components/Heading";
import { Hyperlink } from "~/components/Hyperlink";

export default function Component() {
	return (
		<main>
			<h1>About me</h1>
			<section>
				<HeadingGroup>
					<Heading>Work</Heading>
					<p>
						Currently I work at{" "}
						<Hyperlink href={"https://www.atomicsmash.co.uk/"}>
							Atomic Smash
						</Hyperlink>
						, A WordPress agency based in Bristol, UK. They are a fantastic
						place to work who care about their employees. If you're looking for
						work, check out our available{" "}
						<Hyperlink href="https://bristolcreativeindustries.com/members/atomic-smash/">
							job postings
						</Hyperlink>
						.
					</p>
				</HeadingGroup>
				<HeadingGroup>
					<Heading>Hobbies and interests</Heading>
					<p>
						In my off time, I enjoy playing video games, I really enjoy
						story-based single player games, my favourite game at the time of
						writing is God of War Ragnarök. I also enjoy playing the drums and
						playing badminton.
					</p>
				</HeadingGroup>
				<HeadingGroup>
					<Heading>"Testimonials"</Heading>
					<p>
						I'm pretty bad at writing about myself, so instead I've asked some
						people who know me to write about me instead!
					</p>
					<section className="testimonial-group"></section>
					<p>
						If you'd like to submit a testimonial yourself, you can submit one
						using <Hyperlink to={"/submit-a-testimonial"}>this form</Hyperlink>.
					</p>
				</HeadingGroup>
			</section>
		</main>
	);
}
Component.displayName = "About me route component";
