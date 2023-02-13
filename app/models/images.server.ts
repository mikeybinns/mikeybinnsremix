import crypto from "crypto";

export async function getGravatarImageURL(email: string) {
	const emailHash = crypto.createHash("md5").update(email).digest("hex");
	const response = await fetch(
		`https://www.gravatar.com/avatar/${emailHash}/?d=404`
	);
	if (response.status === 404) {
		return null;
	}
	return `https://www.gravatar.com/avatar/${emailHash}/?d=404`;
}
