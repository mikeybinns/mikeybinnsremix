import type { LinksFunction } from "@remix-run/node";
import type { NavLinkProps } from "@remix-run/react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { NavLink } from "@remix-run/react";

import hyperlinks_css_url from "~/styles/Hyperlink.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: hyperlinks_css_url },
];

interface AnchorButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}
interface NavLinkButtonProps extends NavLinkProps {}
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
type UnknownTypeElement = AnchorButtonProps | NavLinkButtonProps | ButtonProps;

function isAnchor(
	button_props: UnknownTypeElement
): button_props is AnchorButtonProps {
	return button_props.hasOwnProperty("href") === true;
}
function isNavLink(
	button_props: UnknownTypeElement
): button_props is NavLinkButtonProps {
	return button_props.hasOwnProperty("to") === true;
}
/**
 * Get a hyperlink style component that uses the correct semantic element under the hood.
 */
export function Hyperlink(props: UnknownTypeElement) {
	if (isAnchor(props)) {
		return (
			// eslint-disable-next-line react/forbid-elements
			<a
				{...props}
				className={`hyperlink underline${
					props.className ? ` ${props.className}` : ""
				}`}
			>
				{props.children}
			</a>
		);
	} else if (isNavLink(props)) {
		return (
			// eslint-disable-next-line react/forbid-elements
			<NavLink
				{...props}
				className={({ isActive }) =>
					`hyperlink underline${props.className ? ` ${props.className}` : ""}${
						isActive ? " current_page" : ""
					}`
				}
			>
				{props.children}
			</NavLink>
		);
	} else {
		return (
			// eslint-disable-next-line react/forbid-elements
			<button
				{...props}
				className={`hyperlink underline${
					props.className ? ` ${props.className}` : ""
				}`}
			>
				{props.children}
			</button>
		);
	}
}
