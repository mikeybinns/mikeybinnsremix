import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import type { ErrorsFromValues } from "~/models/forms";
import { json, redirect } from "@remix-run/node";
import {
	Form,
	useActionData,
	useSearchParams,
	useTransition as useNavigation,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/Button";
import { FormInputGroupWrapper } from "~/components/FormInputGroupWrapper";
import { FormInputWrapper } from "~/components/FormInputWrapper";
import { Hyperlink } from "~/components/Hyperlink";
import { Icon } from "~/components/Icon";
import { VisuallyHidden } from "~/components/VisuallyHidden";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/models/utils";
import { createUserSession, getUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
	const searchParams = new URL(request.url).searchParams;
	const userId = await getUserId(request);

	if (userId !== undefined) {
		return redirect(safeRedirect(searchParams.get("redirectTo"), "/"));
	}
	return json({});
}

type LoginFormValues = {
	email: string;
	password: string;
};

async function validateLoginForm(formData: FormData) {
	const errors: ErrorsFromValues<LoginFormValues> = { exist: false };

	const email = formData.get("email");
	if (!validateEmail(email)) {
		errors.exist = true;
		errors.email = "Email is invalid";
	}

	const password = formData.get("password");
	if (typeof password !== "string" || password.length === 0) {
		errors.exist = true;
		errors.password = "Password is required";
	} else {
		if (password.length < 8) {
			errors.exist = true;
			errors.password = "Password is too short";
		}
	}
	let user = undefined;
	if (!errors.exist) {
		if (email === null || password === null) {
			throw new Error("Validation failure.");
		}
		user = await verifyLogin(email.toString(), password.toString());

		if (!user) {
			errors.exist = true;
			errors.email = "Invalid email or password";
		}
	}

	return { errors, user };
}

export async function action({ request }: ActionArgs) {
	const formData = await request.formData();
	const redirectTo = safeRedirect(formData.get("redirectTo"), "/notes");
	const remember = formData.get("remember");

	const { errors, user } = await validateLoginForm(formData);

	if (errors.exist || !user) {
		return json(
			{ errors, values: Object.fromEntries(formData) },
			{ status: 400 }
		);
	}

	return createUserSession({
		request,
		userId: user.id,
		remember: remember === "on" ? true : false,
		redirectTo,
	});
}

export const meta: V2_MetaFunction = () => [
	{
		title: "Login",
	},
];

export default function Component() {
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirectTo") ?? "/notes";
	const actionData = useActionData<typeof action>();
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const navigation = useNavigation();

	useEffect(() => {
		if (actionData?.errors?.email !== undefined) {
			emailRef.current?.focus();
		} else if (actionData?.errors?.password !== undefined) {
			passwordRef.current?.focus();
		}
	}, [actionData]);

	const [shouldShowPassword, setShouldShowPassword] = useState(false);

	return (
		<main>
			<Form method="post" className="space-y-6">
				<FormInputWrapper
					label={"Email address"}
					error={actionData?.errors?.email}
					isRequired={true}
					input={({ uniqueId, hasError, isRequired }) => {
						return (
							<input
								ref={emailRef}
								type="email"
								name="email"
								id={uniqueId}
								aria-invalid={hasError}
								required={isRequired}
								autoComplete="email"
							/>
						);
					}}
				/>
				<FormInputWrapper
					label={"Password"}
					error={actionData?.errors?.password}
					trailingIcons={
						shouldShowPassword ? (
							<Button
								onClick={() => setShouldShowPassword(!shouldShowPassword)}
								className="hide-if-no-js"
							>
								<Icon iconName="eye-closed" />
								<VisuallyHidden>Hide password</VisuallyHidden>
							</Button>
						) : (
							<Button
								onClick={() => setShouldShowPassword(!shouldShowPassword)}
								className="hide-if-no-js"
							>
								<Icon iconName="eye-open" />
								<VisuallyHidden>Show password</VisuallyHidden>
							</Button>
						)
					}
					input={({ uniqueId, hasError, isRequired }) => {
						return (
							<input
								ref={passwordRef}
								name={"password"}
								type={shouldShowPassword ? "text" : "password"}
								id={uniqueId}
								aria-invalid={hasError}
								required={isRequired}
								autoComplete={"current-password"}
							/>
						);
					}}
				/>
				<FormInputGroupWrapper label={"Remember me"}>
					<label>
						<input
							type="checkbox"
							className="remember-me-input"
							name="remember"
							required
						/>
						Keep me logged in for 7 days
					</label>
				</FormInputGroupWrapper>
				<input type="hidden" name="redirectTo" value={redirectTo} />
				<Button
					type="submit"
					disabled={navigation.type !== "idle"}
					className={`form-submit-button ${
						navigation.type !== "idle" ? "disabled" : ""
					}`}
				>
					Log in
				</Button>
				<div className="sign-up-hint">
					Don't have an account?{" "}
					<Hyperlink
						to={{
							pathname: "/join",
							search: searchParams.toString(),
						}}
					>
						Sign up
					</Hyperlink>
				</div>
			</Form>
		</main>
	);
}
Component.displayName = "Login page route component";
