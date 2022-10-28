import { bold, logEvent, prompt, uuidGenerator } from "./helpers";

const maxNumber = 200;

export async function playGame(userId: number) {
    const gameId = uuidGenerator();
    const gameLog = (event: string, data?: any) => logEvent(event, { data, userId, gameId });

    const randomNumber = Math.round(Math.random() * maxNumber);
    let lives = 10;

    await gameLog("game-started", { randomNumber });

    while (lives > 0) {
        const guess = await prompt(`Guess a number between 0 and ${maxNumber}`, 'number');
        if (Number(guess) === randomNumber) {
            console.log('You win!');
            gameLog('game-win');
            break;
        } else {
            lives--;

            if (lives === 0) {
                console.log(`You lose! The number was ${randomNumber}`);
                gameLog('game-lose');
                break;
            }

            const hint = Number(guess) > randomNumber ? 'high' : 'low';
            console.log(`You're guess was too ${bold(hint)}! You have ${lives} lives left`);

            console.log('\n');

            gameLog('guess', { guess, hint });
        }
    }
}