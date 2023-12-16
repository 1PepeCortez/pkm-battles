const emotes = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49'];

var nextBattle = {
    battleId: -1,
    pokemonOne: {},
    pokemonTwo: {},
    finishAt: 0,
    votes: [0, 0],
    nextPokemons: [],

    lastWinnerId: -1,
};

//

function getVotos() {
    
}

function getRankEmotes(rank) { 
    return emotes[rank];
}

module.exports = {

    nextBattle,

    getRankEmotes,
}