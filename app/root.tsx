import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { Hyperlink } from "./components/Hyperlink";
import { getUser } from "./session.server";

export const meta: MetaFunction = () => ({
	charset: "utf-8",
	title: "Mikey Binns",
	viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
	return json({
		user: await getUser(request),
	});
}

export type RootLoaderType = typeof loader;

export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<footer>
					<nav>
						<Hyperlink to={"/"}>Home</Hyperlink>
						<Hyperlink to={"/blog"}>Blog</Hyperlink>
						<Hyperlink to={"/courses"}>Courses</Hyperlink>
						<Hyperlink to={"/about"}>About me</Hyperlink>
						<Hyperlink to={"/contact"}>Contact me</Hyperlink>
					</nav>
				</footer>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
