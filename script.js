// Initialize the points table with all teams
function initializePointsTable(teams) {
    const pointsTable = {};
    teams.forEach(team => {
        pointsTable[team] = {
            matches: 0,
            won: 0,
            loss: 0,
            tie: 0,
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

    console.log(`Processing match between ${team1} and ${team2}`);
    console.log(`Winner: ${match.winner}`);

    // Update matches played
    pointsTable[team1].matches += 1;
    pointsTable[team2].matches += 1;

    if (match.winner === "Tie") {
        // Handle tie case
        console.log(`Match tied between ${team1} and ${team2}`);
        pointsTable[team1].points += 1;
        pointsTable[team2].points += 1;
        return;
    }

    if (match.result === "walkover") {
        // Handle walkover (No NRR calculation)
        console.log(`Walkover match between ${team1} and ${team2}`);
        const winner = match.winner;
        const loser = winner === team1 ? team2 : team1;

        pointsTable[winner].won += 1;
        pointsTable[loser].loss += 1;
        pointsTable[winner].points += 2;
        return;  // No further calculations for walkovers
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

    // Add defensive checks before accessing runs and overs
    if (match.scores[team1] && match.scores[team2]) {
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

        // Log accumulated values
        console.log(`Updated points table for ${team1}: `, pointsTable[team1]);
        console.log(`Updated points table for ${team2}: `, pointsTable[team2]);
    } else {
        console.error(`Invalid scores data for match between ${team1} and ${team2}`);
    }
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
        console.log(`NRR calculated for ${team}: ${teamData.nrr.toFixed(3)}`);
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
    sortedTeams.forEach((team, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${team}</td>
            <td>${pointsTable[team].matches}</td>
            <td>${pointsTable[team].won}</td>
            <td>${pointsTable[team].loss}</td>
            <td>${pointsTable[team].nrr.toFixed(3)}</td>
            <td>${pointsTable[team].points}</td>
        `;
        if (index === 0) row.style.backgroundColor = "#d4edda"; // Highlight top team
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