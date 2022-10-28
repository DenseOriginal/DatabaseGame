-- Get amount of guesses for each game
SELECT u.name, e.gameId, COUNT(*) as `guesses` FROM Events e
JOIN Users u WHERE e.userId = u.id
AND event = 'guess'
AND EXISTS (SELECT * FROM Events WHERE gameId = e.gameId AND event = 'game-win')
GROUP BY e.gameId
ORDER BY COUNT(*) ASC;

-- Get logins from each user
SELECT u.name, COUNT(*) as `logins` FROM Events e
JOIN Users u WHERE e.userId = u.id
AND event = 'user-login'
GROUP BY u.name;

-- Get games played and games won/lost
SELECT
    u.name,
    (SELECT COUNT(*) FROM Events WHERE userId = u.id AND event = 'game-started') as `Games played`,
    (SELECT COUNT(*) FROM Events WHERE userId = u.id AND event = 'game-win') as `Games won`,
    (SELECT COUNT(*) FROM Events WHERE userId = u.id AND event = 'game-lose') as `Games loss`
FROM Users u
ORDER BY `Games played` DESC;