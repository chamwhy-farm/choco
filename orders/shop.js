const { createCanvas, loadImage } = require('canvas');
const { createRoundBox, createUser } = require('../util');

const User = require("../schemas/user");

const shop = (msg) => {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    
};

const buy = (msg) => {
    const canvas = createCanvas(800, 200);
    const ctx = canvas.getContext('2d');
    return canvas;
};

const getChoco = async (msg) => {
    let user = await User.findOne({userID: msg.author.id});
    if(!user){
        user = await createUser(msg.author.id); 
    }
    return user.getChoco();
};

module.exports = {
    shop: shop,
    getChoco: getChoco
};