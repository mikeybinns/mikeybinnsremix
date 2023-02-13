/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: [
		"@remix-run/eslint-config",
		"@remix-run/eslint-config/node",
		"@remix-run/eslint-config/jest-testing-library",
		"plugin:eslint-comments/recommended",
		"prettier",
	],
	env: {
		"cypress/globals": true,
	},
	plugins: ["import", "cypress"],
	rules: {
		"react/forbid-elements": [
			1,
			{
				forbid: [
					{
						element: "button",
						message: "Use <Button> or <Hyperlink> instead.",
					},
					{
						element: "a",
						message: "Use <Button> or <Hyperlink> instead.",
					},
					{
						element: "Link",
						message: "Use <Button> or <Hyperlink> instead.",
					},
					{
						element: "NavLink",
						message: "Use <Button> or <Hyperlink> instead.",
					},
					{
						element: "h2",
						message: "Please use <Heading> inside a <HeadingGroup> instead.",
					},
					{
						element: "h3",
						message: "Please use <Heading> inside a <HeadingGroup> instead.",
					},
					{
						element: "h4",
						message: "Please use <Heading> inside a <HeadingGroup> instead.",
					},
					{
						element: "h5",
						message: "Please use <Heading> inside a <HeadingGroup> instead.",
					},
					{
						element: "h6",
						message: "Please use <Heading> inside a <HeadingGroup> instead.",
					},
				],
			},
		],
		"import/order": [
			"error",
			{
				alphabetize: {
					order: "asc",
				},
				groups: [
					"type",
					"builtin",
					"external",
					"internal",
					"parent",
					["sibling", "index"],
				],
				"newlines-between": "ignore",
				pathGroups: [],
				pathGroupsExcludedImportTypes: [],
			},
		],
		"import/no-duplicates": "warn",
		"no-console": ["warn", { allow: ["warn", "error"] }],
		"react/jsx-key": [
			"warn",
			{
				checkFragmentShorthand: true,
				checkKeyMustBeforeSpread: true,
				warnOnDuplicates: true,
			},
		],
		"eslint-comments/no-unused-disable": "error",
	},
	// we're using vitest which has a very similar API to jest
	// (so the linting plugins work nicely), but it means we have to explicitly
	// set the jest version.
	settings: {
		jest: {
			version: 28,
		},
	},
};
