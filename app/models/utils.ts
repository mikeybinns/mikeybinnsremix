/**
 * Filter certain props from a provided props object.
 */
export function filterProps<KeysToOmit extends string>(
	props: Record<string, any>,
	propsToFilter: string[]
) {
	let newProps: Record<string, any> = {};
	let oldPropsKeys = Object.keys(props);
	let oldPropsValues = Object.values(props);
	for (let $i = 0; $i < oldPropsKeys.length; $i++) {
		if (!propsToFilter.includes(oldPropsKeys[$i])) {
			newProps[oldPropsKeys[$i]] = oldPropsValues[$i];
		}
	}
	return newProps as Omit<typeof props, KeysToOmit>;
}

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
	to: FormDataEntryValue | string | null | undefined,
	defaultRedirect: string = DEFAULT_REDIRECT
) {
	if (!to || typeof to !== "string") {
		return defaultRedirect;
	}

	if (!to.startsWith("/") || to.startsWith("//")) {
		return defaultRedirect;
	}

	return to;
}

export function validateEmail(email: unknown): email is string {
	return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function getNumberOfDaysInMonth(
	month: number | null = null,
	year: number | null = null
) {
	if (!month) {
		month = new Date().getMonth();
	}
	if (!year) {
		year = new Date().getFullYear();
	}
	return new Date(year, month + 1, 0).getDate();
}

export function stripAllTags(htmlString: string) {
	const noScriptAndStyle = htmlString.replace(
		"@<(script|style)[^>]*?>.*?</\\1>@si",
		""
	);
	const noTags = noScriptAndStyle.replace(/(<([^>]+)>)/gi, "");
	const noLineBreaks = noTags.replace("/[\r\n\t ]+/", " ");
	return noLineBreaks.trim().replace(/\s\s+/g, " ");
}
