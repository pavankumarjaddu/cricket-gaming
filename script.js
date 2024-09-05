// Initialize the points table with all teams
function initializePointsTable(teams) {
    const pointsTable = {};
    teams.forEach(team => {
        pointsTable[team] = {
            matches: 0,
            won: 0,
            loss: 0,
            tie: 0, // Add tie count
            nrr: 0,
            points: 0,
            totalRunsScored: 0,
            totalOversFaced: 0,
            totalRunsConceded: 0,
            totalOversBowled: 0
        };
    });
    return pointsTable;
}

// Process a single match and update the points table
function processMatch(pointsTable, match) {
    const [team1, team2] = match.teams;

    // Update matches played
    pointsTable[team1].matches += 1;
    pointsTable[team2].matches += 1;

    if (match.winner === "Tie") {
        // Award 1 point to each team in case of a tie
        pointsTable[team1].points += 1;
        pointsTable[team2].points += 1;
        pointsTable[team1].tie += 1;
        pointsTable[team2].tie += 1;
        return; // Skip further processing for a tie match
    }

    const winner = match.winner;
    const loser = winner === team1 ? team2 : team1;

    // Update wins and losses
    pointsTable[winner].won += 1;
    pointsTable[loser].loss += 1;

    // Update points (2 points per win)
    pointsTable[winner].points += 2;

    // Full quota of overs assumed (e.g., 20 overs in T20)
    const fullQuotaOvers = 20.0;

    // Use full quota of overs if the team is bowled out
    const team1Overs = (match.scores[team1].runs < match.scores[team2].runs && match.scores[team1].overs < fullQuotaOvers) ? fullQuotaOvers : match.scores[team1].overs;
    const team2Overs = (match.scores[team2].runs < match.scores[team1].runs && match.scores[team2].overs < fullQuotaOvers) ? fullQuotaOvers : match.scores[team2].overs;

    // Accumulate total runs and overs
    pointsTable[team1].totalRunsScored += match.scores[team1].runs;
    pointsTable[team1].totalOversFaced += team1Overs;
    pointsTable[team1].totalRunsConceded += match.scores[team2].runs;
    pointsTable[team1].totalOversBowled += team2Overs;

    pointsTable[team2].totalRunsScored += match.scores[team2].runs;
    pointsTable[team2].totalOversFaced += team2Overs;
    pointsTable[team2].totalRunsConceded += match.scores[team1].runs;
    pointsTable[team2].totalOversBowled += team1Overs;
}

// Calculate NRR based on accumulated runs and overs
function calculateNRR(pointsTable) {
    for (let team in pointsTable) {
        const teamData = pointsTable[team];
        if (teamData.totalOversFaced > 0 && teamData.totalOversBowled > 0) {
            const runsScoredPerOver = teamData.totalRunsScored / teamData.totalOversFaced;
            const runsConcededPerOver = teamData.totalRunsConceded / teamData.totalOversBowled;
            teamData.nrr = runsScoredPerOver - runsConcededPerOver;
        } else {
            teamData.nrr = 0;
        }
    }
}

// Display the points table in the UI
function displayPointsTable(pointsTable) {
    const tableBody = document.querySelector("#points-table tbody");
    tableBody.innerHTML = '';

    // Convert pointsTable object into an array for sorting
    const sortedTeams = Object.keys(pointsTable).sort((teamA, teamB) => {
        const teamAPoints = pointsTable[teamA].points;
        const teamBPoints = pointsTable[teamB].points;

        // Sort primarily by points, then by NRR if points are equal
        if (teamAPoints === teamBPoints) {
            return pointsTable[teamB].nrr - pointsTable[teamA].nrr;
        } else {
            return teamBPoints - teamAPoints;
        }
    });

    // Create table rows in sorted order
    sortedTeams.forEach(team => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${team}</td>
            <td>${pointsTable[team].matches}</td>
            <td>${pointsTable[team].won}</td>
            <td>${pointsTable[team].loss}</td>
            <td>${pointsTable[team].tie}</td>
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
            calculateNRR(pointsTable);
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
    "Hologram",
    "Royal Challengers Bhimavaram",
    "American Eagles"
];

// Run the main function when the DOM is loaded
document.addEventListener('DOMContentLoaded', updateTournamentTable);