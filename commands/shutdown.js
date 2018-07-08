exports.run = (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) return;
  message.channel.send('Logging off...')
  client.destroy()
}

exports.help = {
  name: 'shutdown',
  description: 'Shuts the bot down. Only for a bot developer.',
  subcommands: 'none',
  usage: './shutdown'
}