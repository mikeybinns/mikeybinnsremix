import type { ForwardedRef, ReactNode } from "react";
import { forwardRef, useState } from "react";

type RadioOption = {
	id: string;
	labelContent: ReactNode;
	value: string;
};
type RadioGroupProps = {
	label: ReactNode;
	name: string;
	defaultValue: string;
	inputs: RadioOption[];
	externalState?: [string, React.Dispatch<React.SetStateAction<string>>];
};

export const RadioGroup = forwardRef(function RadioGroup(
	props: RadioGroupProps,
	ref: ForwardedRef<HTMLInputElement>
) {
	const { defaultValue, inputs, name, label, externalState } = props;
	const [radioValueSelected, setRadioValueSelected] = useState(defaultValue);
	let [externalStateValue, externalStateDispatch] = props.externalState ?? [
		0,
		() => {},
	];

	return (
		<fieldset className="radio-fieldset">
			<legend className="field-label">{label}</legend>
			{inputs.map((input) => {
				return (
					<label key={input.id} htmlFor={input.id}>
						<input
							ref={ref}
							type="radio"
							id={input.id}
							name={name}
							value={input.value}
							onChange={() =>
								externalState
									? externalStateDispatch(input.value)
									: setRadioValueSelected(input.value)
							}
							checked={
								(externalState ? externalStateValue : radioValueSelected) ===
								input.value
							}
						/>
						{input.labelContent}
					</label>
				);
			})}
		</fieldset>
	);
});
