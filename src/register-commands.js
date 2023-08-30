require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
  {
    name: 'build',
    description: 'give me a build for...',
    options: [
      {
        name: 'warframe',
        description: 'selecione um',
        type: ApplicationCommandOptionType.String,
        choices: [
          {
            name: 'volt',
            value: 'volt',
          },
          {
            name: 'volt prime',
            value: 'volt',
          },
          {
            name: 'ash',
            value: 'ash',
          },
          {
            name: 'ash prime',
            value: 'ash',
          },
          {
            name: 'atlas',
            value: 'atlas',
          },
          {
            name: 'atlas prime',
            value: 'atlas',
          },
          {
            name: 'banshee',
            value: 'banshee',
          },
          {
            name: 'banshee prime',
            value: 'banshee',
          },
          {
            name: 'baruuk',
            value: 'baruuk',
          },
          {
            name: 'baruuk prime',
            value: 'baruuk',
          }
        ],
        required: true,
      }
    ],
  },
  {
    name: 'eidolon',
    description: 'tempo de cetus e horário de proximas noites',
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