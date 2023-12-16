const express = require('express');
const cors = require('cors');

const { server_hostname, server_port } = require('./utils/config.js');

const server = express();

require('./utils/telegram.js');
require('./utils/mongodb.js');

//

server.use(express.json({ limit: '50mb' }));
server.use(cors());

//

const node_server = server.listen(server_port, function () {
    console.log(`El servidor se está ejecutando en http://${server_hostname}:${server_port}/`);
});

//

const { nextBattle } = require('./utils/utils.js');
const { canVote, registerVote } = require('./controllers/votes.js');
const { getPokemonRanking, resetPokemonRanking } = require('./controllers/ranking.js');

//resetPokemonRanking(); 

//

const { Server } = require('socket.io');
const io = new Server(node_server, { cors: true, origin: ['http://localhost:8000'] });

//

io.on('connection', async (socket) => {

    // ENVIAR INFORMACIÓN DE LA BATALLA ACTUAL

    const clientIp = socket.request.connection.remoteAddress;
    const puedeVotar = await canVote(clientIp);

    console.log('User connected: ' +clientIp);

    // SETUP RANKING

    socket.emit('setupRanking', { ranking: await getPokemonRanking() });

    //

    if(nextBattle.battleId == -1) {

        socket.emit("createBattle", { 
            battleId: nextBattle.battleId, 
            finishAt: nextBattle.finishAt,
            lastWinnerId: nextBattle.lastWinnerId,

            nextPokemons: nextBattle.nextPokemons,

            canVote: puedeVotar,
        });

    } else {

        socket.emit("createBattle", { 
            pokemonOne: nextBattle.pokemonOne,
            pokemonTwo: nextBattle.pokemonTwo,
            finishAt: nextBattle.finishAt,
            votes: nextBattle.votes,

            canVote: puedeVotar,
        });
    }

    // VOTE BATTLE

    socket.on('voteForBattle', (data) => {
        if(nextBattle.battleId == -1 || puedeVotar == false) return socket.emit("responseVoteFor", { respuesta: 'err_voted' });
    
        nextBattle.votes[parseInt(data)] ++;
        registerVote(clientIp);

        io.emit("updateAllVotes", { newVotes: nextBattle.votes });
        socket.emit("responseVoteFor", { respuesta: 'correcto' });
    });

    // VOTE NEXT BATTLE

    socket.on('voteForNext', (data) => {
        if(nextBattle.battleId != -1 || puedeVotar == false) return socket.emit("responseVoteFor", { respuesta: 'err_voted' });

        nextBattle.nextPokemons[parseInt(data.voteFor[0])].votes ++;
        nextBattle.nextPokemons[parseInt(data.voteFor[1])].votes ++;
        registerVote(clientIp);

        socket.emit("responseVoteFor", { respuesta: 'correcto' });
    });
});

//

require('./routes/battleLogic.js')(io);