const teams = [
    { team: "Hyderabad HellDivers", matches: 0, won: 0, loss: 0, nrr: 0.000, points: 0 },
    { team: "Vijayawada Volunteers", matches: 0, won: 0, loss: 0, nrr: 0.000, points: 0 },
    { team: "Golden Warriors", matches: 0, won: 0, loss: 0, nrr: 0.000, points: 0 },
    { team: "Deccan Chargers", matches: 0, won: 0, loss: 0, nrr: 0.000, points: 0 },
    { team: "Elite Eagles", matches: 0, won: 0, loss: 0, nrr: 0.000, points: 0 },
    { team: "Bombay Heats", matches: 0, won: 0, loss: 0, nrr: 0.000, points: 0 },
    { team: "Vhagor Riders", matches: 0, won: 0, loss: 0, nrr: 0.000, points: 0 },
    { team: "The Spartans", matches: 0, won: 0, loss: 0, nrr: 0.000, points: 0 },
    { team: "The Hesitate Hitters", matches: 0, won: 0, loss: 0, nrr: 0.000, points: 0 },
    { team: "Team Physics", matches: 0, won: 0, loss: 0, nrr: 0.000, points: 0 },
    { team: "Royal Challengers Bhimavaram", matches: 0, won: 0, loss: 0, nrr: 0.000, points: 0 },
    { team: "American Eagles", matches: 0, won: 0, loss: 0, nrr: 0.000, points: 0 }
];

function loadSeason() {
    const tableBody = document.querySelector("#points-table tbody");
    tableBody.innerHTML = "";

    teams.forEach(team => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${team.team}</td>
            <td>${team.matches}</td>
            <td>${team.won}</td>
            <td>${team.loss}</td>
            <td>${team.nrr.toFixed(3)}</td>
            <td>${team.points}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Load the table when the page is loaded
document.addEventListener("DOMContentLoaded", loadSeason);
