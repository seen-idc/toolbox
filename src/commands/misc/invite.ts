import { MessageEmbed, Client } from 'discord.js'
import { defCommand } from '../../util/commands'
import { SlashCommandBuilder } from '@discordjs/builders'

function createEmbed(client: Client) {
  const embed = new MessageEmbed()
    .setColor('NAVY')
    .setTitle('🔗 Invite')
    .setDescription(
      `[\`[Invite Here]\`](https://discord.com/api/oauth2/authorize?client_id=922024346879406110&permissions=8&scope=bot%20applications.commands)\n[\`[Github]\`](https://github.com/seen-idc/toolbox)`
    )

  return embed
}

export default defCommand({
  name: 'invite',
  aliases: ['info'],
  cooldown: 3,
  description: 'Invite to your own server!',
  usage: '',
  category: 'misc',
  commandPreference: 'slash',
  run: async (client, message) => {
    message.reply({ embeds: [createEmbed(client)] })
  },
  interaction: async (client, interaction) => {
    if (!interaction.isCommand()) return

    interaction.reply({ embeds: [createEmbed(client)] })
  },
  slashCommand: new SlashCommandBuilder().setName('invite').setDescription('Invite to your own server!'),
})
