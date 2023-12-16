const mongoose = require('mongoose');

const BattlesScheme = new mongoose.Schema(
    {
        created_at: {
            type: Date,
            default: Date.now,
        },
        pokemons: [],
        total_votes: {
            type: Number,
            default: 0,
        }
    }
)

module.exports = mongoose.model('battles', BattlesScheme);