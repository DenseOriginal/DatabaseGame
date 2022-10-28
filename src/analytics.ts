import { database } from "./db";
import { prompt } from "./helpers";
import { Event, Game, User } from "./types";

async function analytics() {
	const idInput = await prompt('What user do you wanna get stats from?', 'number');
	const user = await database.select<User>('*').from('Users').where('id', idInput).first();
	if(!user) {
		return console.log('Can\'t find user');;
	}

	console.log('Found user: ', user);

	console.log('\n');
	
	const userEvents = await database.select<Event[]>('*').from('Events').where('userId', idInput);
	console.log('User created: ', userEvents.find(e => e.event === 'user-created')?.timestamp);
	console.log('User logins: ', userEvents.filter(e => e.event === 'user-login').length);
	
	console.log('\n');

	console.log('Number of logged events: ', userEvents.length);
	console.log('Games played: ', userEvents.filter(event => event.event === 'game-started').length);
	console.log('Games won: ', userEvents.filter(event => event.event === 'game-win').length);
	console.log('Games lost: ', userEvents.filter(event => event.event === 'game-lose').length);
	
	const groupedByGame = userEvents.reduce((acc, event) => {
		if (!event.gameId) return acc;

		if(!acc[event.gameId]) {
			acc[event.gameId] = [];
		}
		acc[event.gameId].push(event);
		return acc;
	}, {} as Record<string, Event[]>);

	// Games with both a 'game-started' and a ('game-win' or 'game-lose') event
	const validGames = Object.fromEntries(Object.entries(groupedByGame).filter(([, game]) => {
		const winOrLoss = game.find(e => e.event === 'game-win' || e.event === 'game-lose');
		const started = game.find(e => e.event === 'game-started');
		return started && winOrLoss;
	}));

	const averagePlaytime = Object.values(validGames).reduce((acc, events) => {
		const gameStart = events.at(0)?.timestamp;
		const gameEnd = events.at(-1)?.timestamp;
		if (!gameStart || !gameEnd) return acc;
		const start = new Date(gameStart);
		const end = new Date(gameEnd);
		const diff = end.getTime() - start.getTime();
		return acc + diff;
	}, 0) / Object.values(validGames).length / 1000;

	console.log('Average playtime: ', +averagePlaytime.toPrecision(2), 'seconds');

	const averageGuesses = Object.values(validGames).reduce((acc, events) => {
		const moves = events.filter(event => event.event === 'guess');

		return acc + moves.length;
	}, 0) / Object.values(validGames).length;

	console.log('Average number of guesses: ', +averageGuesses.toPrecision(2));
	
	const sortedByGuesses = Object.entries(validGames).reduce((acc, [gameId, events]) => {
		if (events.find(e => e.event === 'game-lose')) return acc;
		const guesses = events.filter(event => event.event === 'guess');
		acc.push({ gameId, guesses: guesses.length });
		return acc;
	}, [] as Game[]).sort((a, b) => a.guesses - b.guesses);
	
	const bestGame = sortedByGuesses.at(0);
	const worstGame = sortedByGuesses.at(-1);
	console.log('Game with most guesses: ', bestGame?.gameId, 'with', bestGame?.guesses, 'guesses');
	console.log('Game with least guesses: ', worstGame?.gameId, 'with', worstGame?.guesses, 'guesses');
	
}

analytics();