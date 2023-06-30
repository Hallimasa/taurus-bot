require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');

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

    if ((interaction.commandName === 'build') && (interaction.channelId === process.env.CHAT_BUILD_ID || interaction.channelId === process.env.CHAT_TESTBUILD_ID)){

        const buildchoice = interaction.options.get('warframe-armas').value;
        const fs = require('fs');
        const path = (`./src/embeds/${buildchoice}.json`);


        if ((typeof(buildchoice) != 'undefined')&&(fs.existsSync(path))){

            const embed = (new EmbedBuilder(require(`../src/embeds/${buildchoice}.json`))).data ;

            if (((embed[0]).title != '') &&
                ((embed[1]).title != '') &&
                ((embed[2]).title != '') &&
                ((embed[3]).title != '') &&
                ((embed[4]).title != '') ){
                    interaction.reply({ embeds: [embed[0],embed[1],embed[2],embed[3],embed[4]] });
                    return;
            } else if (((embed[0]).title != '') &&
                ((embed[1]).title != '') &&
                ((embed[2]).title != '') &&
                ((embed[3]).title != '') ){
                    interaction.reply({ embeds: [embed[0],embed[1],embed[2],embed[3]] });
                    return;
            } else if (((embed[0]).title != '') &&
                ((embed[1]).title != '') &&
                ((embed[2]).title != '') ){
                    interaction.reply({ embeds: [embed[0],embed[1],embed[2]] });
                    return;
            } else if (((embed[0]).title != '') &&
                ((embed[1]).title != '') ){
                    interaction.reply({ embeds: [embed[0],embed[1]] });
                    return
            } else if (((embed[0]).title != '') ){
                    interaction.reply({ embeds: [embed[0]] });
                    return
            };         
        };
    } else {
        interaction.reply("Esse comando não pode ser utilizado neses chat");
    };
});

client.login(process.env.TOKEN);