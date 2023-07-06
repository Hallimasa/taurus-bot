require('dotenv').config();
const moment = require('moment');
const { Client, IntentsBitField, EmbedBuilder, time } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) =>{
    console.log(`✅ ${c.user.tag} is online`)
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // BUILD COMMAND

    if ((interaction.commandName === 'build') && (interaction.channelId === process.env.CHAT_BUILD_ID || interaction.channelId === process.env.CHAT_TESTBUILD_ID)){

        const buildchoice = interaction.options.get('warframe').value;
        const fs = require('fs');
        const path = (`./src/embeds/${buildchoice}.json`);


        if ((typeof(buildchoice) != 'undefined')&&(fs.existsSync(path))){

            const embed = (new EmbedBuilder(require(`../src/embeds/${buildchoice}.json`))).data ;

            if (((embed[0]).title != '') &&
                ((embed[1]).title != '') &&
                ((embed[2]).title != '') &&
                ((embed[3]).title != '') &&
                ((embed[4]).title != '') ){
                    interaction.reply({ embeds: [embed[0],embed[1],embed[2],embed[3],embed[4]] }).then(msg => setTimeout(() => msg.delete(), 300000));
                    return;
            } else if (((embed[0]).title != '') &&
                ((embed[1]).title != '') &&
                ((embed[2]).title != '') &&
                ((embed[3]).title != '') ){
                    interaction.reply({ embeds: [embed[0],embed[1],embed[2],embed[3]] }).then(msg => setTimeout(() => msg.delete(), 300000));
                    return;
            } else if (((embed[0]).title != '') &&
                ((embed[1]).title != '') &&
                ((embed[2]).title != '') ){
                    interaction.reply({ embeds: [embed[0],embed[1],embed[2]] }).then(msg => setTimeout(() => msg.delete(), 300000));
                    return;
            } else if (((embed[0]).title != '') &&
                ((embed[1]).title != '') ){
                    interaction.reply({ embeds: [embed[0],embed[1]] }).then(msg => setTimeout(() => msg.delete(), 300000));
                    return
            } else if (((embed[0]).title != '') ){
                    interaction.reply({ embeds: [embed[0]] }).then(msg => setTimeout(() => msg.delete(), 300000));
                    return
            };
        };
        
        // EIDOLON COMMAND 

    } else if (interaction.commandName === 'eidolon'){
        fetch("https://api.warframestat.us/pc/cetusCycle/")
            .then(res => {
            return res.json();
        })
            .then(data => {
                let daystatusON = "";
                let daystatusOFF = "";
                let matches = "";
                let hours = 0;
                let thumbstatus = "";
                let embedcolor = '';
                let currentDate = new Date();
                const timeRegex1 = /(\d+)h (\d+)m (\d+)/;
                const timeRegex2 = /(\d+)m (\d+)/;

                if (data.timeLeft.match(timeRegex2)){
                    matches = data.timeLeft.match(timeRegex2);   
                } else if (data.timeLeft.match(timeRegex1)) {
                    matches = data.timeLeft.match(timeRegex1);
                    hours = parseInt(matches[0]);    
                };

                let minutes = parseInt(matches[1]);
                let seconds = parseInt(matches[2]);
                let timenextNightONE = moment(currentDate);
                let timenextNightTWO = moment(currentDate);
                let timenextNightTHREE = moment(currentDate);
                let timenextNightFOUR = moment(currentDate);
                let timeNow = moment(currentDate)
                .add(hours, 'hours')
                .add(minutes, 'minutes')
                .add(seconds, 'seconds')
                .toDate();

                if (data.state === 'night'){
                    thumbstatus = 'https://i.imgur.com/WjzH6UX.png'
                    embedcolor = '7419530'
                    daystatusON = "NOITE"
                    daystatusOFF = "DIA"
                    timenextNightONE = moment(timeNow)
                    .add(30, 'minutes')
                    .add(1, 'hours')
                    .toDate();

                    timenextNightTWO = moment(timeNow)
                    .add(50, 'minutes')
                    .add(3, 'hours')
                    .toDate();

                    timenextNightTHREE = moment(timeNow)
                    .add(10, 'minutes')
                    .add(6, 'hours')
                    .toDate();

                    timenextNightFOUR = moment(timeNow)
                    .add(20, 'minutes')
                    .add(9, 'hours')
                    .toDate();

                } else {
                    thumbstatus = 'https://i.imgur.com/nfot0nB.png'
                    embedcolor = '15844367'
                    daystatusON = "DIA"
                    daystatusOFF = "NOITE"
                    timenextNightONE = moment(timeNow);

                    timenextNightTWO = moment(timeNow)
                    .add(20, 'minutes')
                    .add(2, 'hours')
                    .toDate();

                    timenextNightTHREE = moment(timeNow)
                    .add(40, 'minutes')
                    .add(4, 'hours')
                    .toDate();

                    timenextNightFOUR = moment(timeNow)
                    .add(0, 'minutes')
                    .add(7, 'hours')
                    .toDate();
                };
                interaction.reply({embeds: [{
                    "title": `CETUS ESTÁ DE ${daystatusON}`,
                    "url": "https://api.warframestat.us/pc/cetusCycle/",
                    "description": `Faltam ${data.timeLeft} para ficar de ${daystatusOFF}\n\n**PROXIMAS NOITES** ⏰\n( horário de Brasília GMT -3 )\n\n- 1º --- ${moment(timenextNightONE).utcOffset(-180).format('HH:mm')}\n\n- 2º --- ${moment(timenextNightTWO).utcOffset(-180).format('HH:mm')}\n\n- 3º --- ${moment(timenextNightTHREE).utcOffset(-180).format('HH:mm')}\n\n- 4º --- ${moment(timenextNightFOUR).utcOffset(-180).format('HH:mm')}\n\n📌*** Essa mensagem será DELETADA em 1 minuto***`,
                    "image": {
                      "url": ""
                    },
                    "thumbnail": {
                      "url": thumbstatus
                    },
                    "color": embedcolor
                }]}).then(msg => setTimeout(() => msg.delete(), 60000));
            })
                .catch(error => console.log(error));
    } else {
        interaction.reply("Esse comando não pode ser utilizado neses chat");
    };
});

client.login(process.env.TOKEN);