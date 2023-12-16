const mongoose = require('mongoose');
const { mongo_db_hostname, mongo_db_port, mongo_db_name } = require('../utils/config.js');

const url = `mongodb://${mongo_db_hostname}:${mongo_db_port}/${mongo_db_name}`;

//

mongoose.set('strictQuery', true);

mongoose.connect(
    url,
    {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if(err) return console.log(err);
        console.log('[MONGO_DB] Conexión realizada correctamente.')
    }
);