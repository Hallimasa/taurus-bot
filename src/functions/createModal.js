const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js')

module.exports = async ({ interaction }) => {
    const modal = new ModalBuilder({
        customId: `myModal-${interaction.user.id}`,
        title: 'Mod Drop',
    });

    const modNameInput = new TextInputBuilder({
        custom_id: 'modDropInput',
        label: "Digite o nome do mod/arcano que deseja ver:",
        style: TextInputStyle.Short,
    });


    const firstActionRow = new ActionRowBuilder().addComponents(modNameInput);

    modal.addComponents(firstActionRow);

    return modal
}
