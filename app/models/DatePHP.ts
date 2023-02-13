export class DatePHP extends Date {
	/**
	 * Return a string representation of a provided date object.
	 * @param format The format to output it as.
	 * @returns The date string.
	 */
	public format(format: string) {
		if (format === "") {
			return "";
		}
		const day = this.getDay();
		const days = [
			escapeAllCharacters("Sunday"),
			escapeAllCharacters("Monday"),
			escapeAllCharacters("Tuesday"),
			escapeAllCharacters("Wednesday"),
			escapeAllCharacters("Thursday"),
			escapeAllCharacters("Friday"),
			escapeAllCharacters("Saturday"),
		];
		const date = this.getDate();
		const month = this.getMonth();
		const months = [
			escapeAllCharacters("January"),
			escapeAllCharacters("February"),
			escapeAllCharacters("March"),
			escapeAllCharacters("April"),
			escapeAllCharacters("May"),
			escapeAllCharacters("June"),
			escapeAllCharacters("July"),
			escapeAllCharacters("August"),
			escapeAllCharacters("September"),
			escapeAllCharacters("October"),
			escapeAllCharacters("November"),
			escapeAllCharacters("December"),
		];
		const year = this.getFullYear();
		const hours = this.getHours();
		const minutes = this.getMinutes();
		const seconds = this.getSeconds();
		const milliseconds = this.getMilliseconds();
		const timezoneMinutesOffset = this.getTimezoneOffset();

		// Replace date shortcuts
		// "c" references ISO-8601 but doesn't include milliseconds, so we can't use .toISOString()
		format = replaceAllUnescaped(format, "c", "Y-m-d\\TH:i:sp");
		format = replaceAllUnescaped(format, "r", "D, d M Y H:i:s O");

		// Day
		format = replaceAllUnescaped(format, "d", date.toString().padStart(2, "0"));
		format = replaceAllUnescaped(format, "D", days[day].slice(0, 6));
		format = replaceAllUnescaped(format, "j", date.toString());
		format = replaceAllUnescaped(format, "l", days[day]);

		format = replaceAllUnescaped(format, "N", (day === 0 ? 7 : day).toString());
		if (date % 10 === 1 && date !== 11) {
			format = replaceAllUnescaped(format, "S", escapeAllCharacters("st"));
		} else if (date % 10 === 2 && date !== 12) {
			format = replaceAllUnescaped(format, "S", escapeAllCharacters("nd"));
		} else if (date % 10 === 3 && date !== 13) {
			format = replaceAllUnescaped(format, "S", escapeAllCharacters("rd"));
		} else {
			format = replaceAllUnescaped(format, "S", escapeAllCharacters("th"));
		}
		format = replaceAllUnescaped(format, "w", day.toString());
		let dayOfTheYear = date;
		for (let $i = month; $i > 0; $i--) {
			let lastDayOfPreviousMonth = new Date(year, $i, 0);
			let daysInPreviousMonth = lastDayOfPreviousMonth.getDate();
			dayOfTheYear = dayOfTheYear + daysInPreviousMonth;
		}
		format = replaceAllUnescaped(format, "z", (dayOfTheYear - 1).toString());
		// Week
		if (searchFirstUnescaped(format, "W") !== -1) {
			console.warn(
				"The W character is currently not supported. It has not been substituted or removed."
			);
		}
		// Month
		format = replaceAllUnescaped(format, "F", months[month]);
		format = replaceAllUnescaped(
			format,
			"m",
			(month + 1).toString().padStart(2, "0")
		);
		format = replaceAllUnescaped(format, "M", months[month].slice(0, 6));
		format = replaceAllUnescaped(format, "n", (month + 1).toString());
		format = replaceAllUnescaped(
			format,
			"t",
			new Date(year, month + 1, 0).getDate().toString()
		);
		// Year
		if (new Date(year, 2, 0).getDate() === 29) {
			format = replaceAllUnescaped(format, "L", (1).toString());
		} else {
			format = replaceAllUnescaped(format, "L", (0).toString());
		}
		if (searchFirstUnescaped(format, "o") !== -1) {
			console.warn(
				"The o character is currently not supported. It has not been substituted or removed."
			);
		}
		format = replaceAllUnescaped(format, "Y", year.toString());
		format = replaceAllUnescaped(format, "y", year.toString().slice(-2));
		// Time
		let small_hours = hours;
		let meridiem = "am";
		if (hours > 12) {
			small_hours = hours - 12;
			meridiem = "pm";
		}
		format = replaceAllUnescaped(format, "a", escapeAllCharacters(meridiem));
		format = replaceAllUnescaped(
			format,
			"A",
			escapeAllCharacters(meridiem.toUpperCase())
		);
		format = replaceAllUnescaped(format, "g", small_hours.toString());
		format = replaceAllUnescaped(format, "G", hours.toString());
		format = replaceAllUnescaped(
			format,
			"h",
			small_hours.toString().padStart(2, "0")
		);
		format = replaceAllUnescaped(
			format,
			"H",
			hours.toString().padStart(2, "0")
		);
		format = replaceAllUnescaped(
			format,
			"i",
			minutes.toString().padStart(2, "0")
		);
		format = replaceAllUnescaped(
			format,
			"s",
			seconds.toString().padStart(2, "0")
		);
		format = replaceAllUnescaped(
			format,
			"v",
			milliseconds.toString().padStart(3, "0")
		);
		if (searchFirstUnescaped(format, "B") !== -1) {
			console.warn(
				"The B character is currently not supported. It has not been substituted or removed."
			);
		}
		if (searchFirstUnescaped(format, "u") !== -1) {
			console.warn(
				"The u character is not supported because of JS Date limitations. It has not been substituted or removed."
			);
		}
		// Timezone
		if (timezoneMinutesOffset === 0) {
			format = replaceAllUnescaped(format, "O", "+0000");
			format = replaceAllUnescaped(format, "P", "+00:00");
			format = replaceAllUnescaped(format, "p", "Z");
		} else {
			let remainderMinutes = timezoneMinutesOffset % 60;
			let exactHourLength = (timezoneMinutesOffset - remainderMinutes) / 60;

			format = replaceAllUnescaped(
				format,
				"O",
				`${timezoneMinutesOffset < 0 ? "+" : "-"}${Math.abs(exactHourLength)
					.toString()
					.padStart(2, "0")}${remainderMinutes.toString().padStart(2, "0")}`
			);
			format = replaceAllUnescaped(
				format,
				"P",
				`${timezoneMinutesOffset < 0 ? "+" : "-"}${Math.abs(exactHourLength)
					.toString()
					.padStart(2, "0")}:${remainderMinutes.toString().padStart(2, "0")}`
			);
			format = replaceAllUnescaped(
				format,
				"p",
				`${timezoneMinutesOffset < 0 ? "+" : "-"}${Math.abs(exactHourLength)
					.toString()
					.padStart(2, "0")}:${remainderMinutes.toString().padStart(2, "0")}`
			);
		}

		if (searchFirstUnescaped(format, "e") !== -1) {
			console.warn(
				"The e character is currently not supported. It has not been substituted or removed."
			);
		}
		if (searchFirstUnescaped(format, "I") !== -1) {
			console.warn(
				"The I character is currently not supported. It has not been substituted or removed."
			);
		}
		if (searchFirstUnescaped(format, "T") !== -1) {
			console.warn(
				"The T character is currently not supported. It has not been substituted or removed."
			);
		}
		if (searchFirstUnescaped(format, "Z") !== -1) {
			console.warn(
				"The Z character is currently not supported. It has not been substituted or removed."
			);
		}
		format = replaceAllUnescaped(
			format,
			"U",
			(this.valueOf() / 1000).toString()
		);
		return unslash(format);
	}

	static parseString(
		date_string: string,
		format_string: "Y-m-d\\TH:i:s.vp" | "ISO-8601"
	) {
		if (format_string !== "Y-m-d\\TH:i:s.vp" && format_string !== "ISO-8601") {
			console.error(
				"parseDateUsingPHPDateFormat: Currently only ISO-8601 is supported."
			);
			return new DatePHP();
		}

		let year_string = date_string.substring(0, 4);
		let month_string = date_string.substring(5, 7);
		let day_string = date_string.substring(8, 10);
		let hours_string = date_string.substring(11, 13);
		let minutes_string = date_string.substring(14, 16);
		let seconds_string = date_string.substring(17, 19);
		let milliseconds_string = date_string.substring(20, 23);
		let timezone_string = date_string.substring(23);
		let offsetMinutes;
		if (timezone_string === "Z" || timezone_string === "z") {
			offsetMinutes = 0;
		} else {
			// Split timezone string into hours and minutes no matter if there's a colon or not.
			// Take the first 3 characters of the timezone to get the hour offset
			let timezone_offset_hours = timezone_string.substring(0, 3);
			// Take the last 2 characters of the timezone to get the minutes to the same offset as above
			let timezone_offset_mins = timezone_string.slice(-2);
			offsetMinutes =
				Number(timezone_offset_hours) * 60 + Number(timezone_offset_mins);
		}
		let year = Number(year_string);
		let month = Number(month_string) - 1;
		let day = Number(day_string);
		let hours = Number(hours_string);
		let minutes = Number(minutes_string) - offsetMinutes;
		let seconds = Number(seconds_string);
		let milliseconds = Number(milliseconds_string);

		return new DatePHP(
			Date.UTC(year, month, day, hours, minutes, seconds, milliseconds)
		);
	}
}

export function escapeAllCharacters(string: string) {
	let array = string.split("");
	return `\\${array.join("\\")}`;
}
export function unslash(string: string) {
	let array = string.split(`\\\\`);
	let new_string = "";
	let index = 0;
	for (let piece of array) {
		while (piece.search(new RegExp("[\\\\]")) !== -1) {
			piece = piece.replace("\\", "");
		}
		new_string = `${new_string}${index > 0 ? "\\" : ""}${piece}`;
		index++;
	}
	return new_string;
}
/**
 * This function replaced all phrases in the search value with the replace value, unless the searched value has been escaped.
 * @param string The full string.
 * @param search_value The value to search.
 * @param replace_value The value to replace the searched value with.
 * @returns The string after all changes are made.
 */
export function replaceAllUnescaped(
	string: string,
	search_value: string,
	replace_value: string
) {
	let new_string = "";
	let index = 0;
	let split_string = string.split("\\\\"); // Split by any escaped backslashes.
	for (let string_piece of split_string) {
		let temp_string = "";
		let lastIndex = string_piece.lastIndexOf(`${search_value}`);
		if (lastIndex === -1) {
			new_string = `${new_string}${index > 0 ? "\\\\" : ""}${string_piece}`;
		} else {
			while (lastIndex !== -1) {
				if (string.charAt(lastIndex - 1) !== `\\`) {
					temp_string =
						string_piece.slice(lastIndex).replace(search_value, replace_value) +
						temp_string;
				} else {
					temp_string = string_piece.slice(lastIndex) + temp_string;
				}
				string_piece = string_piece.slice(0, lastIndex);
				lastIndex = string_piece.lastIndexOf(`${search_value}`);
			}
			new_string = `${new_string}${string_piece}${
				index > 0 ? "\\\\" : ""
			}${temp_string}`;
		}
		index++;
	}
	return new_string;
}
/**
 * This function searches a provided string for the first occurrence of the search value that isn't escaped and returns its index in the string, or -1 if no occurrence was found.
 * @param string The string to search.
 * @param search_value The value to search for in the string.
 * @returns The index of the occurrence, or -1 if none found.
 */
export function searchFirstUnescaped(
	string: string,
	search_value: string
): number {
	let split_string = string.split("\\\\");
	let position = 0;
	let index = 0;
	for (let string_piece of split_string) {
		if (index > 0) {
			position = position + 2;
		}
		index++;
		let lastIndex = string_piece.lastIndexOf(`${search_value}`);
		if (lastIndex === 0) {
			return position;
		}
		while (lastIndex !== -1) {
			if (string.charAt(lastIndex - 1) !== `\\`) {
				return position + lastIndex;
			}
			string_piece = string_piece.slice(0, lastIndex);
			lastIndex = string_piece.lastIndexOf(`${search_value}`);
		}
		position = position + string_piece.length;
	}
	return -1;
}
