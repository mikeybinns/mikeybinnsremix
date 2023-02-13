import type { SVGProps } from "react";
import { filterProps } from "~/models/utils";
import svgSprite from "~/sprite.svg";

type IconProps = SVGProps<SVGSVGElement> & {
	name: string;
};

export function Icon(props: IconProps) {
	let icon_props: SVGProps<SVGSVGElement> = filterProps(props, ["name"]);
	return (
		<svg xmlns="http://www.w3.org/2000/svg" {...icon_props}>
			<use href={`${svgSprite}#${props.name}`} />
		</svg>
	);
}
