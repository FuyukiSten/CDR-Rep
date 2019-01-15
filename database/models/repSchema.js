const mongoose = require('mongoose');

const repSchema = mongoose.Schema({
    _id: String,
    guildID: String,
    repv: Number,
    reptomedal: Number
});

module.exports = mongoose.model("rep", repSchema);
