// Define allTeams at the top of the script
const allTeams = [
    "Elite Eagles",
    "Bombay Heats",
    "Hyderabad HellDivers",
    "Vijayawada Volunteers",
    "Golden Warriors",
    "Deccan Chargers",
    "Vhagor Riders",
    "The Spartans",
    "The Hesitate Hitters",
    "Team Physics",
    "Royal Challengers Bhimavaram",
    "American Eagles"
];

// Ensure this runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('matches.json')
        .then(response => {
            console.log('Fetching matches.json...'); // Log to confirm fetch is initiated
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(matches => {
            console.log('Matches data:', matches); // Log the matches data to the console
            const pointsTable = initializePointsTable(allTeams);
            updatePointsTable(pointsTable, matches);
            displayPointsTable(pointsTable);
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
});

function initializePointsTable(teams) {
    const pointsTable = {};

    teams.forEach(team => {
        pointsTable[team] = { matches: 0, won: 0, loss: 0, nrr: 0, points: 0 };
    });

    return pointsTable;
}

function updatePointsTable(pointsTable, matches) {
    matches.forEach(match => {
        const [team1, team2] = match.teams;
        const winner = match.winner;
        const loser = winner === team1 ? team2 : team1;

        // Update matches played
        pointsTable[team1].matches += 1;
        pointsTable[team2].matches += 1;

        // Update wins and losses
        pointsTable[winner].won += 1;
        pointsTable[loser].loss += 1;

        // Update points (2 points per win)
        pointsTable[winner].points += 2;

        // Calculate NRR
        const team1NRR = (match.scores[team1].runs / match.scores[team1].overs) - (match.scores[team2].runs / match.scores[team2].overs);
        const team2NRR = (match.scores[team2].runs / match.scores[team2].overs) - (match.scores[team1].runs / match.scores[team1].overs);

        pointsTable[team1].nrr += team1NRR;
        pointsTable[team2].nrr += team2NRR;
    });
}

function displayPointsTable(pointsTable) {
    const tableBody = document.querySelector("#points-table tbody");
    tableBody.innerHTML = ''; // Clear any existing rows

    allTeams.forEach(team => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${team}</td>
            <td>${pointsTable[team].matches}</td>
            <td>${pointsTable[team].won}</td>
            <td>${pointsTable[team].loss}</td>
            <td>${pointsTable[team].nrr.toFixed(3)}</td>
            <td>${pointsTable[team].points}</td>
        `;
        tableBody.appendChild(row);
    });
}
