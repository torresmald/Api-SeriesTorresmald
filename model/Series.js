const mongoose = require('mongoose');

const serieSchema = new mongoose.Schema({
    id: Number,
    title: { type: String, unique: true },
    director: { type: [String]},
    year: { type: Number, min: 1895, max: 2023 },
    genre: { type: [String], enum: ['Action', 'Adventure', 'Animated', 'Biographic', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Historical', 'Horror', 'Mistery', 'Noir', 'Science-fiction', 'Soap Opera', 'Thriller', 'War', 'Western'] },
    picture: String,
    seasons: {type: Number},
    platform: {type: String, enum:['HBO', 'Netflix','Disney Plus+', 'Amazon', 'A3Player', 'FOX', 'TV']},
    synopsis: {type: String},
    isForAdults: Boolean,
    trailer: String,
    favoriteCount : Number
},
{
    timestamps: true
});


const Serie = mongoose.model('Serie', serieSchema);
module.exports = Serie;

