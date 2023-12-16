const { telegram_token } = require('../utils/config.js');
const { nextBattle, getRankEmotes } = require('../utils/utils.js');
const { getLastBattle } = require('../controllers/battles.js');
const { getRankingSorted, getRankPokemon } = require('../controllers/ranking.js');

//

const url = "https://api.telegram.org/bot" +telegram_token;
var offset = 0;

startTelegram();

//

async function startTelegram() {

    while(true) {

        const json = await getNewMessages();

        //

        var messagesLen = json.result.length;
        if (messagesLen > 0) {

            offset = json.result[messagesLen - 1].update_id + messagesLen;

            json.result.forEach(async e => {
                if(e.message == undefined || e.message.text == undefined ) {
                    return;
                }

                const isCommand = e.message.text.startsWith('/');

                if(isCommand == false) return;

                var answer = await processCommand(e.message.text);
                if(answer == '') return;
                sendMessage(answer, e.message.chat.id, e.message.message_id);
            });
        }
    }
}

async function getNewMessages() {

    const data = await fetch(url+ "/getupdates",
    {
        body: JSON.stringify({ offset: offset, limit: 100, timeout: 600, allowed_updates: ['message'] }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    return await data.json();
}

async function processCommand(message) {
    
    var answer = '';
    const commandType = message.split(' ');

    if(commandType[0] == '/ranking') {

        answer = '\uD83E\uDD4A <b>'

        var value = 'winRate';
        var type = 'desc';

        if(commandType.length == 3) {

            if(commandType[2] == 'asc') {
                type = 'asc';
                answer += 'LOWEST '; 

            } else {
                answer += 'HIGHEST '; 
            }

            //

            if(commandType[1] == 'wins' || commandType[1] == 'loses' || commandType[1] == 'ties') { 
                value = commandType[1];
                answer += commandType[1].toUpperCase(); 

            } else if(commandType[1] == 'battles') { 
                value = 'totalBattles';
                answer += 'TOTAL BATTLES'; 

            } else {
                answer += 'WINRATE'; 
            }

        } else {
            answer += 'HIGHEST WINRATE';
        }

        answer += '</b> \uD83E\uDD4A\n\n';

        //

        var sortObject = {};
        sortObject[value] = type;

        try {
            var result = await getRankingSorted(sortObject, 3);

            result.forEach((e, index) => {
                answer += getRankEmotes(index)+ ' ' +e.name;
                answer += ' (' +e.wins+ '/' +e.loses+ '/' +e.ties+ ')\n';
            });

            answer += '\n\uD83D\uDD17 <a href="https://pokemon-battles.com">www.pokemon-battles.com</a>';

        } catch(err) {
            throw err;
        }

    } else if(commandType[0] == '/rank') {
        
        if(commandType[1] == undefined) {
            return '<b>Please, use this command with the following syntax:</b>\n\n<i>/rank [pokemon\'s name/pokedex_id]</i>';
        }

        try {
            var result = await getRankPokemon(commandType[1]);

            if(result.length == 0) {
                return '<b>We can not find that pokemon, use:</b>\n\n<i>/rank [pokemon\'s name/pokedex_id]</i>'; 
            }

            answer += '<b>#' +result[0].Id+ ' ' +result[0].name+ '</b>\n\n';

            const total = result[0].wins + result[0].loses + result[0].ties;

            if(total == 0) {
                answer += '<b>Not battles found.</b>';

            } else {

                answer += 'Wins: ' +result[0].wins+ '\n';
                answer += 'Loses: ' +result[0].loses+ '\n';
                answer += 'Ties: ' +result[0].ties+ '</i>\n\n';

                answer += '<b>' +(result[0].wins / total * 100).toFixed(2)+ '% winrate on ' +total+ ' battles.</b>';
            }

        } catch(err) {
            throw err;
        }

    } else if(commandType[0] == '/battle') {

        if(nextBattle.battleId == -1) {

            answer += '\uD83E\uDD4A <b>SELECT BATTLE</b> \uD83E\uDD4A\n\n';

            const len = nextBattle.nextPokemons.length - 1;

            nextBattle.nextPokemons.forEach((e, index) => {
                answer += e.name;
                if(len > index) answer += ' / ';
            });

            answer += '\n\n<b>VOTE NOW ON:</b> \uD83D\uDD17 <a href="https://pokemon-battles.com">www.pokemon-battles.com</a>';

        } else {
            answer += '\uD83E\uDD4A <b>CURRENT BATTLE</b> \uD83E\uDD4A\n\n';
            answer += '<i>' +nextBattle.pokemonOne.name+ ' \uD83C\uDD9A ' +nextBattle.pokemonTwo.name+ '</i>\n\n';
            answer += '<b>VOTE NOW ON:</b> \uD83D\uDD17 <a href="https://pokemon-battles.com">www.pokemon-battles.com</a>';
        }

    } else if(commandType[0] == '/lastbattle') {

        const data = await getLastBattle();

        answer += '\uD83E\uDD4A <b>LAST BATTLE</b> \uD83E\uDD4A\n\n';

        if(data.pokemons[0].votes == data.pokemons[1].votes) {
            answer += '<b>TIE:</b> <i>' +data.pokemons[0].name+ ' and ' +data.pokemons[1].name+ ' with ' +data.pokemons[0].votes+ ' votes.</i>';

        } else if(data.pokemons[0].votes > data.pokemons[1].votes) {
            answer += '<b>WINNER:</b> <i>' +data.pokemons[0].name+ ' with ' +data.pokemons[0].votes+ ' votes.</i>\n';
            answer += '<b>LOSER:</b> <i>' +data.pokemons[1].name+ ' with ' +data.pokemons[1].votes+ ' votes.</i>\n';

        } else if(data.pokemons[0].votes < data.pokemons[1].votes) {
            answer += '<b>WINNER:</b> <i>' +data.pokemons[1].name+ ' with ' +data.pokemons[1].votes+ ' votes.</i>\n';
            answer += '<b>LOSER:</b> <i>' +data.pokemons[0].name+ ' with ' +data.pokemons[0].votes+ ' votes.</i>\n';
        }

    } else if(commandType[0] == '/help') {
        answer += '<b>COMMANDS: </b>\n\n<i>';

        answer += '/battle\n';
        answer += '/lastbattle\n';
        answer += '/ranking [winrate/wins/loses/ties/battles] [asc/desc]\n';
        answer += '/rank [pokemon\'s name/pokedex_id]</i>';
    }

    return answer;
}

function sendMessage(mensaje, chatid, messageid) {
    
    fetch(url+ "/sendmessage",
    {
        method: 'POST',

        body: JSON.stringify({

            text: mensaje,
            chat_id: chatid,
            reply_to_message_id: messageid,
            disable_web_page_preview: false,
            disable_notification: false,
            parse_mode: 'HTML'
        
        }),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .catch(err => console.error(err));
}