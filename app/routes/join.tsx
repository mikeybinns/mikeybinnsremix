import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import type { ErrorsFromValues } from "~/models/forms";
import type { OneOfThemes } from "~/models/teams";
import {
	unstable_composeUploadHandlers,
	unstable_createMemoryUploadHandler,
	unstable_parseMultipartFormData,
	json,
	redirect,
} from "@remix-run/node";
import {
	Form,
	useActionData,
	useSearchParams,
	useTransition as useNavigation,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/Button";
import { Hyperlink } from "~/components/Hyperlink";
import { CloudinaryImage, GravatarOrDefaultImage } from "~/components/Image";
import { PasswordInput } from "~/components/inputs/Password";
import { RadioGroup } from "~/components/inputs/RadioGroup";
import { SelectInput } from "~/components/inputs/Select";
import { Input } from "~/components/inputs/SingleLineInput";
import { DEFAULT_READING_SPEED } from "~/models/reading";
import {
	isValidTeamTheme,
	defaultTeamTheme,
	teamNamesByTheme,
	allTeamThemeOptions,
} from "~/models/teams";
import { createUser, getUserByEmail } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/models/utils";
import { uploadImageToCloudinary } from "~/services/cloudinary.server";
import { getUserId, createUserSession } from "~/session.server";

type JoinFormValues = {
	fullName: string;
	email: string;
	password: string;
	imageType: "default" | "custom";
	imageURL: string;
	teamTheme: OneOfThemes;
	teamNumber: 0 | 1 | 2;
};

export const meta: MetaFunction = () => {
	return {
		title: "Sign Up",
	};
};

export async function action({ request }: ActionArgs) {
	let formData = await request.clone().formData();
	const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

	const validatedResult = await validateJoinForm(formData);

	if (!resultIsValid(validatedResult)) {
		return json(
			{ errors: validatedResult.errors, values: Object.fromEntries(formData) },
			{ status: 400 }
		);
	}

	const { validatedFormData } = validatedResult;

	let validatedImageURL: string | undefined = undefined;
	if (validatedFormData.imageType === "custom") {
		// Validate file uploads separately due to Cloudinary API limits.
		const uploadHandler = unstable_composeUploadHandlers(
			async ({ name, contentType, data }) => {
				if (name !== "imageFile" || !contentType.startsWith("image")) {
					return undefined;
				}
				const uploadedImage = await uploadImageToCloudinary(data);
				return uploadedImage.secure_url;
			},
			// fallback to memory for everything else
			unstable_createMemoryUploadHandler()
		);

		formData = await unstable_parseMultipartFormData(request, uploadHandler);
		const imageURL = formData.get("imageURL")?.toString();
		if (!imageURL) {
			const errors: ErrorsFromValues<JoinFormValues> = {
				exist: true,
				imageURL: "Failed to upload your custom image.",
			};
			return json(
				{
					errors,
					values: Object.fromEntries(formData),
				},
				{ status: 400 }
			);
		} else {
			validatedImageURL = imageURL;
		}
	}

	const user = await createUser({
		name: validatedFormData.fullName,
		email: validatedFormData.email,
		imageURL: validatedImageURL ?? "",
		password: validatedFormData.password,
		readingSpeed: DEFAULT_READING_SPEED,
		teamNumber: validatedFormData.teamNumber,
		teamNameTheme: validatedFormData.teamTheme,
	});

	return createUserSession({
		request,
		userId: user.id,
		remember: false,
		redirectTo,
	});
}

export async function loader({ request }: LoaderArgs) {
	const searchParams = new URL(request.url).searchParams;
	const userId = await getUserId(request);

	if (userId) {
		return redirect(safeRedirect(searchParams.get("redirectTo"), "/"));
	}

	return json({});
}

export default function Component() {
	const [searchParams] = useSearchParams();
	const redirectTo = searchParams.get("redirectTo") ?? undefined;
	const actionData = useActionData<typeof action>();
	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const navigation = useNavigation();

	const [imageTypeSelected, setImageTypeSelected] = useState(
		typeof actionData?.values.imageType === "string"
			? actionData.values.imageType
			: "default"
	);
	const [selectedTeamTheme, setSelectedTeamTheme] =
		useState<OneOfThemes>("colours");

	useEffect(() => {
		if (actionData?.errors?.fullName) {
			nameRef.current?.focus();
		} else if (actionData?.errors?.email) {
			emailRef.current?.focus();
		} else if (actionData?.errors?.password) {
			passwordRef.current?.focus();
		}
	}, [actionData]);

	return (
		<main>
			<Form method="post">
				<Input
					ref={nameRef}
					name={"fullName"}
					id={"full-name"}
					label={"Full name"}
					isInvalid={() => false}
					required={true}
					error={actionData?.errors?.fullName}
					type="text"
					autoComplete="name"
				/>
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
					new_password={true}
					required={true}
					error={actionData?.errors?.password}
				/>

				<RadioGroup
					label={"Profile image type"}
					name={"imageType"}
					defaultValue={"default"}
					inputs={[
						{
							id: "default-image-radio",
							labelContent: <GravatarOrDefaultImage />,
							value: "default",
						},
						{
							id: "custom-image-radio",
							labelContent: <CloudinaryImage name={"custom-image"} />,
							value: "custom",
						},
					]}
					externalState={[imageTypeSelected, setImageTypeSelected]}
				/>

				{imageTypeSelected === "custom" ? (
					<Input
						name={"imageFile"}
						id={"imageFile"}
						label={"Custom image upload"}
						isInvalid={() => false}
						required={true}
						type="file"
						accept="image/*"
						error={actionData?.errors?.imageURL}
					/>
				) : null}

				<SelectInput
					name={"teamTheme"}
					label={"Team theme"}
					options={allTeamThemeOptions}
					defaultValue={defaultTeamTheme}
					onChange={(event) => {
						if (isValidTeamTheme(event.target.value)) {
							setSelectedTeamTheme(event.target.value);
						}
					}}
				/>

				<RadioGroup
					label={"Pick a team"}
					name={"teamNumber"}
					defaultValue={"0"}
					inputs={[
						{
							id: "team-0",
							labelContent: teamNamesByTheme[selectedTeamTheme][0],
							value: "0",
						},
						{
							id: "team-1",
							labelContent: teamNamesByTheme[selectedTeamTheme][1],
							value: "1",
						},
						{
							id: "team-2",
							labelContent: teamNamesByTheme[selectedTeamTheme][2],
							value: "2",
						},
					]}
				/>

				<input type="hidden" name="redirectTo" value={redirectTo} />
				<Button
					type="submit"
					disabled={navigation.type !== "idle"}
					className={`form-submit-button${
						navigation.type !== "idle" ? " disabled" : ""
					}`}
				>
					Create Account
				</Button>
				<div className="login-hint">
					Already have an account?{" "}
					<Hyperlink
						to={{
							pathname: "/login",
							search: searchParams.toString(),
						}}
					>
						Log in
					</Hyperlink>
				</div>
			</Form>
		</main>
	);
}
Component.displayName = "Join page route component";

function isValidImageType(
	imageType: string | undefined
): imageType is "default" | "custom" {
	return (
		typeof imageType === "string" && ["default", "custom"].includes(imageType)
	);
}

function isValidTeamNumber(
	teamNumber: string | undefined
): teamNumber is "0" | "1" | "2" {
	return teamNumber === "0" || teamNumber === "1" || teamNumber === "2";
}

async function validateJoinForm(formData: FormData) {
	const errors: ErrorsFromValues<JoinFormValues> = { exist: false };

	const fullName = formData.get("fullName")?.toString();
	if (typeof fullName !== "string" || fullName.length === 0) {
		errors.exist = true;
		errors.password = "Full name is required";
	}

	const email = formData.get("email")?.toString();
	if (!validateEmail(email)) {
		errors.exist = true;
		errors.email = "Email is invalid";
	} else {
		const existingUser = await getUserByEmail(email);
		if (existingUser) {
			errors.exist = true;
			errors.email = "A user already exists with this email";
		}
	}

	const password = formData.get("password")?.toString();
	if (typeof password !== "string" || password.length === 0) {
		errors.exist = true;
		errors.password = "Password is required";
	} else {
		if (password.length < 8) {
			errors.exist = true;
			errors.password = "Password is too short";
		}
	}

	const imageType = formData.get("imageType")?.toString();
	let validImageType: JoinFormValues["imageType"] | undefined = undefined;
	if (!isValidImageType(imageType)) {
		errors.exist = true;
		errors.imageType = "Your image type is invalid.";
	} else {
		validImageType = imageType;
	}

	const teamTheme = formData.get("teamTheme")?.toString();
	let validTeamTheme: JoinFormValues["teamTheme"] | undefined = undefined;
	if (teamTheme === undefined || !isValidTeamTheme(teamTheme)) {
		validTeamTheme = defaultTeamTheme;
	} else {
		validTeamTheme = teamTheme;
	}

	const teamNumber = formData.get("teamNumber")?.toString();
	let validTeamNumber: JoinFormValues["teamNumber"] | undefined = undefined;
	if (isValidTeamNumber(teamNumber)) {
		if (teamNumber === "0") {
			validTeamNumber = 0;
		} else if (teamNumber === "1") {
			validTeamNumber = 1;
		} else {
			validTeamNumber = 2;
		}
	}
	const validatedFormData: Partial<JoinFormValues> = {
		fullName,
		email,
		password,
		imageType: validImageType,
		teamTheme: validTeamTheme,
		teamNumber: validTeamNumber,
	};
	if (errors.exist) {
		return { errors, validatedFormData } as {
			errors: ErrorsFromValues<JoinFormValues> & { exist: true };
			validatedFormData: Partial<JoinFormValues>;
		};
	}
	return { errors, validatedFormData } as {
		errors: { exist: false };
		validatedFormData: JoinFormValues;
	};
}

function resultIsValid(
	validatedResult: Awaited<ReturnType<typeof validateJoinForm>>
): validatedResult is {
	errors: { exist: false };
	validatedFormData: JoinFormValues;
} {
	return validatedResult.errors.exist === false;
}
