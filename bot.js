const { Telegraf } = require('telegraf');
require('dotenv').config();
const db = require('./database');

const bot = new Telegraf(process.env.BOT_TOKEN);

let users = {};
const newUser = (user) => {
    users[user] = {
        state: 1,
        name: '',
        college: '',
        know: '',
        languages: '',
        framework: '',
        projects: false,
        level: 0,
        github: '',
    }
}
bot.command('about', (ctx) => ctx.reply('I am Marvel. I was created by: \nSrajan Gupta\nSakshi Agrawal\nSwati Prajapati'));
bot.command('help', (ctx) => ctx.reply('/about: Tells about the Bot\n/begin: Start the Bot Tasks(Run it)\n/help: List Available Options'));
bot.command('begin', (ctx) => {
    const user = ctx.from.username;
    newUser(user);
    ctx.reply('What is your name?');
})

const name = (user, ctx) => {
    users[user].name = ctx.message.text;
    ctx.reply('Which college are you from?');
    users[user].state++;
}

const college = (user, ctx) => {
    users[user].college = ctx.message.text;
    users[user].state++;
    const keyboard = [
        ['Friends'],
        ['Whatsapp Group'],
        ['LinkedIn'],
        ['Facebook']
    ];
    ctx.reply('How did you get to know about SideProjects?', { reply_markup: { keyboard, one_time_keyboard: true } });
}
const know = (user, ctx) => {
    users[user].know = ctx.message.text;
    users[user].state++;
    const keyboard = [
        ['Java'],
        ['JavaScript'],
        ['Python'],
        ['CSS'],
        ['C++'],
        ['C'],
        ['C#'],
        ['HTML'],
        ['HTML5'],
        ['PHP'],
        ['Objective C'],
        ['SQL'],
        ['R'],
        ['Ruby']
    ];
    ctx.reply('Which programming languages do you know?', { reply_markup: { keyboard, one_time_keyboard: true } });
}
const languages = (user, ctx) => {
    users[user].languages = ctx.message.text;
    users[user].state++;
    ctx.reply('Do you know any frameworks? Please list them.');
}
const framework = (user, ctx) => {
    users[user].framework = ctx.message.text;
    users[user].state++;
    const keyboard = [
        ['Yes'],
        ['No']
    ];
    ctx.reply('​ Have you previously done any projects?', { reply_markup: { keyboard, one_time_keyboard: true } });
}
const projects = (user, ctx) => {
    users[user].projects = ctx.message.text === 'Yes';
    users[user].state++;
    const keyboard = [
        ['Very Confident'],
        ['Confident Enough'],
        ['Still Learning']
    ];
    ctx.reply('How confident are you about your programming skills?', { reply_markup: { keyboard, one_time_keyboard: true } });
}
const confident = (user, ctx) => {
    let confidence;
    switch (ctx.message.text) {
        case 'Very Confident':
            confidence = 3;
            break;
        case 'Confident Enough':
            confidence = 2;
            break;
        case 'Still Learning':
            confidence = 1;
            break;
    }
    users[user].level = confidence;
    users[user].state++;
    ctx.reply('​ Please share your github repository for us to keep a track of your work.');
}
const github = (user, ctx) => {
    users[user].github = ctx.message.text;
    ctx.reply('Thanks for your response');
    ctx.reply(JSON.stringify(users[user]));
    save(user);
}
const save = user => {
    console.log(users[user]);
    const obj = users[user];
    db.execute('insert into data values(?,?,?,?,?,?,?,?,?)', [user, obj.name, obj.college, obj.know, obj.languages, obj.framework, obj.projects, obj.level, obj.github]);
}
bot.on('text', ctx => {
    const user = ctx.from.username;
    if (users[user]) {
        switch (users[user].state) {
            case 1:
                name(user, ctx);
                break;
            case 2:
                college(user, ctx);
                break;
            case 3:
                know(user, ctx);
                break;
            case 4:
                languages(user, ctx);
                break;
            case 5:
                framework(user, ctx);
                break;
            case 6:
                projects(user, ctx);
                break;
            case 7:
                confident(user, ctx);
                break;
            case 8:
                github(user, ctx);
                break;
            default:
                ctx.reply('Please start with /begin');
        }
    }
});
bot.launch();