exports.run = async (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) return;
  await message.channel.send('Logging off...')
  await client.destroy()
}