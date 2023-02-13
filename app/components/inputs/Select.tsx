import type { SelectHTMLAttributes } from "react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Icon } from "~/components/Icon";
import { filterProps } from "~/models/utils";

export type SelectOption = {
	label: string;
	value?: string;
};
type SelectCustomProps = {
	label?: string | JSX.Element | false;
	leadingIcon?: JSX.Element;
	options: SelectOption[] | Record<string, SelectOption[]>;
	error?: string | JSX.Element;
	labelSuffix?: boolean;
};
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
	name: string;
} & SelectCustomProps;

function isSelectInvalid(
	value: string,
	options: SelectOption[] | Record<string, SelectOption[]>,
	required: boolean | undefined
) {
	if (required === true && value === "") {
		return "This field is required.";
	}
	if (!Array.isArray(options)) {
		options = Object.values(options).flat(1);
	}
	if (
		!options
			.map((option) => {
				return option.value ?? option.label;
			})
			.includes(value)
	) {
		return "Selected value is invalid, please refresh and try again.";
	}
	return false;
}

export function SelectInput(props: SelectProps) {
	let {
		id,
		name,
		className,
		required,
		label,
		leadingIcon,
		options,
		defaultValue,
		error,
		labelSuffix,
	} = props;
	id = id ? id : uuidv4();
	labelSuffix = labelSuffix === false ? false : true;
	const [validationError, setValidationError] = useState(error);
	let defaultValueObject: SelectOption = {
		value: "",
		label: "Choose an option.",
	};
	if (Array.isArray(options)) {
		const foundOption = options.find((option) => option.value === defaultValue);
		if (foundOption) {
			defaultValueObject = foundOption;
		}
	} else {
		Object.values(options).forEach((group) => {
			const foundOption = group.find((option) => option.value === defaultValue);
			if (foundOption) {
				defaultValueObject = foundOption;
			}
		});
	}

	label =
		label ?? name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
	let className_obj = className?.split(" ") ?? [];
	let wrapperClassName = ["field_wrapper", "has_trailing_icon"];
	className_obj.forEach((className) => {
		wrapperClassName.push(`${className}_wrapper`);
	});
	if (required) {
		wrapperClassName.push(`required_field`);
	}
	if (leadingIcon) {
		wrapperClassName.push(`has_leading_icon`);
	}
	if (error) {
		wrapperClassName.push(`has_error`);
	}
	if (!labelSuffix) {
		wrapperClassName.push(`no_label_suffix`);
	}

	useEffect(() => {
		setValidationError(error);
	}, [error]);

	const selectOnlyProps = filterProps<keyof SelectCustomProps | "className">(
		props,
		["className", "label", "leadingIcon", "options", "error", "labelSuffix"]
	);

	return (
		<>
			<div className={wrapperClassName.join(" ")}>
				<div className="label_wrapper mb-2.5">
					{label !== false ? (
						<label htmlFor={id} className="field_label">
							{label}
						</label>
					) : null}
					{validationError ? (
						<p id={`${id}-error`} className="validation_error">
							{validationError}
						</p>
					) : null}
				</div>
				<div className="input_wrapper">
					{leadingIcon ? (
						<div className="leading_icon">{leadingIcon}</div>
					) : null}
					<select
						className="single_line_input select_fallback_input cursor-pointer"
						defaultValue={defaultValueObject.value ?? defaultValueObject.label}
						{...selectOnlyProps}
						aria-invalid={validationError ? true : undefined}
						aria-describedby={`${id}-error`}
						onBlur={(event) => {
							const isSelectInvalidResult = isSelectInvalid(
								event.target.value,
								options,
								required
							);
							setValidationError(
								isSelectInvalidResult === false
									? undefined
									: isSelectInvalidResult
							);
							if (selectOnlyProps.onBlur) {
								selectOnlyProps.onBlur(event);
							}
						}}
					>
						{Array.isArray(options)
							? options.map((option) => {
									let value = option.value ?? option.label;
									return (
										<option key={value} value={value}>
											{option.label}
										</option>
									);
							  })
							: Object.entries(options).map(([groupName, groupOptions]) => {
									return (
										<optgroup label={groupName} key={groupName}>
											{groupOptions.map((option) => {
												let value = option.value ?? option.label;
												return (
													<option key={value} value={value}>
														{option.label}
													</option>
												);
											})}
										</optgroup>
									);
							  })}
					</select>
					<div className="trailing_icon select_dropdown_arrow pointer-events-none">
						<Icon name="ChevronDown" />
					</div>
				</div>
			</div>
		</>
	);
}
