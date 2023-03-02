import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import type { ZXCVBNResult } from "zxcvbn";
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
import zxcvbn from "zxcvbn";
import { Button } from "~/components/Button";
import { FormInputGroupWrapper } from "~/components/FormInputGroupWrapper";
import { FormInputWrapper } from "~/components/FormInputWrapper";
import { Hyperlink } from "~/components/Hyperlink";
import { Icon } from "~/components/Icon";
import { CloudinaryImage, GravatarOrDefaultImage } from "~/components/Image";
import { VisuallyHidden } from "~/components/VisuallyHidden";
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

export const meta: V2_MetaFunction = () => [
	{
		title: "Sign up",
	},
];

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
		if (imageURL === undefined) {
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

	if (userId !== undefined) {
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
		if (actionData?.errors?.fullName !== undefined) {
			nameRef.current?.focus();
		} else if (actionData?.errors?.email !== undefined) {
			emailRef.current?.focus();
		} else if (actionData?.errors?.password !== undefined) {
			passwordRef.current?.focus();
		}
	}, [actionData]);

	const [passwordValue, setPasswordValue] = useState("");
	const [shouldShowPassword, setShouldShowPassword] = useState(false);
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

	return (
		<main>
			<Form method="post">
				<FormInputWrapper
					label={"Full name"}
					error={actionData?.errors?.fullName}
					isRequired={true}
					input={({ uniqueId, hasError, isRequired }) => {
						return (
							<input
								ref={nameRef}
								type="text"
								name="fullName"
								id={uniqueId}
								aria-invalid={hasError}
								required={isRequired}
								autoComplete="name"
							/>
						);
					}}
				/>
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
					error={
						<div className="password_strength_information hide-if-no-js">
							<meter
								min={-1}
								max={4}
								low={2}
								high={3}
								value={passwordValue === "" ? -1 : ZXCVBNResult.score}
								optimum={3.99}
							/>
							{passwordValue.length > 0 && ZXCVBNResult.score <= 2 ? (
								<div>
									{ZXCVBNResult.feedback.warning !== "" ? (
										<>
											<div>
												<strong>Warning</strong>
												<p>{ZXCVBNResult.feedback.warning}</p>
											</div>
										</>
									) : null}
									<div>
										<strong>Password is weak</strong>
										<ul>
											{ZXCVBNResult.feedback.suggestions.map((suggestion) => {
												return <li key={suggestion}>{suggestion}</li>;
											})}
										</ul>
									</div>
								</div>
							) : null}
						</div>
					}
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
								onChange={(event) => setPasswordValue(event.target.value)}
								id={uniqueId}
								aria-invalid={hasError}
								required={isRequired}
								autoComplete={"new-password"}
							/>
						);
					}}
				/>
				<FormInputGroupWrapper label={"Profile image type"}>
					<label>
						<input
							type="radio"
							name={"imageType"}
							id={"default-image-radio"}
							value="default"
							checked
							onChange={() => setImageTypeSelected("default")}
						/>
						<GravatarOrDefaultImage />
					</label>
					<label>
						<input
							type="radio"
							name={"imageType"}
							id={"custom-image-radio"}
							value="custom"
							onChange={() => setImageTypeSelected("custom")}
						/>
						<CloudinaryImage name={"custom-image"} />
					</label>
				</FormInputGroupWrapper>

				{imageTypeSelected === "custom" ? (
					<FormInputWrapper
						label={"Custom image upload"}
						error={actionData?.errors?.imageURL}
						isRequired={true}
						input={({ uniqueId, hasError, isRequired }) => {
							return (
								<input
									type="file"
									accept="image/*"
									name="imageFile"
									id={uniqueId}
									aria-invalid={hasError}
									required={isRequired}
								/>
							);
						}}
					/>
				) : null}

				<FormInputWrapper
					label={"Team theme"}
					input={({ uniqueId, hasError }) => {
						return (
							<select
								id={uniqueId}
								aria-invalid={hasError}
								name={"teamTheme"}
								onChange={(event) => {
									if (isValidTeamTheme(event.target.value)) {
										setSelectedTeamTheme(event.target.value);
									}
								}}
							>
								{allTeamThemeOptions.map(({ value, label }) => (
									<option
										key={value}
										value={value}
										selected={defaultTeamTheme === value}
									>
										{label}
									</option>
								))}
							</select>
						);
					}}
				/>

				<FormInputGroupWrapper label={"Pick a team"}>
					<label>
						<input
							type="radio"
							name={"teamNumber"}
							id={"team-0"}
							value="0"
							checked
						/>
						{teamNamesByTheme[selectedTeamTheme][0]}
					</label>
					<label>
						<input
							type="radio"
							name={"teamNumber"}
							id={"team-1"}
							value="1"
							checked
						/>
						{teamNamesByTheme[selectedTeamTheme][1]}
					</label>
					<label>
						<input
							type="radio"
							name={"teamNumber"}
							id={"team-2"}
							value="2"
							checked
						/>
						{teamNamesByTheme[selectedTeamTheme][2]}
					</label>
				</FormInputGroupWrapper>

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
