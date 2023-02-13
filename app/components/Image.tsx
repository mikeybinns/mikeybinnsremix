export function CloudinaryImage({ name }: { name: string }) {
	return (
		// eslint-disable-next-line jsx-a11y/img-redundant-alt
		<img src={`${name}.jpg`} alt="TODO: set up Image component." />
	);
}

export function GravatarOrDefaultImage({
	validatedGravatarUrl,
}: {
	validatedGravatarUrl?: string | null;
}) {
	if (validatedGravatarUrl) {
		return <img src={validatedGravatarUrl} alt="A users custom gravatar." />;
	}
	return <CloudinaryImage name={"placeholder-image"} />;
}
