const {send, json} = require('micro');
const {createConnection} = require("mysql");
const cfg = require("./config.json");
const microCors = require('micro-cors');
const cors = microCors({allowMethods: ['GET']});

const connection = createConnection({
    host: 'localhost',
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    timezone: 'local',
});

connection.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log('Connected as ID ' + connection.threadId);
});


const main = async (request, response) => {
    if (request.url.startsWith("/current/")){
        current(response);
        return;
    } else if (request.url.indexOf("/?timestamp=") !== -1) {
        const timestamp = decodeURI(request.url.split("/?timestamp=")[1]);
        byTimestamp(timestamp, response);
        return;
    }
    send(response, 400, 'Bad Request');
};

const current = (response) => {
    const query = "SELECT created_at, current_status, message, comment" +
        " FROM status ORDER BY created_at DESC LIMIT 1";
    connection.query(query, (err, res) => {
        if (err) {
            console.log(err);
            send(response, 500, 'Internal Server Error');
        } else {
            send(response, 200, res);
        }
    });
};

const byTimestamp = (timestamp, response) => {
    if (typeof timestamp !== "undefined" && !isNaN(Date.parse(timestamp))) {
        const query = "SELECT created_at, current_status, message, comment" +
            " FROM status WHERE created_at >= ? ORDER BY created_at DESC";
        connection.query(query, [timestamp], (err, res) => {
            if (err) {
                console.log(err);
                send(response, 500, 'Internal Server Error');
            } else {
                send(response, 200, res);
            }
        });
    }
};

module.exports = cors(main);