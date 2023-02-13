import type { LinksFunction } from "@remix-run/node";
import type { HTMLAttributes } from "react";
import visuallyHiddenCSS from "~/styles/VisuallyHidden.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: visuallyHiddenCSS },
];

export function VisuallyHidden({
	style,
	...props
}: HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			{...props}
			className={`visually-hidden${
				props.className ? ` ${props.className}` : ""
			}`}
		></span>
	);
}
