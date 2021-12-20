import { SlashCommandBuilder } from '@discordjs/builders'

import { commandDeprecated, CommandFunction, defCommand } from '../../util/commands'

const slashCommandData = new SlashCommandBuilder()
  .setName('kick-role')
  .setDescription('Kicks all members with a role.')

slashCommandData.addRoleOption((opt) =>
  opt.setName('selector_role').setDescription('The role which is gonna be kicked').setRequired(true)
)

export default defCommand({
  name: 'kick-role',
  aliases: ['kr'],
  cooldown: 3,
  description: 'Kickss all the members with a role.',
  usage: '<Selector_Role>',
  category: 'roles',
  commandPreference: 'slash',
  permissions: {
    member: ['ADMINISTRATOR'],
    bot: ['MANAGE_ROLES', 'KICK_MEMBERS'],
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
      if (
        member.roles.cache.has(selRole?.id as string) &&
        interaction.guild?.ownerId !== member.id
      ) {
        if (
          member.roles.highest.position > (interaction.guild?.me?.roles.highest.position as number)
        ) {
          if (!errored) {
            message = `Make sure I have the highest role in order to kick everyone with the role. I could not kick:`
            errored = true
          }

          message = `${message}\n\`${member.user.tag}\``
          return
        } else {
          counter++
          member.kick(`Kick role @${selRole?.name} (${selRole?.id}) issued by ${interaction.user.tag} (${interaction.user.id})`)
        }
      }
    })
    interaction.reply(`Kicked **${counter} member${counter != 1 ? 's' : ''}**.\n${message}`)
  },
  slashCommand: slashCommandData,
})
