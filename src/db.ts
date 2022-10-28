import knex from "knex";

export const database = knex({
	client: 'mysql2',
	connection: {
		host: 'localhost',
		user: 'root',
		password: 'test1234',
		database: 'databasegame',
	}
});
