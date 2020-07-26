const { createCanvas, loadImage } = require('canvas');


const moment = require("moment");



function createRoundeBox(ctx, r, w, h, x1, y1){
    ctx.beginPath();
    ctx.arc(x1 + r, y1 + r, r, Math.PI, Math.PI*1.5, false);
    ctx.fill();
    ctx.fillRect(x1 + r, y1, w - 2*r, r);
    ctx.arc(x1 + w - r, y1 + r, r, Math.PI*1.5, Math.PI*2, false);
    ctx.fill();
    ctx.fillRect(x1, y1 + r, w, h - 2*r);
    ctx.arc(x1 + r, y1 + h - r, r, Math.PI*0.5, Math.PI*1, false);
    ctx.fill();
    ctx.fillRect(x1 + r, y1 + h - r, w - 2*r, r);
    ctx.arc(x1 + w - r, y1 + h - r, r, 0, Math.PI*0.5, false);
    ctx.fill();
    ctx.closePath();
}

const attendanceUser = (msg, word) => {
    const canvas = createCanvas(720, 620);
    const ctx = canvas.getContext('2d');
    ctx.font = '30px Impact'

    ctx.fillStyle = "#55352b";
    ctx.fillRect(0, 0, 720, 620);
    const startOfMonth = moment().startOf('month').day()+1;
    const endOfMonth   = moment().endOf('month').day() + 29;
    ctx.fillStyle = "white";
    ctx.fillText(startOfMonth, 30, 30);
    ctx.fillText(endOfMonth, 30, 80);

    for(let i = 0; i < 7; i++){
        for(let j = 0; j < 5; j++){
            
            
            if(j*5 + i + 1 < startOfMonth || i*5 + j + 1 > endOfMonth){
                ctx.fillStyle = "gray";
            }else{
                ctx.fillStyle = "white";
            }
            createRoundeBox(ctx, 10, 80, 80, i*100+20, j*100+20+100);
        }
    }
    return canvas;
};


module.exports = {
    attendance: attendanceUser
}