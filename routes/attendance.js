'use strict';

const { createCanvas, loadImage } = require('canvas');

const moment = require("moment");
const { isDate } = require('moment');



const config = require('../config.json');
const util = require('../util');




const attendanceUser = async (msg, MsgAth, guildDB) => {
    let answer = "";
    let user = await util.getUser(msg.author.id, msg.member, msg.guild);
    
    if(user.attendance.indexOf(moment().startOf('day').toDate().getTime()) != -1){
        answer = "이미 출석하셨습니다.";
    }else{
        //user 수정
        user.addAttend(moment().startOf('day').toDate().getTime());
        user.addChoco(50, guildDB);
        await user.save();
    }
    const canvas = createCanvas(720, 720);
    const ctx = canvas.getContext('2d');
    ctx.font = '30px Impact, segoe-ui-emoji';

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
            
            util.createRoundBox(ctx, 10, 80, 80, i*100+20, j*100+20+100, text, textColor);
            
        }
    }
    if(answer == ""){
        answer = `${50}초코를 획득하셨습니다!`;
    }
    return (answer, new MsgAth(canvas.toBuffer(), `${msg.author.username}.png`));
};

const addGuildMember = async (channel, user, inviter, MsgAth) => {
    const canvas = createCanvas(600, 140);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1a1a1a";
    util.createRoundBox(ctx, 20, 600, 140, 0, 0, null, null);
    ctx.font = "bold 40px sans-serif, segoe-ui-emoji";
    ctx.fillStyle = "white";
    ctx.fillText(user.username, 140, 70);
    ctx.fillStyle = "DarkGrey";
    ctx.font = "20px sans-serif, segoe-ui-emoji";
    ctx.fillText('has invited' + ((inviter == null) ? "!" : ` by ${inviter.tag}`), 142, 100);

    ctx.beginPath();
	// Start the arc to form a circle
	ctx.arc(70, 70, 50, 0, Math.PI * 2, true);
    ctx.arc(530, 70, 40, 0, Math.PI * 2, true);
	// Put the pen down
	ctx.closePath();
	// Clip off the region you drew on
	ctx.clip();

    const avatar = await loadImage(user.displayAvatarURL({format: 'png'}));
    ctx.drawImage(avatar, 20, 20, 100, 100);
    ctx.restore();
    if(inviter != null){
        const inviterAvatar = await loadImage(inviter.displayAvatarURL({format: 'png'}));
        ctx.drawImage(inviterAvatar, 490, 30, 80, 80);
    }
    
    channel.send('MHU서버에 오신걸 환영합니다!!' + (inviter != null ? `  (${inviter.username} +500)` : ''), new MsgAth(canvas.toBuffer(), `${user.username}_added.png`));
};


module.exports = {
    attendance: attendanceUser,
    addGuildMember: addGuildMember
};