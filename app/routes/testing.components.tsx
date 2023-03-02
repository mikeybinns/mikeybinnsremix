import type { LinksFunction } from "@remix-run/node";
import type { ZXCVBNResult } from "zxcvbn";
import { useEffect, useState } from "react";
import zxcvbn from "zxcvbn";
import { Button, links as buttonStyles } from "~/components/Button";
import { FormInputGroupWrapper } from "~/components/FormInputGroupWrapper";
import { FormInputWrapper } from "~/components/FormInputWrapper";
import { Heading, HeadingGroup } from "~/components/Heading";
import { Icon } from "~/components/Icon";
import {
	VisuallyHidden,
	links as visuallyHiddenStyles,
} from "~/components/VisuallyHidden";

export const links: LinksFunction = () => [
	...buttonStyles(),
	...visuallyHiddenStyles(),
];

export default function Component() {
	return (
		<main>
			<HeadingGroup>
				<Heading>Component testing</Heading>
				<HeadingGroup>
					<Heading>Headings test (h2)</Heading>
					<HeadingGroup>
						<Heading>Headings test (h3)</Heading>
						<HeadingGroup>
							<Heading>Headings test (h4)</Heading>
							<HeadingGroup>
								<Heading>Headings test (h5)</Heading>
								<HeadingGroup>
									<Heading>Headings test (h6)</Heading>
									<HeadingGroup>
										<Heading>Headings test (also h6)</Heading>
									</HeadingGroup>
								</HeadingGroup>
							</HeadingGroup>
						</HeadingGroup>
					</HeadingGroup>
					<Heading>Form inputs</Heading>
					<HeadingGroup>
						<Heading>Basic text input, only label</Heading>
						<FormInputWrapper
							label={"Basic text input"}
							input={({ uniqueId, hasError }) => {
								return (
									<input type="text" id={uniqueId} aria-invalid={hasError} />
								);
							}}
						/>
						<Heading>Basic text input, all options</Heading>
						<FormInputWrapper
							label={"Basic text input"}
							helpText={"An example of some input help text / description"}
							error={"An example of an input with an error."}
							uniqueId={"a-custom-unique-id"}
							leadingIcons={<Icon iconName="user" />}
							trailingIcons={<Icon iconName="lock" />}
							input={({ uniqueId, hasError }) => {
								return (
									<input type="text" id={uniqueId} aria-invalid={hasError} />
								);
							}}
						/>
						<Heading>Disabled text input</Heading>
						<FormInputWrapper
							label={"Disabled text input"}
							trailingIcons={<Icon iconName="lock" />}
							input={<input type="text" value="Fixed value" disabled />}
						/>
						<Heading>Select input</Heading>
						<FormInputWrapper
							label={"Select input"}
							input={({ uniqueId, hasError }) => {
								return (
									<select id={uniqueId} aria-invalid={hasError}>
										<option value="">Please select an option</option>
										<option>Aragorn</option>
										<option>Legolas</option>
										<option>Gimli</option>
									</select>
								);
							}}
						/>
						<Heading>Single checkbox with a label</Heading>
						<FormInputGroupWrapper>
							<label>
								<input type="checkbox" />
								This is a single checkbox.
							</label>
						</FormInputGroupWrapper>
						<Heading>Multiple checkboxes</Heading>
						<FormInputGroupWrapper label={"Multiple checkboxes"}>
							<label>
								<input type="checkbox" />
								This is the first checkbox.
							</label>
							<label>
								<input type="checkbox" />
								This is the second checkbox.
							</label>
							<label>
								<input type="checkbox" />
								This is the third checkbox.
							</label>
							<label>
								<input type="checkbox" />
								This is the fourth checkbox.
							</label>
						</FormInputGroupWrapper>
						<Heading>Radio group</Heading>
						<FormInputGroupWrapper label={"Radio group"}>
							<label>
								<input type="radio" name={"radio-test"} />
								This is the first radio input.
							</label>
							<label>
								<input type="radio" name={"radio-test"} />
								This is the second radio input.
							</label>
							<label>
								<input type="radio" name={"radio-test"} />
								This is the third radio input.
							</label>
							<label>
								<input type="radio" name={"radio-test"} />
								This is the fourth radio input.
							</label>
						</FormInputGroupWrapper>
						<FormInputGroupWrapper label={"Full date input"}>
							<div className="day_input">
								<label htmlFor="day_input">Day (DD)</label>
								<input type="number" min="1" max={31} id={`day_input`} />
							</div>
							<div className="month_input">
								<label htmlFor="month_input">Month</label>
								<select id={`month_input`}>
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
							</div>
							<div className="year_input">
								<label htmlFor="year_input">Year (YYYY)</label>
								<input type="number" id={`year_input`} />
							</div>
						</FormInputGroupWrapper>
						<Heading>
							New password input with show/hide and zxcvbn integration
						</Heading>
						{
							// This wrapper pattern is only used to collocate state for testing. Don't use this pattern in production.
							(function PasswordWrapper() {
								const [passwordValue, setPasswordValue] = useState("");
								const [shouldShowPassword, setShouldShowPassword] =
									useState(false);
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
									<FormInputWrapper
										label={"New Password"}
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
																{ZXCVBNResult.feedback.suggestions.map(
																	(suggestion) => {
																		return (
																			<li key={suggestion}>{suggestion}</li>
																		);
																	}
																)}
															</ul>
														</div>
													</div>
												) : null}
											</div>
										}
										leadingIcons={<Icon iconName="user" />}
										trailingIcons={
											shouldShowPassword ? (
												<Button
													onClick={() =>
														setShouldShowPassword(!shouldShowPassword)
													}
													className="hide-if-no-js"
												>
													<Icon iconName="eye-closed" />
													<VisuallyHidden>Hide password</VisuallyHidden>
												</Button>
											) : (
												<Button
													onClick={() =>
														setShouldShowPassword(!shouldShowPassword)
													}
													className="hide-if-no-js"
												>
													<Icon iconName="eye-open" />
													<VisuallyHidden>Show password</VisuallyHidden>
												</Button>
											)
										}
										input={({ uniqueId, hasError }) => {
											return (
												<input
													type={shouldShowPassword ? "text" : "password"}
													onChange={(event) =>
														setPasswordValue(event.target.value)
													}
													id={uniqueId}
													aria-invalid={hasError}
												/>
											);
										}}
									/>
								);
							})()
						}
						<Heading>Password input with show/hide</Heading>
						{
							// This wrapper pattern is only used to collocate state for testing. Don't use this pattern in production.
							(function PasswordWrapper() {
								const [shouldShowPassword, setShouldShowPassword] =
									useState(false);
								return (
									<FormInputWrapper
										label={"Existing Password"}
										error={"Password entered was incorrect"}
										leadingIcons={<Icon iconName="user" />}
										trailingIcons={
											shouldShowPassword ? (
												<Button
													onClick={() =>
														setShouldShowPassword(!shouldShowPassword)
													}
													className="hide-if-no-js"
												>
													<Icon iconName="eye-closed" />
													<VisuallyHidden>Hide password</VisuallyHidden>
												</Button>
											) : (
												<Button
													onClick={() =>
														setShouldShowPassword(!shouldShowPassword)
													}
													className="hide-if-no-js"
												>
													<Icon iconName="eye-open" />
													<VisuallyHidden>Show password</VisuallyHidden>
												</Button>
											)
										}
										input={({ uniqueId, hasError }) => {
											return (
												<input
													type={shouldShowPassword ? "text" : "password"}
													id={uniqueId}
													aria-invalid={hasError}
												/>
											);
										}}
									/>
								);
							})()
						}
					</HeadingGroup>
				</HeadingGroup>
			</HeadingGroup>
		</main>
	);
}
Component.displayName = "Component testing route component";
