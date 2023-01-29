const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = 'mongodb+srv://root:gtms7QsEcl4IbPJq@series-torresmald.70x9b0s.mongodb.net/?retryWrites=true&w=majority"'

const connect = () => {
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

module.exports = connect;