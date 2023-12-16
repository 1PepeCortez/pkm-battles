const model = require('../tables/pokemons.js');

//

exports.getPokemonData = async (pokemonArray) => {

    const array = [
        { Id: pokemonArray[0] },
        { Id: pokemonArray[1]},
    ];

    return await model.find({ $or: array }).select('Id name wins loses ties -_id');
};

exports.updatePokemon = (pokemonId, wins, loses, ties) => {

    model.updateOne({ Id: pokemonId }, { 
        $set: {
            wins: wins,
            loses: loses,
            ties: ties,
            lastCombat_at: new Date(),
            winRate: wins / (wins + loses + ties)
        },
        $inc: { 
            totalBattles: 1 
        }
    }, (err) => {
        if(err) throw err;
    });
};

exports.getPokemonForNextBattle = async (pokemon_per_round) => {

    var today = new Date();
    today.setHours(today.getHours() - 10);

    const result = await model.aggregate([
        { 
            $match: { 
                $or: [ 
                    { lastCombat_at: null } ,
                    { lastCombat_at: { $lt: today }} 
                ]
            }
        },
        { $sample: { size: pokemon_per_round } },
        { $project: { name: true, Id: true, wins: true, loses: true, ties: true, } },
    ]);

    result.forEach(e => {
        e.votes = 0;
    });

    return result;
};