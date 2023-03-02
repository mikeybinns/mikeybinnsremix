export function FormInputGroupWrapper({
	label,
	error,
	helpText,
	children,
}: {
	label?: string | JSX.Element | undefined;
	error?: string | JSX.Element | undefined;
	helpText?: string | JSX.Element | undefined;
	children: React.ReactNode;
}) {
	return (
		<fieldset className="field-group">
			{label !== undefined ? <legend>{label}</legend> : null}
			{helpText !== undefined ? (
				<div className="help_text">{helpText}</div>
			) : null}
			{error !== undefined ? (
				<div className="validation_error">{error}</div>
			) : null}
			<div className="input-wrapper">{children}</div>
		</fieldset>
	);
}
