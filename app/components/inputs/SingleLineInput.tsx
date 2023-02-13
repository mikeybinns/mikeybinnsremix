import type { ForwardedRef, InputHTMLAttributes } from "react";
import { useState, useEffect, forwardRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Icon } from "~/components/Icon";
import { filterProps } from "~/models/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label: string | JSX.Element | false;
	leadingIcon?: JSX.Element;
	trailingIcon?: JSX.Element;
	disabledTrailingIcon?: JSX.Element;
	error?: string | JSX.Element;
	isInvalid: CallableFunction;
	inline?: boolean;
}

export const Input = forwardRef(function Input(
	props: InputProps,
	ref: ForwardedRef<HTMLInputElement>
) {
	let {
		className,
		id,
		required,
		label,
		leadingIcon,
		trailingIcon,
		disabledTrailingIcon,
		error,
		isInvalid,
		disabled,
		inline,
	} = props;
	const [validationError, setValidationError] = useState(error);
	useEffect(() => {
		setValidationError(error);
	}, [error]);
	if (props.type?.toLowerCase() === "datetime") {
		console.error(
			"Inputs with the type datetime are obsolete. Use datetime-local instead."
		);
		return null;
	}
	if (props.type?.toLowerCase() === "hidden") {
		console.error(
			"Inputs with the type hidden are meant to be invisible. Using this component goes against that usage. Use a normal input element instead."
		);
		return null;
	}
	if (props.type?.toLowerCase() === "image") {
		console.error(
			"Inputs with the type image are not recommended or supported by this element. Use Button component and CSS instead, or if you must use input type image, use a normal input element."
		);
		return null;
	}
	if (props.type?.toLowerCase() === "color") {
		console.error(
			"Inputs with the type color are not supported by this element. Use a normal input element instead."
		);
		return null;
	}
	if (
		props.type?.toLowerCase() === "submit" ||
		props.type?.toLowerCase() === "reset"
	) {
		console.error(
			`On this site, you should use the Button with the type ${props.type} instead of inputs.`
		);
		return null;
	}
	trailingIcon = disabled ? (
		disabledTrailingIcon ? (
			disabledTrailingIcon
		) : (
			<Icon aria-hidden name={`Lock`} />
		)
	) : (
		trailingIcon
	);
	id = id ? id : uuidv4();
	let className_obj = className?.split(" ") ?? [];
	let wrapperClassName = ["field_wrapper"];
	className_obj.forEach((className) => {
		wrapperClassName.push(`${className}_wrapper`);
	});
	if (required) {
		wrapperClassName.push(`required_field`);
	}
	if (leadingIcon) {
		wrapperClassName.push(`has_leading_icon`);
	}
	if (trailingIcon) {
		wrapperClassName.push(`has_trailing_icon`);
	}
	if (disabled) {
		wrapperClassName.push(`disabled_field`);
	}
	if (validationError) {
		wrapperClassName.push(`has_error`);
	}
	if (inline) {
		wrapperClassName.push(
			`flex flex-row-reverse justify-end mb-5 items-center`
		);
	}
	let input_props: InputHTMLAttributes<HTMLInputElement> = filterProps(props, [
		"label",
		"leadingIcon",
		"trailingIcon",
		"error",
		"isInvalid",
		"inline",
		"disabledTrailingIcon",
	]);

	return (
		<>
			<div className={wrapperClassName.join(" ")}>
				{label ? (
					<div className={`label_wrapper ${inline && "ml-3.5 !mb-0"}`}>
						<label htmlFor={id} className={`field_label ${inline && "t_meta"}`}>
							{label}
						</label>
					</div>
				) : null}
				<div className="input_wrapper">
					{leadingIcon ? (
						<div className="leading_icon">{leadingIcon}</div>
					) : null}
					<input
						id={id}
						{...input_props}
						ref={ref}
						aria-invalid={validationError ? true : undefined}
						aria-describedby={`${id}-error`}
						onBlur={(event) => {
							setValidationError(isInvalid(event.target.value));
							if (input_props.onBlur) {
								input_props.onBlur(event);
							}
						}}
					/>
					{trailingIcon ? (
						<div className="trailing_icon">{trailingIcon}</div>
					) : null}
				</div>
				{validationError ? (
					<p id={`${id}-error`} className="validation_error">
						{validationError}
					</p>
				) : null}
			</div>
		</>
	);
});
