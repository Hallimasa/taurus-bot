require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
  {
    name: 'build',
    description: 'give me a build for...',
    options: [
      {
        name: 'warframe-armas',
        description: 'Pick one:',
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: 'volt',
            value: 'volt',
          },
          {
            name: 'volt prime',
            value: 'volt',
          }
        ],
        required: true,
      }
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.log(`-------------- There was an error---------------=> ${error}`);
  }
})();