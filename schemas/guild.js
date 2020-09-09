const mongoose = require("mongoose");
const ObjectId = require("mongoose/lib/schema/objectid");
const Schema = mongoose.Schema;

const Guild = new Schema({
    gID: {type: Number, required: true},
    mute: {
        choco: [Number],
        msg: [Number],
        promotion: [Number],

    },
    permission: {
        mng: [Number],
        mute: [Number],

    },
    set: {
        lang: {type: String, default: "eng"},
        isPro: Boolean,
        promotion: Boolean
    },
});
module.exports = mongoose.model("Guild", Guild);