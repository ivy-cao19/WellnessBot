const SlackBot = require("slackbots");
const axios = require("axios");

const bot = new SlackBot({
    token: API_TOKEN,
    name: 'wellness'
});

//Start handler
bot.on('start', () => {
    const params = {
        icon_emoji: ':heart:'
    }

    bot.postMessageToChannel(
        'general', 
        'Be Positive with @wellnessbot!', 
        params
    );


});

//Error handler
bot.on('error', (err) => console.log(err));

//Message handler
bot.on('message', (data) => {
    if (data.type !== 'message'){
        return;
    }

    handleMessage(data.text);
});

function handleMessage(message){
    if(message.includes(' advice')) {
        advice();
    }
    else if (message.includes(' motivation')){
        motivation();
    }
    else if (message.includes(' fact')){
        fact();
    }
    else if (message.includes(' random')){
        randomMessage();
    }
    else if (message.includes(' help')){
        listHelp();
    }
}

//give advice
function advice() {
    axios.get('https://api.adviceslip.com/advice').then(res => {
        const advice = res.data.slip.advice;

        const params = {
            icon_emoji: ':female-teacher:'
        }
    
        bot.postMessageToChannel(
            'general', 
            `Advice: ${advice}`, 
            params
        );
    })
}

//give motivational quote
function motivation() {
    axios.get('https://type.fit/api/quotes').then(res => {

        const rand = Math.floor(Math.random() * 1643);
        const motivationText = res.data[rand].text;
        const motivationAuthor = res.data[rand].author;

        const params = {
            icon_emoji: ':mega:'
        }

        bot.postMessageToChannel('general', `${motivationText} \n --${motivationAuthor}`, params);
    })
}

//give historical fact
function fact() {
    axios.get('http://history.muffinlabs.com/date').then(res => {
        const rand = Math.floor((Math.random() * 3) + 1);
        const randEvent = Math.floor(Math.random() * 10);

        const params = {
            icon_emoji: ':open_book:'
        }

        if (rand === 1){
            const year = res.data.data.Events[randEvent].year;
            const fact = res.data.data.Events[randEvent].text;
            const link = res.data.data.Events[randEvent].links[0].link;

            bot.postMessageToChannel('general', `On this day in ${year}: ${fact} \n To learn more: ${link}`, params);
        }
        else if (rand === 2){
            const year = res.data.data.Births[randEvent].year;
            const fact = res.data.data.Births[randEvent].text;
            const link = res.data.data.Births[randEvent].links[0].link;


            bot.postMessageToChannel('general', `On this day in ${year} ${fact} was born \n To learn more: ${link}`, params);
        }
        else {
            const year = res.data.data.Deaths[randEvent].year;
            const fact = res.data.data.Deaths[randEvent].text;
            const link = res.data.data.Deaths[randEvent].links[0].link;


            bot.postMessageToChannel('general', `On this day in ${year} ${fact} passed away \n To learn more: ${link}`, params);
        }
        
    })
}

function randomMessage(){
    const rand = Math.floor((Math.random() * 3) + 1);
    if (rand == 1) {
        advice();
    }
    else if (rand == 2){
        motivation();
    }
    else {
        fact();
    }
}

function listHelp(){
    const params = {
        icon_emoji: ':question:'
    };

    bot.postMessageToChannel('general', `Type @wellnessbot with either 'advice', 'motivation', or 'fact' to get some positivity!`, params);
}