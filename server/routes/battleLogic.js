const { nextBattle } = require('../utils/utils.js');
const { total_pokemon, battle_time, wait_time, pokemon_per_round } = require('../utils/config.js');

const { createNewTwit } = require('../utils/twitter.js');

//

const { getPokemonData, getPokemonForNextBattle, updatePokemon } = require('../controllers/pokemons.js');
const { removeAllVotes } = require('../controllers/votes.js');
const { saveBattle } = require('../controllers/battles.js');


module.exports = function(io) {

    firstBattle();

    async function firstBattle() {

        const total = total_pokemon - 1;
        var pokemons = [Math.round(Math.random() * total + 1), Math.round(Math.random() * total + 1)];
    
        if(pokemons[0] === pokemons[1]) return firstBattle();
    
        const result = await getPokemonData(pokemons);
        setNewBattle(result[0], result[1]);
    }
    
    function setNewBattle(pokemonOne, pokemonTwo) {
    
        // REMOVE LAST VOTES
    
        removeAllVotes();
    
        //
    
        nextBattle.battleId = 0;
        nextBattle.pokemonOne = pokemonOne;
        nextBattle.pokemonTwo = pokemonTwo;
    
        nextBattle.finishAt = new Date().getTime() / 1000 + battle_time;
        nextBattle.votes = [0, 0];
    
        //
    
        //createNewTwit('\uD83E\uDD4A CURRENT BATTLE \uD83E\uDD4A\n\n#'+nextBattle.pokemonOne.Id+ ' ' +nextBattle.pokemonOne.name+ ' \uD83C\uDD9A #' +nextBattle.pokemonTwo.Id+ ' ' +nextBattle.pokemonTwo.name+ '\n\nVOTE NOW ON: \uD83D\uDD17 https://google.es');
    
        //
    
        io.emit("createBattle", { 
            pokemonOne: nextBattle.pokemonOne,
            pokemonTwo: nextBattle.pokemonTwo,
            finishAt: nextBattle.finishAt,
            votes: nextBattle.votes,

            canVote: true,
        });

        //
    
        setTimeout(() => { 
            checkWinnerBattle();
            selectPokemonNewBattle();
        }, battle_time * 1000);
    }
    
    function checkWinnerBattle() {
    
        saveBattle({ name: nextBattle.pokemonOne.name, votes: nextBattle.votes[0] }, { name: nextBattle.pokemonTwo.name, votes: nextBattle.votes[1] });
    
        //
    
        var twitStr = '';
    
        // CHECK WINNER
    
        if(nextBattle.votes[0] == nextBattle.votes[1]) {
            nextBattle.lastWinnerId = 0;
    
            nextBattle.pokemonOne.ties ++;
            nextBattle.pokemonTwo.ties ++;
    
            //twitStr = '\uD83E\uDD4A POKEMON BATTLE \uD83E\uDD4A\n\n#';
    
        } else if(nextBattle.votes[0] > nextBattle.votes[1]) {
            nextBattle.lastWinnerId = nextBattle.pokemonOne.Id;
    
            nextBattle.pokemonOne.wins ++;
            nextBattle.pokemonTwo.loses ++;
    
            //twitStr = '\uD83E\uDD4A POKEMON BATTLE \uD83E\uDD4A\n\n#' +nextBattle.pokemonOne.Id+ ' ' +nextBattle.pokemonOne.name+ ' wins.\n\n';
    
        } else if(nextBattle.votes[0] < nextBattle.votes[1]) {
            nextBattle.lastWinnerId = nextBattle.pokemonTwo.Id;
    
            nextBattle.pokemonOne.loses ++;
            nextBattle.pokemonTwo.wins ++;
    
            //twitStr = '\uD83E\uDD4A POKEMON BATTLE \uD83E\uDD4A\n\n#' +nextBattle.pokemonTwo.Id+ ' ' +nextBattle.pokemonTwo.name+ ' wins.\n\n';
        }
    
        updatePokemon(
            nextBattle.pokemonOne.Id,
            nextBattle.pokemonOne.wins,
            nextBattle.pokemonOne.loses,
            nextBattle.pokemonOne.ties);
    
        updatePokemon(
            nextBattle.pokemonTwo.Id,
            nextBattle.pokemonTwo.wins,
            nextBattle.pokemonTwo.loses,
            nextBattle.pokemonTwo.ties);
    
        //createNewTwit(twitStr);
    }
    
    async function selectPokemonNewBattle() {
    
        // REMOVE LAST VOTES
    
        removeAllVotes();
    
        // SELECT NEW POKEMONS TO BATTLE
    
        nextBattle.nextPokemons = await getPokemonForNextBattle(pokemon_per_round);
    
        //
    
        nextBattle.battleId = -1;
        nextBattle.finishAt = new Date().getTime() / 1000 + wait_time;

        //
    
        io.emit("createBattle", { 
            battleId: nextBattle.battleId, 
            finishAt: nextBattle.finishAt,
            lastWinnerId: nextBattle.lastWinnerId,
    
            nextPokemons: nextBattle.nextPokemons,
            canVote: true,
        });

        //
    
        setTimeout(() => { 
            newBattleSelected();
        }, wait_time * 1000);
    }
    
    function newBattleSelected() {
        nextBattle.nextPokemons.sort((a, b) =>
           a.votes < b.votes ? 1 : -1
        );
    
        setNewBattle(nextBattle.nextPokemons[0], nextBattle.nextPokemons[1]);
    }
};