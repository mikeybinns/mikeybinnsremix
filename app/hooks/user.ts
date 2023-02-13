import type { User } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import type { RootLoaderType } from "~/root";
import { useRouteLoaderData } from "@remix-run/react";

function isUser(user: any): user is User {
	return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
	const data = useRouteLoaderData("root") as SerializeFrom<RootLoaderType>;
	if (!data || !isUser(data.user)) {
		return undefined;
	}
	return data.user;
}

export function useUser(): User {
	const maybeUser = useOptionalUser();
	if (!maybeUser) {
		throw new Error(
			"No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
		);
	}
	return maybeUser;
}
