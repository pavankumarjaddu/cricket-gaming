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

    console.log(`Processing match: ${team1} vs ${team2}`);
    console.log(`Match result: ${match.result}`);
    console.log(`Scores: ${team1} - ${match.scores[team1].runs} runs in ${match.scores[team1].overs} overs`);
    console.log(`Scores: ${team2} - ${match.scores[team2].runs} runs in ${match.scores[team2].overs} overs`);

    pointsTable[team1].matches += 1;
    pointsTable[team2].matches += 1;

    // Handle Tie
    if (match.winner === "Tie") {
        pointsTable[team1].points += 1;
        pointsTable[team2].points += 1;
        return;
    }

    const winner = match.winner;
    const loser = winner === team1 ? team2 : team1;

    pointsTable[winner].won += 1;
    pointsTable[loser].loss += 1;
    pointsTable[winner].points += 2;

    if (match.scores[team1] && match.scores[team2]) {
        const fullQuotaOvers = 20.0;

        const team1Overs = (match.scores[team1].runs < match.scores[team2].runs && match.scores[team1].overs < fullQuotaOvers) ? fullQuotaOvers : match.scores[team1].overs;
        const team2Overs = (match.scores[team2].runs < match.scores[team1].runs && match.scores[team2].overs < fullQuotaOvers) ? fullQuotaOvers : match.scores[team2].overs;

        pointsTable[team1].totalRunsScored += match.scores[team1].runs;
        pointsTable[team1].totalOversFaced += team1Overs;
        pointsTable[team1].totalRunsConceded += match.scores[team2].runs;
        pointsTable[team1].totalOversBowled += team2Overs;

        pointsTable[team2].totalRunsScored += match.scores[team2].runs;
        pointsTable[team2].totalOversFaced += team2Overs;
        pointsTable[team2].totalRunsConceded += match.scores[team1].runs;
        pointsTable[team2].totalOversBowled += team1Overs;
    }
}

function calculateNRR(pointsTable) {
    for (let team in pointsTable) {
        const teamData = pointsTable[team];
        if (teamData.totalOversFaced > 0 && teamData.totalOversBowled > 0) {
            const runsScoredPerOver = teamData.totalRunsScored / teamData.totalOversFaced;
            const runsConcededPerOver = teamData.totalRunsConceded / teamData.totalOversBowled;
            teamData.nrr = runsScoredPerOver - runsConcededPerOver;

            // Log NRR calculation for each team
            console.log(`${team} NRR calculation:`);
            console.log(`Runs Scored: ${teamData.totalRunsScored}, Overs Faced: ${teamData.totalOversFaced}`);
            console.log(`Runs Conceded: ${teamData.totalRunsConceded}, Overs Bowled: ${teamData.totalOversBowled}`);
            console.log(`NRR: ${teamData.nrr}`);
        }
    }
}

// Display points table
function displayPointsTable(pointsTable, tableId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = '';

    const sortedTeams = Object.keys(pointsTable).sort((teamA, teamB) => pointsTable[teamB].points - pointsTable[teamA].points || pointsTable[teamB].nrr - pointsTable[teamA].nrr);

    sortedTeams.forEach(team => {
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

// Change round based on dropdown selection
function changeRound() {
    const roundSelector = document.getElementById('round-selector');
    const selectedRound = roundSelector.value;

    if (selectedRound === 'round1') {
        document.getElementById('round1-table').style.display = 'block';
        document.getElementById('round2-table').style.display = 'none';
    } else {
        document.getElementById('round1-table').style.display = 'none';
        document.getElementById('round2-table').style.display = 'block';
    }
}

// Main function to fetch data and update the points table
function updateTournamentTable() {
    // Fetch Round 1 matches
    fetch('matches.json')
        .then(response => response.json())
        .then(matches => {
            const pointsTable = initializePointsTable(allTeams);
            matches.forEach(match => processMatch(pointsTable, match));
            calculateNRR(pointsTable);
            displayPointsTable(pointsTable, 'round1-table');
        })
        .catch(error => {
            console.error("Error fetching Round 1 matches: ", error);
        });

    // Fetch Round 2 matches
    fetch('round2matches.json')
    .then(response => response.json())
    .then(matches => {
        const groupATeams = ["The Spartans", "Golden Warriors", "Elite Eagles", "Vijayawada Volunteers"];
        const groupBTeams = ["Vhagor Riders", "Hologram", "Deccan Chargers", "American Eagles"];

        const groupAPointsTable = initializePointsTable(groupATeams);
        const groupBPointsTable = initializePointsTable(groupBTeams);

        // Display team names with 0s before processing matches
        displayPointsTable(groupAPointsTable, 'groupA-table');
        displayPointsTable(groupBPointsTable, 'groupB-table');

        // Now process the matches
        matches.forEach(match => {
            if (groupATeams.includes(match.teams[0])) {
                processMatch(groupAPointsTable, match);
            } else {
                processMatch(groupBPointsTable, match);
            }
        });

        calculateNRR(groupAPointsTable);
        calculateNRR(groupBPointsTable);

        // Display updated tables after processing
        displayPointsTable(groupAPointsTable, 'groupA-table');
        displayPointsTable(groupBPointsTable, 'groupB-table');
    });
}

// Define the teams for Round 1 and Round 2
const allTeams = [
    "Elite Eagles", "Bombay Heats", "Hyderabad HellDivers", "Vijayawada Volunteers",
    "Golden Warriors", "Deccan Chargers", "Vhagor Riders", "The Spartans",
    "The Hesitate Hitters", "Hologram", "Royal Challengers Bhimavaram", "American Eagles"
];

// Run the main function when the DOM is loaded
document.addEventListener('DOMContentLoaded', updateTournamentTable);