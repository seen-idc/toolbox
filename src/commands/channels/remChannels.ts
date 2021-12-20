import { SlashCommandBuilder } from '@discordjs/builders'
import { CategoryChannel } from 'discord.js';

import { commandDeprecated, CommandFunction, defCommand } from '../../util/commands'

const slashCommandData = new SlashCommandBuilder()
  .setName('remove-channels')
  .setDescription('Removes channels from a category')

slashCommandData.addChannelOption((opt) =>
  // Filters channel types to only categories
  opt.setName('selector_category').addChannelType(4).setDescription('The role which is gonna be kicked').setRequired(true)
)

slashCommandData.addBooleanOption((opt) => 
  opt.setName('delete_category').setDescription('Delete the category?')
)

export default defCommand({
  name: 'remove-channels',
  aliases: ['rem-c', 'rc', 'rem-channels'],
  cooldown: 3,
  description: 'Removes all channels from category.',
  usage: '<Category> <DeleteCategory?>',
  category: 'channels',
  commandPreference: 'slash',
  permissions: {
    member: ['ADMINISTRATOR'],
    bot: ['MANAGE_CHANNELS', 'MANAGE_GUILD'],
  },
  run: commandDeprecated('message', 'the slash command instead.') as CommandFunction,
  interaction: async (client, interaction) => {
    if (!interaction.isCommand()) return
    if (!interaction.guild) return


    let selCategory = interaction.options.getChannel('selector_category')
    let deleteCategory = interaction.options.getBoolean('delete_category')

    if (selCategory?.type !== 'GUILD_CATEGORY') throw new Error('You did not provide a valid category.')

    let category = selCategory as CategoryChannel

    category.fetch()

    let errored = false
    let message = ''
    let counter = 0
    category.children.forEach(c => {
      if (c.deletable) {
        counter++
        c.delete(`Deleting all channels in category${deleteCategory ? ' and the category itself' : ''} ${category.name} (${category.id}) issued by ${interaction.user.tag} (${interaction.user.id})`)
      } else {
        if (!errored) {
          message = `Could not delete all the channels, the following channels still need to be deleted: `
        }

        message = `${message}\n\`${c.name}\``
      }
    })

    if (category.deletable) {
      category.delete()
    }
    else {
      message = `\n**Could not delete the category!**`
    }
    interaction.reply(`Deleted **${counter} channels**${deleteCategory ? ' (and the category itself)' : ''} from category \`${category.name}\`.\n${message}`)
  },
  slashCommand: slashCommandData,
})
