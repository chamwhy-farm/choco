const mongoose = require("mongoose");

const db = mongoose.connection;
db.on("error", console.error);

db.once("open", ()=>{
    console.log("connect to mongoose server!");
});

mongoose.connect("mongodb://localhost/discord_choco");