import betterLogging from 'better-logging'
import { Client, Intents } from 'discord.js'

import { loadCommands, loadEvents } from './util/handlers'

betterLogging(console)

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
  ],
})

loadEvents(client)
loadCommands()

client.login(process.env.TOKEN)
