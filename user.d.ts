import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { RouteParams } from "routes-gen";

type OptionalKeys<T> = {
	[K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];
type OptionalKeysOnly<T> = Pick<T, OptionalKeys<T>>;
type RequiredKeysOnly<T> = Omit<T, OptionalKeys<T>>;

type SingleOf<T extends any[]> = T[number];

type ActionArgsWithParams<RouteId extends string> = Omit<
	ActionArgs,
	"params"
> & {
	params: RouteParams[RouteId];
};
type LoaderArgsWithParams<RouteId extends string> = Omit<
	LoaderArgs,
	"params"
> & {
	params: RouteParams[RouteId];
};
