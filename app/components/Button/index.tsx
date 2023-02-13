import type { LinksFunction } from "@remix-run/node";
import type { NavLinkProps } from "@remix-run/react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { NavLink } from "@remix-run/react";
import { filterProps } from "~/models/utils";

import buttons_css_url from "~/styles/Button.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: buttons_css_url },
];

export interface CommonButtonProps {
	size?: "small" | "x-small" | "xx-small";
	variant?: "outline";
	icon_position?: "above";
	theme?: "dark" | "light" | "reverse" | "confirm" | "cancel" | "link";
}
type AnchorButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> &
	CommonButtonProps & {
		disabled?: boolean;
	};
type NavLinkButtonProps = NavLinkProps &
	CommonButtonProps & {
		disabled?: boolean;
	};
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & CommonButtonProps;

function isAnchor(
	button_props: AnchorButtonProps | NavLinkButtonProps | ButtonProps
): button_props is AnchorButtonProps {
	return button_props.hasOwnProperty("href") === true;
}
function isNavLink(
	button_props: AnchorButtonProps | NavLinkButtonProps | ButtonProps
): button_props is NavLinkButtonProps {
	return button_props.hasOwnProperty("to") === true;
}

/**
 * Get a button style component that uses the correct semantic element under the hood.
 */
export function Button(
	props: AnchorButtonProps | NavLinkButtonProps | ButtonProps
) {
	let size = props.size ? `variant_size_${props.size}` : `variant_size_default`;
	let variant = props.variant
		? `variant_style_${props.variant}`
		: `variant_style_default`;
	let icon_position = props.icon_position
		? `variant_icon_${props.icon_position}`
		: `variant_icon_default`;
	let theme = props.theme ? `theme_${props.theme}` : `theme_default`;
	if (isAnchor(props) && !props.disabled) {
		let anchor_props: AnchorHTMLAttributes<HTMLAnchorElement> = filterProps(
			props,
			["variant", "size", "icon_position", "theme", "disabled"]
		);
		return (
			// eslint-disable-next-line react/forbid-elements
			<a
				{...anchor_props}
				className={`button${props.disabled ? ` disabled` : ""}${
					size ? ` ${size}` : ""
				}${variant ? ` ${variant}` : ""}${
					icon_position ? ` ${icon_position}` : ""
				}${theme ? ` ${theme}` : ""}${
					anchor_props.className ? ` ${anchor_props.className}` : ""
				}`}
				href={props.disabled ? undefined : props.href}
			>
				{props.children}
			</a>
		);
	} else if (isNavLink(props) && !props.disabled) {
		let link_props = filterProps(props, [
			"variant",
			"size",
			"icon_position",
			"theme",
			"disabled",
		]) as NavLinkProps;
		return (
			// eslint-disable-next-line react/forbid-elements
			<NavLink
				{...link_props}
				className={({ isActive }) =>
					`button${props.disabled ? ` disabled` : ""}${size ? ` ${size}` : ""}${
						variant ? ` ${variant}` : ""
					}${icon_position ? ` ${icon_position}` : ""}${
						theme ? ` ${theme}` : ""
					}${link_props.className ? ` ${link_props.className}` : ""}${
						isActive ? " current_page" : ""
					}`
				}
				to={props.disabled ? "" : props.to}
			>
				{props.children}
			</NavLink>
		);
	} else {
		let button_props: ButtonHTMLAttributes<HTMLButtonElement> = filterProps(
			props,
			["variant", "size", "icon_position", "theme", "to", "href"]
		);
		return (
			// eslint-disable-next-line react/forbid-elements
			<button
				{...button_props}
				className={`button${props.disabled ? ` disabled` : ""}${
					size ? ` ${size}` : ""
				}${variant ? ` ${variant}` : ""}${
					icon_position ? ` ${icon_position}` : ""
				}${theme ? ` ${theme}` : ""}${
					button_props.className ? ` ${button_props.className}` : ""
				}`}
			>
				{typeof props.children === "function"
					? props.children({ isActive: false, isPending: false })
					: props.children}
			</button>
		);
	}
}
