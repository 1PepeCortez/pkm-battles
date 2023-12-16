const model = require('../tables/pokemons.js');

//

exports.getPokemonRanking = async () => {
    return await model.find({ }).select('name Id wins loses ties').sort({ winRate: 'desc' });
};

exports.getRankingSorted = async (sortObject, limit) => {
    return await model.find({ }).select('name Id wins loses ties').sort(sortObject).limit(limit);
};

exports.getRankPokemon = async (pokemonInfo) => {

    var findObject = {};

    if(isNaN(pokemonInfo) == false) findObject.Id = parseInt(pokemonInfo);
    else {
        findObject.name = pokemonInfo.charAt(0).toUpperCase() + pokemonInfo.slice(1);
    }

    return await model.find(findObject).select('name Id wins loses ties');
};

exports.resetPokemonRanking = async () => {
    const result = await model.updateMany({ }, { wins: 0, loses: 0, ties: 0, winRate: 0.0, totalBattles: 0, lastCombat_at: null });
    console.log('POKEMONS RESET: ' +result.modifiedCount);
};