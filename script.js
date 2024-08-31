fetch('matches.json')
    .then(response => response.json())
    .then(matches => {
        const pointsTable = calculatePointsTable(matches);
        displayPointsTable(pointsTable);
    });

function calculatePointsTable(matches) {
    const teams = {};

    matches.forEach(match => {
        const [team1, team2] = match.teams;
        const winner = match.winner;
        const loser = winner === team1 ? team2 : team1;

        // Initialize teams if not already in the table
        if (!teams[team1]) {
            teams[team1] = { matches: 0, won: 0, loss: 0, nrr: 0, points: 0 };
        }
        if (!teams[team2]) {
            teams[team2] = { matches: 0, won: 0, loss: 0, nrr: 0, points: 0 };
        }

        // Update matches played
        teams[team1].matches += 1;
        teams[team2].matches += 1;

        // Update wins and losses
        teams[winner].won += 1;
        teams[loser].loss += 1;

        // Update points (2 points per win)
        teams[winner].points += 2;

        // NRR could be updated here if needed
        // Example: teams[winner].nrr += (calculate NRR logic here);
        // For now, let's assume you manually input NRRs in the JSON or update them later
    });

    return teams;
}

function displayPointsTable(teams) {
    const tableBody = document.querySelector("#points-table tbody");
    tableBody.innerHTML = ''; // Clear any existing rows

    Object.keys(teams).forEach(team => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${team}</td>
            <td>${teams[team].matches}</td>
            <td>${teams[team].won}</td>
            <td>${teams[team].loss}</td>
            <td>${teams[team].nrr.toFixed(3)}</td>
            <td>${teams[team].points}</td>
        `;
        tableBody.appendChild(row);
    });
}
