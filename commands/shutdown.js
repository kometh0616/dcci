exports.run = (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) return;
  message.channel.send('Logging off...')
  client.destroy()
}