import type { LinksFunction } from "@remix-run/node";
import type { InputHTMLAttributes } from "react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import {
	VisuallyHidden,
	links as visuallyHiddenLinks,
} from "~/components/VisuallyHidden";
import { filterProps } from "~/models/utils";

export const links: LinksFunction = () => [...visuallyHiddenLinks()];

type QuantityInputCustomProps = {
	externalState?: [number, React.Dispatch<React.SetStateAction<number>>];
	onQuantityChange?: (quantity: number) => void;
};
type QuantityInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> &
	QuantityInputCustomProps;
export function QuantityInput(props: QuantityInputProps) {
	let [quantity, setQuantity] = useState(
		props.defaultValue ? Number(props.defaultValue) : 0
	);
	let [externalStateValue, externalStateDispatch] = props.externalState ?? [
		0,
		() => {},
	];
	let input_props: Omit<
		InputHTMLAttributes<HTMLInputElement>,
		"type" | "defaultValue"
	> = filterProps<keyof QuantityInputCustomProps | "defaultValue">(props, [
		"defaultValue",
		"onQuantityChange",
		"externalState",
	]);

	function getNewQuantity(new_quantity: number) {
		if (props.min !== undefined && new_quantity < Number(props.min)) {
			// Don't allow the quantity to go below the minimum value.
			new_quantity = Number(props.min);
		} else if (props.max !== undefined && new_quantity > Number(props.max)) {
			// Don't allow the quantity to go above the maximum value.
			new_quantity = Number(props.max);
		}
		return new_quantity;
	}

	return (
		<div className="input_wrapper input_wrapper_quantity">
			<Button
				type="button"
				className="!rounded-r-none !outline-offset-[-4px]"
				disabled={
					(props.externalState ? externalStateValue : quantity) <=
					Number(props.min)
				}
				onClick={() => {
					let new_quantity = getNewQuantity(
						(props.externalState ? externalStateValue : quantity) - 1
					);
					props.externalState
						? externalStateDispatch(new_quantity)
						: setQuantity(new_quantity);
					if (props.onQuantityChange) {
						props.onQuantityChange(new_quantity);
					}
				}}
			>
				<Icon
					name="Minus"
					className={
						(props.externalState ? externalStateValue : quantity) <=
						Number(props.min)
							? "text-content"
							: ""
					}
					aria-hidden
				/>
				<VisuallyHidden>Decrease quantity</VisuallyHidden>
			</Button>
			<input
				className="t_p-16"
				type="number"
				value={props.externalState ? externalStateValue : quantity}
				{...input_props}
				onChange={(event) => {
					let new_quantity = getNewQuantity(Number(event.target.value));
					props.externalState
						? externalStateDispatch(new_quantity)
						: setQuantity(new_quantity);
					if (props.onChange) {
						props.onChange(event);
					}
					if (props.onQuantityChange) {
						props.onQuantityChange(new_quantity);
					}
				}}
			/>
			<Button
				type="button"
				className="!rounded-l-none !outline-offset-[-4px]"
				disabled={
					(props.externalState ? externalStateValue : quantity) >=
					Number(props.max)
				}
				onClick={() => {
					let new_quantity = getNewQuantity(
						(props.externalState ? externalStateValue : quantity) + 1
					);
					props.externalState
						? externalStateDispatch(new_quantity)
						: setQuantity(new_quantity);
					if (props.onQuantityChange) {
						props.onQuantityChange(new_quantity);
					}
				}}
			>
				<Icon
					name="Plus"
					className={
						(props.externalState ? externalStateValue : quantity) >=
						Number(props.max)
							? "text-content"
							: ""
					}
					aria-hidden
				/>
				<VisuallyHidden>Increase quantity</VisuallyHidden>
			</Button>
		</div>
	);
}
interface QuantityInputWithLabelProps {
	className?: string;
	required?: boolean;
	label: string | JSX.Element | false;
	error?: string | false;
	isInvalid: (quantity: number) => string | false;
	quantity_props?: QuantityInputProps;
}

export function QuantityInputWithLabel(props: QuantityInputWithLabelProps) {
	let {
		className,
		required,
		label,
		error,
		quantity_props: passed_quantity_props,
		isInvalid,
	} = props;
	const [validationError, setValidationError] = useState<
		string | false | undefined
	>(error);
	useEffect(() => {
		setValidationError(error);
	}, [error]);

	let quantity_props =
		passed_quantity_props !== undefined ? { ...passed_quantity_props } : {};

	quantity_props.onQuantityChange = (quantity: number) => {
		setValidationError(isInvalid(quantity));
		if (passed_quantity_props?.onQuantityChange) {
			passed_quantity_props.onQuantityChange(quantity);
		}
	};

	let id = quantity_props?.id ? quantity_props.id : uuidv4();
	let className_obj = className?.split(" ") ?? [];
	let wrapperClassName = ["field_wrapper"];
	className_obj.forEach((className) => {
		wrapperClassName.push(`${className}_wrapper`);
	});
	if (required) {
		wrapperClassName.push(`required_field`);
	}
	if (validationError) {
		wrapperClassName.push(`has_error`);
	}

	return (
		<>
			<div className={wrapperClassName.join(" ")}>
				{label ? (
					<div className="label_wrapper">
						<label htmlFor={id} className="field_label">
							{label}
						</label>
					</div>
				) : null}
				<QuantityInput id={id} {...quantity_props} />
				{validationError ? (
					<p className="validation_error">{validationError}</p>
				) : null}
			</div>
		</>
	);
}
