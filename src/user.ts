import { database } from "./db";
import { logEvent, prompt } from "./helpers";
import { User } from "./types";

export async function getUser() {
	const playedBefore = await prompt('Have you played this before?', 'confirm');

	if (playedBefore) {
		const idInput = await prompt('What is your user ID?', 'number');
		const user = await database.select<User>('*').from('Users').where('id', idInput).first();
		console.log('Found user: ', user);
		if(!user) {
			console.log('Can\'t find user');
			return createUser();
		}

		logEvent('user-login', { userId: user.id });
		return user.id;
	} else {
		console.log('Okay :)');
		return createUser();
	}
}

async function createUser() {
	const name = await prompt('What is your name?');
	const newUser = await database.insert({ name }).into('Users');
	const insertId = newUser[0];
	console.log(`Hello ${name}, your id is ${insertId}`);

	logEvent('user-created', { userId: insertId });
	return insertId;
}