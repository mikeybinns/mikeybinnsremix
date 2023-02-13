import type { ReactNode, HTMLAttributes } from "react";
import { useContext, createContext } from "react";
const HeadingContext = createContext(1);

export function Heading(props: HTMLAttributes<HTMLHeadingElement>) {
	let Comp = "h" + Math.min(useContext(HeadingContext), 6);
	return <Comp {...props} />;
}

export function HeadingGroup(props: { children: ReactNode }) {
	let headingLevel = useContext(HeadingContext);
	return (
		<HeadingContext.Provider value={headingLevel + 1}>
			{props.children}
		</HeadingContext.Provider>
	);
}
