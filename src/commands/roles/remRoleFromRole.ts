import { SlashCommandBuilder } from '@discordjs/builders'
import { Role } from 'discord.js'

import { defCommand, disabled } from '../../util/commands'

const slashCommandData = new SlashCommandBuilder()
  .setName('rem-role-from-role')
  .setDescription('Remove a role from all the members with a role.')

slashCommandData.addRoleOption((opt) =>
  opt
    .setName('selector_role')
    .setDescription('The role which the role is to be removed from')
    .setRequired(true)
)

slashCommandData.addRoleOption((opt) =>
  opt.setName('role_to_be_removed').setDescription('Role to be removed').setRequired(true)
)

export default defCommand({
  name: 'rem-role-from-role',
  aliases: ['artr'],
  cooldown: 3,
  description: 'Removes a role from all the members with a role.',
  usage: '<Selector_Role> <Removed_Role>',
  category: 'roles',
  commandPreference: 'slash',
  permissions: {
    member: ['MANAGE_ROLES'],
    bot: ['MANAGE_ROLES'],
  },
  run: disabled,
  interaction: async (client, interaction) => {
    if (!interaction.isCommand()) return
    if (!interaction.guild) return

    await interaction.guild.members.fetch({
      withPresences: false,
    })

    let role = interaction.options.getRole('role_to_be_removed')
    let selRole = interaction.options.getRole('selector_role')

    let members = interaction.guild.members.cache

    let counter = 0
    let errored = false
    let message = ''
    members.forEach((member) => {
      if (
        member.roles.cache.has(selRole?.id as string) &&
        member.roles.cache.has(role?.id as string)
      ) {
        if (
          member.roles.highest.position > (interaction.guild?.me?.roles.highest.position as number)
        ) {
          if (!errored) {
            message = `Make sure I have the highest role in order to remove roles from everyone. I could not remove roles frfom:`
            errored = true
          }

          message = `${message}\n\`${member.user.tag}\``
          return
        } else {
          counter++
          member.roles.remove(role as Role)
        }
      }
    })
    interaction.reply(
      `Removed roles from **${counter} member${counter != 1 ? 's' : ''}**.\n${message}`
    )
  },
  slashCommand: slashCommandData,
})
