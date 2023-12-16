const model = require('../tables/votes.js');

//

exports.removeAllVotes = () => {

    model.deleteMany({ }, (err) => {
        if(err) throw(err);
    });
};

exports.canVote = async (ip_address) => {
    const result = await model.find({ ip: ip_address });

    if(result.length == 0) return true;
    return false;
}

exports.registerVote = (ip_address) => {
    
    model.create({ ip: ip_address }, (err) => {
        if(err) throw err;
    });
}