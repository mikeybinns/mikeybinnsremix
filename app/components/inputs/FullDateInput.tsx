import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { useSearchParams } from "@remix-run/react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Icon } from "~/components/Icon";
import { getNumberOfDaysInMonth } from "~/models/utils";

function is_date_invalid(date: number) {
	if (date <= 0) {
		return "Date cannot be less than 1.";
	}
	if (date >= 32) {
		return "Date cannot be more than 31.";
	}
	return false;
}
function is_month_invalid(month: number) {
	if (month < 0 || month > 11) {
		return "The month is not valid. Please make sure you select a month from the list.";
	}
	return false;
}
function is_year_invalid(year: number) {
	if (year.toString().length !== 4) {
		return "The year is not valid. Please double check and try again.";
	}
	return false;
}

type DateInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"defaultValue"
>;
type MonthInputProps = Omit<
	SelectHTMLAttributes<HTMLSelectElement>,
	"defaultValue"
>;
type YearInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"defaultValue"
>;
type FullDateInputProps = {
	label: string | JSX.Element | false;
	fullDateError?: string | false;
	isInvalid: CallableFunction;
	className?: string;
	id?: string;
	required?: boolean;
	disabled?: boolean;
	date_info: {
		error?: string | false;
		label: string | JSX.Element | false;
		props?: DateInputProps;
	};
	month_info: {
		error?: string | false;
		label: string | JSX.Element | false;
		props?: MonthInputProps;
	};
	year_info: {
		error?: string | false;
		label: string | JSX.Element | false;
		props?: YearInputProps;
	};
};
export function DateInput(props: FullDateInputProps) {
	let {
		id,
		className,
		required,
		label,
		fullDateError,
		isInvalid,
		disabled,
		date_info,
		month_info,
		year_info,
	} = props;
	let [searchParams] = useSearchParams();
	const [dateValidationError, setDateValidationError] = useState(
		date_info.error
	);
	const [monthValidationError, setMonthValidationError] = useState(
		month_info.error
	);
	const [yearValidationError, setYearValidationError] = useState(
		year_info.error
	);
	const [fullYearValidationError, setFullYearValidationError] =
		useState(fullDateError);
	let className_obj = className?.split(" ") ?? [];
	let wrapperClassName = ["field_wrapper"];
	className_obj.forEach((className) => {
		wrapperClassName.push(`${className}_wrapper`);
	});
	if (required) {
		wrapperClassName.push(`required_field`);
	}
	if (disabled) {
		wrapperClassName.push(`disabled_field`);
	}
	if (
		dateValidationError ||
		monthValidationError ||
		yearValidationError ||
		fullYearValidationError
	) {
		wrapperClassName.push(`has_error`);
	}
	id = id ? id : uuidv4();

	useEffect(() => {
		// If the field has a name, return either the search param for that name as a number, or undefined.
		let day = date_info.props?.name
			? Number(searchParams.get(`${date_info.props.name}`) ?? undefined) ??
			  undefined
			: undefined;
		let month = month_info.props?.name
			? Number(searchParams.get(`${month_info.props.name}`) ?? undefined) ??
			  undefined
			: undefined;
		let year = year_info.props?.name
			? Number(searchParams.get(`${year_info.props.name}`) ?? undefined) ??
			  undefined
			: undefined;
		if (day && month && year) {
			let date = new Date(year, month, day);
			setFullYearValidationError(isInvalid(date));
		}
	}, [
		searchParams,
		isInvalid,
		date_info.props?.name,
		month_info.props?.name,
		year_info.props?.name,
	]);

	return (
		<>
			<fieldset className={wrapperClassName.join(" ")}>
				{label ? (
					<div className="label_wrapper">
						<legend className="field_label">{label}</legend>
					</div>
				) : null}
				<div className="date_input_wrapper">
					<div className="input_wrapper">
						<label className="t_meta" htmlFor={`${id}_day`}>
							{date_info.label}
						</label>
						<input
							type="number"
							min="1"
							max={
								month_info.props?.name && year_info.props?.name
									? getNumberOfDaysInMonth(
											searchParams.get(month_info.props.name)
												? Number(searchParams.get(month_info.props.name))
												: null,
											searchParams.get(year_info.props.name)
												? Number(searchParams.get(month_info.props.name))
												: null
									  ) ?? "31"
									: "31"
							}
							id={`${id}_day`}
							{...date_info.props}
							onChange={(event) => {
								if (date_info.props?.onChange) {
									date_info.props.onChange(event);
								}
								if (event.target.value === "") {
									return;
								}
								setDateValidationError(
									is_date_invalid(Number(event.target.value))
								);
							}}
						/>
					</div>
					<div className="field_wrapper has_trailing_icon !mt-0">
						<label className="t_meta mb-[12px] block" htmlFor={`${id}_month`}>
							{month_info.label}
						</label>
						<div className="input_wrapper">
							<select
								id={`${id}_month`}
								{...month_info.props}
								onChange={(event) => {
									if (month_info.props?.onChange) {
										month_info.props.onChange(event);
									}
									setMonthValidationError(
										is_month_invalid(Number(event.target.value))
									);
								}}
							>
								<option value={0}>January</option>
								<option value={1}>February</option>
								<option value={2}>March</option>
								<option value={3}>April</option>
								<option value={4}>May</option>
								<option value={5}>June</option>
								<option value={6}>July</option>
								<option value={7}>August</option>
								<option value={8}>September</option>
								<option value={9}>October</option>
								<option value={10}>November</option>
								<option value={11}>December</option>
							</select>
							<div className="trailing_icon select_dropdown_arrow pointer-events-none">
								<Icon name="ChevronDown" />
							</div>
						</div>
					</div>
					<div className="input_wrapper">
						<label className="t_meta" htmlFor={`${id}_year`}>
							{year_info.label}
						</label>
						<input
							type="number"
							id={`${id}_year`}
							{...year_info.props}
							onChange={(event) => {
								if (year_info.props?.onChange) {
									year_info.props.onChange(event);
								}
								setYearValidationError(
									is_year_invalid(Number(event.target.value))
								);
							}}
						/>
					</div>
				</div>
				{dateValidationError ||
				monthValidationError ||
				yearValidationError ||
				fullYearValidationError ? (
					<p className="validation_error mb-2">
						{dateValidationError
							? dateValidationError
							: monthValidationError
							? monthValidationError
							: yearValidationError
							? yearValidationError
							: fullYearValidationError}
					</p>
				) : null}
			</fieldset>
		</>
	);
}
