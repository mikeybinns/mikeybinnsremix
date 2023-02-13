export type OneOfThemes = "colours" | "lordOfTheRings";
export const allTeamThemeOptions = [
	{ label: "Colours", value: "colours" },
	{ label: "Lord of the Rings", value: "lordOfTheRings" },
];
export const allThemes = allTeamThemeOptions.map((option) => option.value);
export const defaultTeamTheme = "colours";

export function isValidTeamTheme(theme: string): theme is OneOfThemes {
	return allThemes.includes(theme);
}

export const teamNamesByTheme: Record<
	OneOfThemes,
	{ 0: string; 1: string; 2: string }
> = {
	colours: { 0: "Red", 1: "Green", 2: "Blue" },
	lordOfTheRings: { 0: "Eriador", 1: "Rohan / Gondor", 2: "Mordor" },
};
