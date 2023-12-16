const mongoose = require('mongoose');

const PokemonScheme = new mongoose.Schema(
    {
        Id: {
            type: Number,
            unique: true,
        },
        name: {
            type: String,
        },
        totalBattles: {
            type: Number,
            default: 0,
        },
        wins: {
            type: Number,
            default: 0,
        },
        loses: {
            type: Number,
            default: 0,
        },
        ties: {
            type: Number,
            default: 0,
        },
        winRate: {
            type: mongoose.Decimal128,
            default: 0.0,
            get: getWinRate
        },
        lastCombat_at: {
            type: Date,
            default: null
        }
    }
)

function getWinRate(value) {
    return parseFloat(value);
}

module.exports = mongoose.model('pokemon', PokemonScheme);