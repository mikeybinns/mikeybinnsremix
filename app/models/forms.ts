import type { Fetcher, useTransition as useNavigation } from "@remix-run/react";

export type ErrorsFromValues<
	Values extends Record<Exclude<string, "exist">, any>
> = {
	[Property in keyof Values]?: Values[Property] extends Record<string, any>
		? ErrorsFromValues<Values[Property]>
		: string;
} & {
	exist: boolean;
	generic?: string;
};

type ValidFormSubmission<FormSubmissionValues> = {
	errors: { exist: boolean };
	values?: FormSubmissionValues;
};

type InvalidFormSubmissionType<
	FormSubmissionValues extends Record<string, any>,
	FormSubmissionErrors extends Record<
		string,
		any
	> = ErrorsFromValues<FormSubmissionValues>
> = {
	errors: {
		[Property in keyof FormSubmissionErrors]: Property extends "exist"
			? boolean
			: string;
	};
	values: Partial<FormSubmissionValues>;
};

type Transition = ReturnType<typeof useNavigation>;

export function wasSubmitted<
	FormSubmissionValues extends Record<Exclude<string, "exist">, any>,
	FormSubmissionErrors extends Record<
		string,
		any
	> = ErrorsFromValues<FormSubmissionValues>,
	FetcherOrTransition extends Transition | Fetcher = Transition
>(
	type: FetcherOrTransition["type"],
	data?:
		| InvalidFormSubmissionType<FormSubmissionValues, FormSubmissionErrors>
		| ValidFormSubmission<FormSubmissionValues>
): data is
	| InvalidFormSubmissionType<FormSubmissionValues, FormSubmissionErrors>
	| ValidFormSubmission<FormSubmissionValues> {
	return type === "idle" && data !== undefined;
}

export function hasErrors<
	FormSubmissionValues extends Record<Exclude<string, "exist">, any>,
	FormSubmissionErrors extends Record<
		string,
		any
	> = ErrorsFromValues<FormSubmissionValues>,
	FetcherOrTransition extends Transition | Fetcher = Transition
>(
	type: FetcherOrTransition["type"],
	data?:
		| InvalidFormSubmissionType<FormSubmissionValues, FormSubmissionErrors>
		| ValidFormSubmission<FormSubmissionValues>
): data is InvalidFormSubmissionType<
	FormSubmissionValues,
	FormSubmissionErrors
> {
	return (
		wasSubmitted<
			FormSubmissionValues,
			FormSubmissionErrors,
			FetcherOrTransition
		>(type, data) && !!data.errors.exist
	);
}
