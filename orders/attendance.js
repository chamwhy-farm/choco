const { createCanvas, loadImage } = require('canvas');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const moment = require("moment");
const { isDate } = require('moment');

const { createRoundBox, createUser } = require('../util');

const User = require("../schemas/user");

const config = require('../config.json');




const attendanceUser = async (msg, word) => {
    let answer = "";
    let user = await User.findOne({userID: msg.author.id});
    if(!user){
        console.log("create new user! name: " + msg.author.username);
        user = await createUser(msg.author.id);
    }
    if(user.attendance.indexOf(moment().startOf('day').toDate().getTime()) != -1){
        
        answer = "이미 출석하셨습니다.";
    }else{
        //user 수정
        user.addAttend(moment().startOf('day').toDate().getTime());
        user.addChoco(50);
        user.save();
    }
    console.log(user.attendance);

    


    console.log(user.attendance);
    console.log(moment().startOf('day').toDate().getTime());
    console.log(new Date());
    const canvas = createCanvas(720, 720);
    const ctx = canvas.getContext('2d');
    ctx.font = '30px Impact';

    ctx.fillStyle = config.color;
    ctx.fillRect(0, 0, 720, 720);
    const startOfMonth = moment().startOf('month').day()+1;
    const endOfMonth   = moment().endOf('month').day() + 29;
    ctx.fillStyle = "white";
    ctx.fillText(startOfMonth, 30, 30);
    ctx.fillText(endOfMonth, 30, 80);

    
    for(let i = 0; i < 7; i++){
        for(let j = 0; j < 6; j++){
            
            let text = null;
            const isNotDay = j*7 + i + 1 < startOfMonth || j*7 + i + 1 - startOfMonth > endOfMonth;
            const thisDay = moment().startOf('date').add(j*7 + i + 2 - startOfMonth - moment().date(), 'days').toDate().getTime();
            console.log(thisDay);
            if(isNotDay){
                ctx.fillStyle = "gray";
            }else{
                if(user.attendance.indexOf(thisDay) != -1){
                    ctx.fillStyle = config.whiteColor;
                }else{
                    ctx.fillStyle = "white";
                }
                
            }
            let textColor;
            if(user.attendance.indexOf(thisDay) != -1){
                text = "";
            }else{
                if(isNotDay){
                    if(j*7 + i + 1 < startOfMonth){
                        text = j*7 + i + 1 - startOfMonth + moment().add(-1, 'months').endOf('month').date();
                    }else{
                        text = j*7 + i + 1 - startOfMonth - endOfMonth;
                    }
                    textColor = "darkgray";
                }else{
                    text = j*7 + i + 2 - startOfMonth;
                    textColor = config.color;
                }
            }
            
            createRoundBox(ctx, 10, 80, 80, i*100+20, j*100+20+100, text, textColor);
            
        }
    }
    if(answer == ""){
        answer = `${50}초코를 획득하셨습니다!`;
    }
    return {attendanceCanvas: canvas, answer: answer};
};


module.exports = {
    attendance: attendanceUser
}