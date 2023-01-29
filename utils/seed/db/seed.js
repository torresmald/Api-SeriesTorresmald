require('dotenv').config();
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL;
const fs = require('fs');
const Serie = require('../../../model/Series.js');

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    const allSeries = await Serie.find();

    if (allSeries.length) {
        await Serie.collection.drop();
    }
}).catch((error) => {
    console.log(`Ha habido un error al borrar las Películas ${error}`);
}).then(async () => {
    const data = fs.readFileSync('./utils/seed/db/series.json');
    const parsedData = JSON.parse(data);
    const seriesDoc = parsedData.map((serie) => {
        return new Serie(serie);
    });
    await Serie.insertMany(seriesDoc);
    console.log('Series añadidas con exito');
}).catch((error) => {
    console.log(`Ha habido un error al añadir las Series ${error}`);
}).finally(() => mongoose.disconnect());