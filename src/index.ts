import { playGame } from "./game";
import { prompt } from "./helpers";
import { getUser } from "./user";

async function run() {
	console.log(`
     ____  __    ______                   
    / __ \\/ /_  / ____/___ _____ ___  ___ 
   / / / / __ \\/ / __/ __ \`/ __ \`__ \\/ _ \\
  / /_/ / /_/ / /_/ / /_/ / / / / / /  __/
 /_____/_.___/\\____/\\__,_/_/ /_/ /_/\\___/                                     
	`);
	
	const user = await getUser();

	console.log('\n');

	while (true) {
		await playGame(user);
		console.log('\n');

		const playAgain = await prompt('Play again?', 'confirm');
		if (!playAgain) {
			console.log('Okay, bye!');
			
			break;
		}
	}
}

run();