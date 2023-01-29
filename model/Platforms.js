const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    series: [{ type: mongoose.Types.ObjectId, ref: 'Series' }],
    picture: String
},
    {
        timestamps: true
    });


const Platform = mongoose.model('Platform', platformSchema);
module.exports = Platform;