// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
global.UserWelcomedKey = 'UserWelcomed';

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot((connector));

bot.dialog('/', require('./dialogs/root'));
bot.dialog('bestrated', require('./dialogs/bestrated'));
bot.dialog('findbytype', require('./dialogs/findbytype'));
bot.dialog('findrestaurant', require('./dialogs/findrestaurant'));
bot.dialog('location', require('./dialogs/location'));
bot.dialog('reset', require('./dialogs/reset'))
    .triggerAction({ 
        matches: [/reset/i, /cancel/i, /return/i, /start again/i, /nevermind/i]
    });

// log any bot errors into the console
bot.on('error', function (e) {
    console.error('An error ocurred', e);
});