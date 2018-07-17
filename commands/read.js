exports.run = (client, message, args, xlsx) => {
  if (message.author.id !== client.config.botOwnerID) return
  xlsx.readFile('test.xlsx').then(message.channel.send('Done!'))
}