const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Guild = new Schema({
    gName: String,
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
        lang: Number,
        isPro: Boolean,
        promotion: Boolean
    }
});
mongoose.model("Guild", Guild);