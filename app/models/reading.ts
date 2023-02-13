import { stripAllTags } from "./utils";

export const DEFAULT_READING_SPEED = 250;

export function getReadTime(wordCount: number, userReadSpeed?: number) {
	if (userReadSpeed) return wordCount / userReadSpeed;
	return wordCount / DEFAULT_READING_SPEED;
}

export function getWordCount(content: string) {
	const noTagsContent = stripAllTags(content);
	return noTagsContent.split(" ").length;
}
