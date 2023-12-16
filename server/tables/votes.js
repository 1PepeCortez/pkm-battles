const mongoose = require('mongoose');

const VotesScheme = new mongoose.Schema(
    {
        ip: {
            type: String,
        }
    }
)

module.exports = mongoose.model('votes', VotesScheme);