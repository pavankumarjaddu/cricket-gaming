// Initialize the points table with all teams
function initializePointsTable(teams) {
    const pointsTable = {};
    teams.forEach(team => {
        pointsTable[team] = { matches: 0, won: 0, loss: 0, nrr: 0, points: 0 };
    });
    return pointsTable;
}

// Process a single match and update the points table
function processMatch(pointsTable, match) {
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
}

// Display the points table in the UI
function displayPointsTable(pointsTable) {
    const tableBody = document.querySelector("#points-table tbody");
    tableBody.innerHTML = '';
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

// Main function to fetch data and update the points table
function updateTournamentTable() {
    fetch('matches.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            return response.json();
        })
        .then(matches => {
            const pointsTable = initializePointsTable(allTeams);
            matches.forEach(match => processMatch(pointsTable, match));
            displayPointsTable(pointsTable);
        })
        .catch(error => console.error('Error fetching or processing data:', error));
}

// Define the teams
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

// Run the main function when the DOM is loaded
document.addEventListener('DOMContentLoaded', updateTournamentTable);