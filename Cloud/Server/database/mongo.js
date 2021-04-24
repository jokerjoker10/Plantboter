const {MongoClient} = require('mongodb');
const MongoSetting = require('./connection.json');

let database = null;

async function connectDatabase(){
    const connection = await MongoClient.connect(MongoSetting.connectionstring, {useNewUrlParser: true})
    database = connection.db();
}

async function getDatabase() {
    if(!database) await connectDatabase();

    return database;
}

module.exports = {
    getDatabase,
    connectDatabase
}