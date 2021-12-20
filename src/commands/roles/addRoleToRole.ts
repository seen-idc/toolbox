import { SlashCommandBuilder } from '@discordjs/builders'
import { Role } from 'discord.js'

import { commandDeprecated, CommandFunction, defCommand } from '../../util/commands'

const slashCommandData = new SlashCommandBuilder()
  .setName('add-role-to-role')
  .setDescription('Adds a role to all the members with a role.')

slashCommandData.addRoleOption((opt) =>
  opt
    .setName('selector_role')
    .setDescription('The role which the role is to be added to')
    .setRequired(true)
)

slashCommandData.addRoleOption((opt) =>
  opt.setName('role_to_be_added').setDescription('Role to be added').setRequired(true)
)

export default defCommand({
  name: 'add-role-to-role',
  aliases: ['artr'],
  cooldown: 10,
  description: 'Adds a role to all the members with a role.',
  usage: '<Selector_Role> <Added_Role>',
  category: 'roles',
  commandPreference: 'slash',
  permissions: {
    member: ['ADMINISTRATOR'],
    bot: ['MANAGE_ROLES'],
  },
  run: commandDeprecated('message', 'the slash command instead.') as CommandFunction,
  interaction: async (client, interaction) => {
    if (!interaction.isCommand()) return
    if (!interaction.guild) return

    await interaction.guild.members.fetch({
      withPresences: false,
    })

    let role = interaction.options.getRole('role_to_be_added')
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
            message = `Make sure I have the highest role in order to add roles to everyone. I could not add roles to:`
            errored = true
          }

          message = `${message}\n\`${member.user.tag}\``
          return
        } else {
          counter++
          member.roles.add(
            role as Role,
            `Add role @${role?.name} (${role?.id}) on everyone with @${selRole?.name} (${selRole?.id}) issued by ${interaction.user.tag} (${interaction.user.id})`
          )
        }
      }
    })
    interaction.reply(`Added roles to **${counter} member${counter != 1 ? 's' : ''}**.\n${message}`)
  },
  slashCommand: slashCommandData,
})
