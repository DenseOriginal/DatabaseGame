export interface User {
	id: number;
	name: string;
}

export interface LogOptions {
	userId: number;
	data?: string | number;
	gameId?: string;
}

export interface Event {
	id: number;
	timestamp: string;
	userId: number;
	gameId: string | null;
	event: string;
	data: any | null;
}

export interface Game {
	gameId: string;
	guesses: number;
}