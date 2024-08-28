const settings = {
    async: true,
    crossDomain: true,
    url: 'https://fantasy-premier-league-fpl-api.p.rapidapi.com/api/fixtures/',
    method: 'GET',
    headers: {
        'x-rapidapi-key': 'e145ffa8d9msh2161e45c19b7479p16b55fjsn626ded5d8c97',
        'x-rapidapi-host': 'fantasy-premier-league-fpl-api.p.rapidapi.com'
    }
};

let teamsMap = {};

$.ajax(settings).done(function (response) {
    const fixturesList = document.getElementById('fixturesList');

    const fixturesByTeam = {};

    response.forEach(fixture => {
        if (!fixturesByTeam[fixture.team_h]) {
            fixturesByTeam[fixture.team_h] = [];
        }
        if (!fixturesByTeam[fixture.team_a]) {
            fixturesByTeam[fixture.team_a] = [];
        }

        fixturesByTeam[fixture.team_h].push({
            opponent: teamsMap[fixture.team_a],
            difficulty: fixture.team_h_difficulty,
            kickoff_time: fixture.kickoff_time
        });

        fixturesByTeam[fixture.team_a].push({
            opponent: teamsMap[fixture.team_h],
            difficulty: fixture.team_a_difficulty,
            kickoff_time: fixture.kickoff_time
        });
    });

    Object.keys(fixturesByTeam).forEach(teamId => {
        const listItem = document.createElement('li');
        const teamName = teamsMap[teamId];
        listItem.innerHTML = `<strong>${teamName}</strong>: `;

        fixturesByTeam[teamId].forEach(fixture => {
            const difficultyColor = getDifficultyColor(fixture.difficulty);
            const fixtureItem = document.createElement('span');
            fixtureItem.textContent = `${fixture.opponent} (${new Date(fixture.kickoff_time).toLocaleDateString()}) `;
            fixtureItem.style.color = difficultyColor;
            listItem.appendChild(fixtureItem);
        });

        fixturesList.appendChild(listItem);
    });
});

const generalinfo = {
    async: true,
    crossDomain: true,
    url: 'https://fantasy-premier-league-fpl-api.p.rapidapi.com/api/bootstrap-static/',
    method: 'GET',
    headers: {
        'x-rapidapi-key': 'e145ffa8d9msh2161e45c19b7479p16b55fjsn626ded5d8c97',
        'x-rapidapi-host': 'fantasy-premier-league-fpl-api.p.rapidapi.com'
    }
};

let players = []

$.ajax(generalinfo).done(function (response) {
    const teams = response.teams;
    players = response.elements;

    teams.forEach(team => {
        teamsMap[team.id] = team.name;
    });

    const teamsList = document.getElementById('teamsList');
    teams.forEach(team => {
        const listItem = document.createElement('li');
        listItem.textContent = team.name;
        listItem.setAttribute('data-team-id', team.id);
        listItem.addEventListener('click', function () {
            displayPlayersForTeam(team.id, players);
        });
        teamsList.appendChild(listItem);
    });
});



function displayPlayersForTeam(teamId, players) {
    const playersContainer = document.getElementById('playersContainer');
    playersContainer.innerHTML = ''; 

    const teamPlayers = players.filter(player => player.team === parseInt(teamId));

    teamPlayers.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        const playerName = `${player.first_name} ${player.second_name}`;
        const playerImage = document.createElement('img');
        playerImage.src = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`;
        playerImage.alt = playerName;
        playerDiv.appendChild(playerImage);

        const playerDetails = document.createElement('div');
        playerDetails.className = 'player-details';

        const position = document.createElement('span');
        position.textContent = `${player.element_type === 1 ? 'Goalkeeper' : player.element_type === 2 ? 'Defender' : player.element_type === 3 ? 'Midfielder' : 'Forward'}`;
        playerDetails.appendChild(position);

        const form = document.createElement('span');
        form.textContent = `Form: ${player.form}`;
        playerDetails.appendChild(form);

        // const news = document.createElement('span');
        // news.textContent = `News: ${player.news}`;
        // playerDetails.appendChild(news);
        playerDiv.appendChild(document.createTextNode(playerName));
        playerDiv.appendChild(playerDetails);
       
        playersContainer.appendChild(playerDiv);
    });
}


const recommended = {
    async: true,
    crossDomain: true,
    url: 'https://fantasy-premier-league-fpl-api.p.rapidapi.com/api/bootstrap-static/',
    method: 'GET',
    headers: {
        'x-rapidapi-key': 'e145ffa8d9msh2161e45c19b7479p16b55fjsn626ded5d8c97',
        'x-rapidapi-host': 'fantasy-premier-league-fpl-api.p.rapidapi.com'
    }
};

$.ajax(recommended).done(function (response) {
    const elements = response.elements;
    console.log('Elements:', elements);

    const topScorers = elements.sort((a, b) => b.total_points - a.total_points).slice(0, 10);
    const topForms = elements.sort((a, b) => b.form - a.form).slice(0, 10);
    const mostTransferred = elements.sort((a, b) => b.transfers_in_event - a.transfers_in_event).slice(0, 10);
    const mostSelected = elements.sort((a, b) => b.selected_by_percent - a.selected_by_percent).slice(0, 10);

    const recommendedList = document.getElementById('recommendedList');
    recommendedList.innerHTML = ''; 

    // Top Scorers
    const topScorersHeading = document.createElement('h2');
    topScorersHeading.textContent = 'Top Scorers';
    recommendedList.appendChild(topScorersHeading);

    topScorers.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';

        const playerName = `${player.first_name} ${player.second_name}`;
        const playerImage = document.createElement('img');
        playerImage.src = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`;
        playerImage.alt = playerName;
        playerDiv.appendChild(playerImage);

        const playerDetails = document.createElement('div');
        playerDetails.className = 'player-details';

        playerDiv.appendChild(document.createTextNode(playerName));
        playerDiv.appendChild(playerDetails);

        const pointsText = document.createElement('span');
        pointsText.textContent = `${player.total_points} points`;
        playerDiv.appendChild(pointsText);

        recommendedList.appendChild(playerDiv);
    });

    // Recommended Players By Form
    const recommendedByFormHeading = document.createElement('h2');
    recommendedByFormHeading.textContent = 'Best Form';
    recommendedList.appendChild(recommendedByFormHeading);

    topForms.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';

        const playerName = `${player.first_name} ${player.second_name}`;
        const playerImage = document.createElement('img');
        playerImage.src = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`;
        playerImage.alt = playerName;
        playerDiv.appendChild(playerImage);

        const playerDetails = document.createElement('div');
        playerDetails.className = 'player-details';

        playerDiv.appendChild(document.createTextNode(playerName));
        playerDiv.appendChild(playerDetails);

        const formText = document.createElement('span');
        formText.textContent = `Form: ${player.form}`;
        playerDiv.appendChild(formText);

        recommendedList.appendChild(playerDiv);
    });

    // Most Transferred In
    const mostTransferredHeading = document.createElement('h2');
    mostTransferredHeading.textContent = 'Transfers In:';
    recommendedList.appendChild(mostTransferredHeading);

    mostTransferred.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';

        const playerName = `${player.first_name} ${player.second_name}`;
        const playerImage = document.createElement('img');
        playerImage.src = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`;
        playerImage.alt = playerName;
        playerDiv.appendChild(playerImage);

        const playerDetails = document.createElement('div');
        playerDetails.className = 'player-details';

        playerDiv.appendChild(document.createTextNode(playerName));
        playerDiv.appendChild(playerDetails);

        const transfersText = document.createElement('span');
        transfersText.textContent = `Transfers In: ${player.transfers_in_event}`;
        playerDiv.appendChild(transfersText);

        recommendedList.appendChild(playerDiv);
    });

    // Most Selected
    const mostSelectedHeading = document.createElement('h2');
    mostSelectedHeading.textContent = 'Selected %:';
    recommendedList.appendChild(mostSelectedHeading);

    mostSelected.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';

        const playerName = `${player.first_name} ${player.second_name}`;
        const playerImage = document.createElement('img');
        playerImage.src = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`;
        playerImage.alt = playerName;
        playerDiv.appendChild(playerImage);

        const playerDetails = document.createElement('div');
        playerDetails.className = 'player-details';

        playerDiv.appendChild(document.createTextNode(playerName));
        playerDiv.appendChild(playerDetails);

        const selectedText = document.createElement('span');
        selectedText.textContent = `Selected by: ${player.selected_by_percent}%`;
        playerDiv.appendChild(selectedText);

        recommendedList.appendChild(playerDiv);
    });
});


function openTab(tabId) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }
    document.getElementById(tabId).style.display = 'block';
}

function getDifficultyColor(difficulty) {
    switch (difficulty) {
        case 1:
        case 2:
            return 'green';
        case 3:
            return 'orange';
        case 4:
        case 5:
            return 'red';
        default:
            return 'black';
    }
}
