import { SlashCommandBuilder } from '@discordjs/builders'
import { Role } from 'discord.js'

import { commandDeprecated, CommandFunction, defCommand, disabled } from '../../util/commands'

const slashCommandData = new SlashCommandBuilder()
  .setName('ban-role')
  .setDescription('Bans all members with a role')

slashCommandData.addRoleOption((opt) =>
  opt
    .setName('selector_role')
    .setDescription('The role which is gonna be banned')
    .setRequired(true)
)

export default defCommand({
  name: 'ban-role',
  aliases: ['br'],
  cooldown: 3,
  description: 'Bans all the members with a role.',
  usage: '<Selector_Role>',
  category: 'roles',
  commandPreference: 'slash',
  permissions: {
    member: ['MANAGE_ROLES', 'BAN_MEMBERS'],
    bot: ['MANAGE_ROLES', 'BAN_MEMBERS'],
  },
  run: commandDeprecated('message', 'the slash command instead.') as CommandFunction,
  interaction: async (client, interaction) => {
    if (!interaction.isCommand()) return
    if (!interaction.guild) return

    await interaction.guild.members.fetch({
      withPresences: false,
    })

    let selRole = interaction.options.getRole('selector_role')

    let members = interaction.guild.members.cache

    let counter = 0
    let errored = false
    let message = ''
    members.forEach((member) => {
      if (member.roles.cache.has(selRole?.id as string)) {
        if (
          member.roles.highest.position > (interaction.guild?.me?.roles.highest.position as number)
        ) {
          if (!errored) {
            message = `Make sure I have the highest role in order to ban everyone with the role. I could not ban:`
            errored = true
          }

          message = `${message}\n\`${member.user.tag}\``
          return
        } else {
          counter++
          member.ban()
        }
      }
    })
    interaction.reply(`Banned **${counter} member${counter != 1 ? 's' : ''}**.\n${message}`)
  },
  slashCommand: slashCommandData,
})
