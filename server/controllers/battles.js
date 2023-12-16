const model = require('../tables/battles.js');

//

exports.saveBattle = (pokemonOne, pokemonTwo) => {

    const battle = new model;

    battle.pokemons.push(pokemonOne);
    battle.pokemons.push(pokemonTwo);
    battle.total_votes = pokemonOne.votes + pokemonTwo.votes;

    //

    battle.save();
};

exports.getLastBattle = async () => {
    var result = await model.find({ }).sort({ created_at: 'desc' }).limit(1);
    return result[0];
};