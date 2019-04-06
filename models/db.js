const r = require('rethinkdb')

module.exports = async() => {
    const connection = await r.connect({
        host: 'localhost',
        port: '28015',
        db: 'getteamDB'
    })
    return connection;
}

