import type { InputHTMLAttributes } from "react";
import { useState, useEffect } from "react";
import { filterProps } from "~/models/utils";

type AcceptanceCheckboxCustomProps = {
	label: string | JSX.Element | false;
	checkboxLabel: string | JSX.Element | false;
	error?: string | JSX.Element;
	labelSuffix?: boolean;
	isInvalid: CallableFunction;
	labelClassName?: string;
};
type AcceptanceCheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	required?: boolean;
} & AcceptanceCheckboxCustomProps;

export function AcceptanceCheckbox(props: AcceptanceCheckboxProps) {
	let {
		className,
		required,
		label,
		error,
		labelSuffix,
		id,
		isInvalid,
		checkboxLabel,
		labelClassName,
	} = props;
	const [validationError, setValidationError] = useState(error);
	labelSuffix = labelSuffix === false ? false : true;
	let className_obj = className?.split(" ") ?? [];
	let groupWrapperClassName = ["checkbox_group_wrapper"];
	let wrapperClassName = ["checkbox_wrapper"];
	className_obj.forEach((className) => {
		groupWrapperClassName.push(`${className}_group_wrapper`);
		wrapperClassName.push(`${className}_wrapper`);
	});
	if (required) {
		groupWrapperClassName.push(`required_field`);
	}
	if (error) {
		groupWrapperClassName.push(`has_error`);
	}
	if (!labelSuffix) {
		groupWrapperClassName.push(`no_label_suffix`);
	}
	let input_props: InputHTMLAttributes<HTMLInputElement> = filterProps<
		keyof AcceptanceCheckboxCustomProps
	>(props, [
		"label",
		"error",
		"isInvalid",
		"checkboxLabel",
		"labelSuffix",
		"labelClassName",
	]);
	input_props.className = `checkbox${className ? ` ${className}` : ""}`;

	useEffect(() => {
		setValidationError(error);
	}, [error]);

	return (
		<>
			<div className={groupWrapperClassName.join(" ")}>
				<div className="label_wrapper">
					{label !== false ? (
						<p className="field_label t_meta !text-content">{label}</p>
					) : null}
					{validationError ? (
						<p className="validation_error mb-2 ml-[-40px]">
							{validationError}
						</p>
					) : null}
				</div>
				<div className="input_wrapper">
					<label
						htmlFor={id}
						className={wrapperClassName.join(" ") + " " + labelClassName}
					>
						<input
							type="checkbox"
							{...input_props}
							onChange={(event) =>
								setValidationError(isInvalid(event.target.checked))
							}
						/>
						<span>{checkboxLabel}</span>
					</label>
				</div>
			</div>
		</>
	);
}
