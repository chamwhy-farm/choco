const getTime = (word)=>{
    if(word.length == 0) return 0;
    const type = "dhms";
    const typeCount = [1000 * 60 * 60 * 24, 1000 * 60 * 60, 1000 * 60, 1000];
    let ms;
    for(let i = 0 ; i < word.length; i++){
        const timeType = type.indexOf(word[i].slice(0, -1));
        
        const time = word[i].slice(-1);
        if(isNaN(Number(time))) return null;
        if(timeType == -1) return null;
        ms += Number(time) * typeCount[timeType];
    }
    return ms;
};

const config = require("./config.json");

const getWord = (msg, type) => {
    const answer = config.word[type][msg];
    if(answer === undefined) return null;
    return answer[getRandomInt(0, answer.length)];
};

const getRandomInt = (startInt, lastInt)=>{
    return Math.floor(Math.random() * (lastInt - startInt)) + startInt;
}

module.exports = {
    getTime: getTime,
    getWord: getWord,
    getRandomInt: getRandomInt
}