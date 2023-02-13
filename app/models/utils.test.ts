import { it, describe } from "vitest";
import {
	filterProps,
	getNumberOfDaysInMonth,
	safeRedirect,
	validateEmail,
} from "./utils";

describe("test filterProps()", () => {
	const props = {
		className: "test",
		doesThisWork: true,
		secondaryTest: true,
	};
	it("removes a single prop", () => {
		expect(filterProps(props, ["className"])).toStrictEqual({
			doesThisWork: true,
			secondaryTest: true,
		});
	});
	it("removes multiple props", () => {
		expect(filterProps(props, ["className", "doesThisWork"])).toStrictEqual({
			secondaryTest: true,
		});
	});
	it("doesn't throw an error if removing a prop that doesn't exist", () => {
		expect(filterProps<"doesNotExist">(props, ["doesNotExist"])).toStrictEqual(
			props
		);
	});
});

describe("test safeRedirect()", () => {
	it("passes through a safe redirect", () => {
		expect(safeRedirect("/blog")).toBe("/blog");
		expect(safeRedirect("/blog", "/about")).toBe("/blog");
	});
	it("passes through a default redirect when an unsafe redirect is passed", () => {
		expect(safeRedirect("https://attacker.com/")).toBe("/");
		expect(safeRedirect("//attacker.com/")).toBe("/");
		expect(safeRedirect("https://attacker.com/", "/blog")).toBe("/blog");
	});
});

describe("test validateEmail()", () => {
	it("returns false for non-emails", () => {
		expect(validateEmail(undefined)).toBe(false);
		expect(validateEmail(null)).toBe(false);
		expect(validateEmail("")).toBe(false);
		expect(validateEmail("not-an-email")).toBe(false);
		expect(validateEmail("n@")).toBe(false);
	});

	it("returns true for emails", () => {
		expect(validateEmail("kody@example.com")).toBe(true);
	});
});

// describe("test getNumberOfDaysInMonth()", () => {
// 	it("returns correct days in month if month or year is not provided", () => {
// 		const today = new Date();
// 		const daysInTodaysMonth = new Date(
// 			today.getFullYear(),
// 			today.getMonth() + 1,
// 			0
// 		).getDate();
// 		expect(getNumberOfDaysInMonth()).toBe(daysInTodaysMonth);
// 		const daysInThisYearsFebruary = new Date(
// 			today.getFullYear(),
// 			2,
// 			0
// 		).getDate();
// 		expect(getNumberOfDaysInMonth(1)).toBe(daysInThisYearsFebruary);
// 		const daysInThisMonthInYear3000 = new Date(
// 			3000,
// 			today.getMonth() + 1,
// 			0
// 		).getDate(); // Not much has changed, but they live underwater.
// 		expect(getNumberOfDaysInMonth(null, 3000)).toBe(daysInThisMonthInYear3000);
// 	});
// 	it("returns 28 for non-leap year February", () => {
// 		expect(getNumberOfDaysInMonth(1, 1998)).toBe(28);
// 		expect(getNumberOfDaysInMonth(1, 2001)).toBe(28);
// 		expect(getNumberOfDaysInMonth(1, 2100)).toBe(28);
// 	});
// 	it("returns 29 for leap year February", () => {
// 		expect(getNumberOfDaysInMonth(1, 1996)).toBe(29);
// 		expect(getNumberOfDaysInMonth(1, 2000)).toBe(29);
// 		expect(getNumberOfDaysInMonth(1, 2004)).toBe(29);
// 		expect(getNumberOfDaysInMonth(1, 2008)).toBe(29);
// 	});
// 	it("returns 30 for 30 day months", () => {
// 		expect(getNumberOfDaysInMonth(3, 2004)).toBe(30);
// 		expect(getNumberOfDaysInMonth(5, 2008)).toBe(30);
// 		expect(getNumberOfDaysInMonth(8, 2008)).toBe(30);
// 		expect(getNumberOfDaysInMonth(10, 1996)).toBe(30);
// 	});
// 	it("returns 31 for 31 day months", () => {
// 		expect(getNumberOfDaysInMonth(0, 1996)).toBe(31);
// 		expect(getNumberOfDaysInMonth(2, 2004)).toBe(31);
// 		expect(getNumberOfDaysInMonth(4, 2004)).toBe(31);
// 		expect(getNumberOfDaysInMonth(6, 2008)).toBe(31);
// 		expect(getNumberOfDaysInMonth(7, 2008)).toBe(31);
// 		expect(getNumberOfDaysInMonth(9, 2008)).toBe(31);
// 		expect(getNumberOfDaysInMonth(11, 2008)).toBe(31);
// 	});
// });
