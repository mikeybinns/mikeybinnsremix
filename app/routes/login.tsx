import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import type { ErrorsFromValues } from "~/models/forms";
import { json, redirect } from "@remix-run/node";
import {
	Form,
	useActionData,
	useSearchParams,
	useTransition as useNavigation,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Button } from "~/components/Button";
import { Hyperlink } from "~/components/Hyperlink";
import { AcceptanceCheckbox } from "~/components/inputs/AcceptanceCheckbox";
import { PasswordInput } from "~/components/inputs/Password";
import { Input } from "~/components/inputs/SingleLineInput";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/models/utils";
import { createUserSession, getUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
	const searchParams = new URL(request.url).searchParams;
	const userId = await getUserId(request);

	if (userId) {
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
		if (!email || !password) {
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

export const meta: MetaFunction = () => {
	return {
		title: "Login",
	};
};

export default function Component() {
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirectTo") || "/notes";
	const actionData = useActionData<typeof action>();
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const navigation = useNavigation();

	useEffect(() => {
		if (actionData?.errors?.email) {
			emailRef.current?.focus();
		} else if (actionData?.errors?.password) {
			passwordRef.current?.focus();
		}
	}, [actionData]);

	return (
		<main>
			<Form method="post" className="space-y-6">
				<Input
					ref={emailRef}
					name={"email"}
					id={"email"}
					label={"Email address"}
					isInvalid={() => false}
					required={true}
					error={actionData?.errors?.email}
					type="email"
					autoComplete="email"
				/>
				<PasswordInput
					ref={passwordRef}
					name={"password"}
					id={"password"}
					label={"Password"}
					isInvalid={() => false}
					new_password={false}
					required={true}
					error={actionData?.errors?.password}
				/>
				<AcceptanceCheckbox
					id={"remember"}
					name={"remember"}
					label={"Remember me"}
					checkboxLabel={"Keep me logged in for 7 days"}
					isInvalid={() => false}
					className="remember-me-input"
					required={true}
				/>
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
