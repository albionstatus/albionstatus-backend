const {send, json} = require('micro');
const {createConnection, escape} = require("mysql");
const cfg = require("./config.json");
const connection = createConnection({
    host: 'localhost',
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    timezone: 'Z',
});
connection.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log('Connected as ID ' + connection.threadId);
});


module.exports = async (request, response) => {
    const timestamp = request.url.split("/?timestamp=")[1];
    if (typeof timestamp !== "undefined" && !isNaN(Date.parse(timestamp))) {
        const query = "SELECT created_at, status, message, comment FROM" +
            " status WHERE created_at >= ? ORDER BY created_at DESC";
        connection.query(query, [escape(timestamp)], (err, res) => {
            if (err) {
                console.log(err);
                send(response, 500, 'Internal Server Error');
            } else {
                send(response, 400, res);
            }
        });
    } else {
        send(response, 400, 'Bad Request');
    }
};
