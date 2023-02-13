import type { ForwardedRef, InputHTMLAttributes } from "react";
import type { ZXCVBNResult } from "zxcvbn";
import { useState, useEffect, forwardRef } from "react";
import zxcvbn from "zxcvbn";
import { Icon } from "~/components/Icon";
import { filterProps } from "~/models/utils";
type PasswordFieldCustomProps = {
	label?: string | JSX.Element | false;
	new_password: boolean;
	leadingIcon?: JSX.Element;
	error?: string | JSX.Element;
	isInvalid: CallableFunction;
	labelSuffix?: boolean;
};
type PasswordFieldProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"type" | "autoComplete"
> & {
	name: string;
} & PasswordFieldCustomProps;
export const PasswordInput = forwardRef(function PasswordInput(
	props: PasswordFieldProps,
	ref: ForwardedRef<HTMLInputElement>
) {
	let {
		name,
		className,
		id,
		required,
		label,
		new_password,
		leadingIcon,
		error,
		isInvalid,
		disabled,
		labelSuffix,
	} = props;
	labelSuffix = labelSuffix === false ? false : true;
	const [validationError, setValidationError] = useState(error);
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
	if (disabled) {
		wrapperClassName.push(`disabled_field`);
	}
	if (!labelSuffix || disabled) {
		wrapperClassName.push(`no_label_suffix`);
	}

	let input_props: InputHTMLAttributes<HTMLInputElement> = filterProps<
		keyof PasswordFieldCustomProps
	>(props, [
		"label",
		"leadingIcon",
		"new_password",
		"error",
		"isInvalid",
		"labelSuffix",
	]);
	const [passwordValue, setPasswordValue] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [ZXCVBNResult, setZXCVBNResult] = useState<ZXCVBNResult>({
		calc_time: 2,
		crack_times_display: {
			offline_fast_hashing_1e10_per_second: "less than a second",
			offline_slow_hashing_1e4_per_second: "less than a second",
			online_no_throttling_10_per_second: "less than a second",
			online_throttling_100_per_hour: "36 seconds",
		},
		crack_times_seconds: {
			offline_fast_hashing_1e10_per_second: 1e-10,
			offline_slow_hashing_1e4_per_second: 0.0001,
			online_no_throttling_10_per_second: 0.1,
			online_throttling_100_per_hour: 36,
		},
		feedback: {
			warning: "",
			suggestions: [
				"Use a few words, avoid common phrases",
				"No need for symbols, digits, or uppercase letters",
			],
		},
		guesses: 1,
		guesses_log10: 0,
		score: 0,
		sequence: [],
	});

	useEffect(() => {
		setZXCVBNResult(zxcvbn(passwordValue));
	}, [passwordValue]);

	useEffect(() => {
		setValidationError(error);
	}, [error]);

	return (
		<>
			<div className={wrapperClassName.join(" ")}>
				<div className="label_wrapper">
					{label !== false ? (
						<label htmlFor={id} className="field_label">
							{label}
						</label>
					) : null}
					{validationError ? (
						<p className="validation_error">{validationError}</p>
					) : null}
				</div>
				<div className="input_wrapper">
					{leadingIcon ? (
						<div className="leading_icon">{leadingIcon}</div>
					) : null}
					<input
						type={showPassword ? "text" : "password"}
						onChange={(event) => setPasswordValue(event.target.value)}
						autoComplete={new_password ? "new-password" : "current-password"}
						{...input_props}
						ref={ref}
						onBlur={(event) => {
							setValidationError(isInvalid(event.target.value));
							if (input_props.onBlur) {
								input_props.onBlur(event);
							}
						}}
					/>
					{showPassword ? (
						<div className="trailing_icon">
							<Icon
								name="PasswordShown"
								onClick={() => setShowPassword(!showPassword)}
								className="hide-if-no-js"
							/>
						</div>
					) : (
						<div className="trailing_icon">
							<Icon
								name="PasswordHidden"
								onClick={() => setShowPassword(!showPassword)}
								className="hide-if-no-js"
							/>
						</div>
					)}
				</div>
				{new_password ? (
					<div className="password_strength_information hide-if-no-js">
						<meter
							min={-1}
							max={4}
							low={2}
							high={3}
							value={passwordValue === "" ? -1 : ZXCVBNResult.score}
							optimum={3.99}
						></meter>
						{passwordValue.length > 0 && ZXCVBNResult.score <= 2 ? (
							<div>
								{ZXCVBNResult.feedback.warning !== "" ? (
									<>
										<div>
											<strong className="text-14-22 font-sans-thick text-no">
												Warning
											</strong>
											<p className="t_meta">{ZXCVBNResult.feedback.warning}</p>
										</div>
									</>
								) : null}
								<div className="">
									<strong className="text-14-22 font-sans-thick text-no">
										Password is weak
									</strong>
									<ul className="suggestion_list t_meta">
										{ZXCVBNResult.feedback.suggestions.map((suggestion) => {
											return <li key={suggestion}>{suggestion}</li>;
										})}
									</ul>
								</div>
							</div>
						) : null}
					</div>
				) : null}
			</div>
		</>
	);
});
