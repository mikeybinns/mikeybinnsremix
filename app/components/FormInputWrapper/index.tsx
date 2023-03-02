import { useId } from "react";

export function FormInputWrapper({
	uniqueId,
	label,
	leadingIcons,
	trailingIcons,
	error,
	helpText,
	input,
	isRequired = false,
}: {
	uniqueId?: string | undefined;
	label: string | JSX.Element;
	leadingIcons?: JSX.Element | undefined;
	trailingIcons?: JSX.Element | undefined;
	error?: string | JSX.Element | undefined;
	helpText?: string | JSX.Element | undefined;
	isRequired?: boolean;
	input:
		| React.ReactNode
		| (({
				uniqueId,
				hasError,
				isRequired,
		  }: {
				uniqueId: string;
				hasError: boolean;
				isRequired: boolean;
		  }) => React.ReactNode);
}) {
	const generatedId = useId();
	const id = uniqueId !== undefined ? uniqueId : generatedId;
	return (
		<div className="field">
			<label htmlFor={id}>
				{label}
				{isRequired ? " (required)" : ""}
			</label>
			<div className="input-wrapper">
				{leadingIcons !== undefined ? (
					<div className="leading_icon">{leadingIcons}</div>
				) : null}
				{typeof input === "function"
					? input({ uniqueId: id, hasError: error === undefined, isRequired })
					: input}
				{trailingIcons !== undefined ? (
					<div className="trailing_icon">{trailingIcons}</div>
				) : null}
			</div>
			{helpText !== undefined ? (
				<div className="help_text">{helpText}</div>
			) : null}
			{error !== undefined ? (
				<div className="validation_error">{error}</div>
			) : null}
		</div>
	);
}
