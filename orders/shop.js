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
    return {buyCanvas: canvas, itemName: 'test'};
};

const getChoco = async (msg) => {
    const user = getUser(msg.author.id);
    const usersChoco = user.getChoco();
    const chocoCanvas = createCanvas(900, 300);
    const chocoCtx = chocoCanvas.getContext('2d');
    chocoCtx.font = "100px Impact";
    createRoundBox(chocoCtx, 40, 900, 300, 0, 0, usersChoco, 'gray');
    return {chococan: chocoCanvas, chocotext: `초코는 상점에서 이용이 가능합니다`};
};

const getLv = async (msg) => {
    const user = getUser(msg.author.id);
    const userLv = user.getLv();
    const lvCan = createCanvas(900, 300);
    const lvCtx = lvCan.getContext('2d');
    
    return {lvcan: lvCan, lvtext: `레벨은 게임이나 상점, 권한에 영향을 줍니다`};
}

async function getUser(userID){
    let user = await User.findOne({userID: msg.author.id});
    if(!user){
        user = await createUser(msg.author.id);
    }
    return user;
}

module.exports = {
    shop: shop,
    getChoco: getChoco,
};