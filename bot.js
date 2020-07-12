const { Telegraf } = require('telegraf');
const session = require('telegraf/session');

const token = '1210145729:AAHvcntXxATHJVK4XImTXAC8plMNpyJRcyQ';
const bot = new Telegraf(token);
bot.use(session());

let users = {};

bot.command('start', (ctx) => ctx.reply('Hello. I am Marvel. Please use command /help to know about available options'));
bot.command('about', (ctx) => ctx.reply('I am Marvel. I was created by: \nSrajan Gupta\nSakshi Agrawal\nSwati Prajapati'));
bot.command('help', (ctx) => ctx.reply('/start: Begin\n/about: Tells about the Bot\n/play: Accepts the gender\n/help: List Available Options'));
bot.command('play', (ctx) => {
    users[ctx.from.username] = {
        state: 1,
        gender: '',
        name: ctx.from.first_name + ' ' + ctx.from.last_name
    }
    ctx.reply('Select Your Gender: ', {
        reply_markup: {
            keyboard: [
                ['Male', 'Female']
            ],
            one_time_keyboard: true
        }
    })
});
bot.on('text', (ctx) => {
    if (users[ctx.from.username].state === 1) {
        users[ctx.from.username].gender = ctx.message.text;
        console.log(users);
    }
    ctx.reply(`${ctx.from.first_name} ${ctx.from.last_name} sent ${ctx.message.text}`)
});
bot.launch();