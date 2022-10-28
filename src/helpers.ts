import prompts, { PromptType } from "prompts";
import { database } from "./db";
import { LogOptions } from "./types";

export async function prompt(question: string, type: PromptType = "text") {
	const answer = await prompts({
		type: type,
		name: "value",
		message: question
	});
	return answer.value;
}

export const logEvent = async (event: string, options: LogOptions) =>
	database.insert({ event, ...options }).into("Events");

export function uuidGenerator() {
	var S4 = function() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export const bold = (text: string) => 
	`\x1b[4m${text}\x1b[0m`;
