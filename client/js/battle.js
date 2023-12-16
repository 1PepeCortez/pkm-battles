var timerBattle = null;
const btnVote = [document.getElementById('pokemon-vote-1'), document.getElementById('pokemon-vote-2')];

//

socket.on("createBattle", function (data) {

    // CLEAR INTERVAL

    if(timerBattle != null) clearInterval(timerBattle);

    //

    if(data.battleId == -1) {
        showSelectBattle();

        createTableSelect(data.nextPokemons);
        putLastWinner(data.lastWinnerId);

        document.getElementById('select-pokemon').disabled = !data.canVote;

        createTimer(data.finishAt);
        return;
    }

    btnVote[0].disabled = !data.canVote;
    btnVote[1].disabled = !data.canVote;

    hideSelecttBattle();

    createPokemon(1, data.pokemonOne);
    createPokemon(2, data.pokemonTwo);

    updateBattle(data.votes);

    createTimer(data.finishAt);
});

function createPokemon(index, pokemonInfo) {

    var finalStr = '';

    finalStr = pokemonInfo.name+ '<br/>';
    finalStr += '<span style="color: green">W:' +pokemonInfo.wins+ '</span> <span style="color:grey">&middot;</span> ';
    finalStr += '<span style="color: red">L:' +pokemonInfo.loses+ '</span> <span style="color:grey">&middot;</span> ';
    finalStr += '<span style="color: orange">T:' +pokemonInfo.ties+ '</span>';
    //finalStr += pokemonInfo.winRate+ '%';

    document.getElementById('pokemon-info-' +index).innerHTML = finalStr;
    document.getElementById('pokemon-img-' +index).src = './imagenes/pokemons/' +pokemonInfo.Id+ '.png';

    document.getElementById('pokemon-vote-' +index).onclick = async () => {

        btnVote[0].disabled = true;
        btnVote[1].disabled = true;

        socket.emit('voteForBattle', index - 1);
    };
}

socket.on("responseVoteFor", function (data) {
    if(data.respuesta == 'err_voted') return crearAlerta('¡Ya has votado!');
    crearAlerta('¡Tu voto ha sido enviado correctamente!');
});

socket.on("updateAllVotes", function (data) {
    updateBattle(data.newVotes);
});

function createTimer(finishAt) {

    const minutesHTML = document.getElementById('time-battle-min');
    const secondsHTML = document.getElementById('time-battle-sec');

    const { minutes, seconds } = getCounterTime(finishAt);

    minutesHTML.innerHTML = (minutes <= 9 ? '0' : '') +minutes;
    secondsHTML.innerHTML = (seconds <= 9 ? '0' : '') +seconds;

    timerBattle = setInterval((finishAt) => {
        const { minutes, seconds } = getCounterTime(finishAt);

        minutesHTML.innerHTML = (minutes <= 9 ? '0' : '') +minutes;
        secondsHTML.innerHTML = (seconds <= 9 ? '0' : '') +seconds;

        if(minutes <= 0 && seconds <= 0) {
            clearInterval(timerBattle);
        }
    }, 1000, finishAt);
}

function getCounterTime(finishAt) {

    const today = new Date().getTime() / 1000;
    const dif = finishAt - today;

    return {
        minutes: Math.floor(dif / 60),
        seconds: Math.floor(dif % 60),
    }
}

function updateBattle(votes) {

    var totalVotes = votes[0] + votes[1];

    if(totalVotes == 0) {
        
        document.getElementById('pokemon-progress-1').style.width = '100%';
        document.getElementById('pokemon-progress-2').style.width = '100%';

        document.getElementById('pokemon-percent-1').innerHTML = '50%';
        document.getElementById('pokemon-percent-2').innerHTML = '50%';

        //

        document.getElementById('total-votes').innerHTML = 0;
        return;
    }

    var perCent = 0;

    if(votes[0] !== 0) {
        perCent = votes[0] / totalVotes * 100;
    }
    var inversePerCent = 100 - perCent;
    document.getElementById('pokemon-progress-1').style.width = perCent+ '%';
    document.getElementById('pokemon-progress-2').style.width = inversePerCent+ '%';

    document.getElementById('pokemon-percent-1').innerHTML = (perCent).toFixed(2)+ '%';
    document.getElementById('pokemon-percent-2').innerHTML = (inversePerCent).toFixed(2)+ '%';

    //

    document.getElementById('total-votes').innerHTML = totalVotes;
}

function hideSelecttBattle() {
    document.getElementById('table-battle').style.display = 'block';

    document.getElementById('battle-progress').style.display = 'block';

    document.getElementById('table-select-pokemon').style.display = 'none';
    document.getElementById('battle-last-winner').style.display = 'none';
}

function showSelectBattle() {
    document.getElementById('table-battle').style.display = 'none';

    document.getElementById('battle-progress').style.display = 'none';

    document.getElementById('table-select-pokemon').style.display = 'block';
    document.getElementById('battle-last-winner').style.display = 'block';
}

function putLastWinner(Id) {
    if(Id == 0) document.getElementById('last-winner-text').innerHTML = 'LAST WINNER:<br>TIES';
    else {
        document.getElementById('last-winner-text').innerHTML = 'LAST WINNER:<br><img src="./imagenes/pokemons/' +Id+ '.png"/>';
    }
}

function createTableSelect(listPokemons) {

    pokemonSelected = [];

    const table = document.getElementById('table-final');
    var total = 3;
    var trElement = null;

    table.innerHTML = '';

    listPokemons.forEach((e, index) => {

        if(total % 3 == 0 && trElement != null) {
            table.appendChild(trElement);
            trElement = null;
        }

        if(total % 3 == 0) {
            trElement = document.createElement('tr');
        }
        
        var td = document.createElement('td');
        td.innerHTML = '<img src="./imagenes/pokemons/' +e.Id+ '.png"/>';
        td.onclick = () => selectedPokemon(index);
        td.id = 'selected-index-' +index;

        trElement.appendChild(td);

        total ++;
    });
    
    if(trElement != null) {
        table.appendChild(trElement);
    }
}