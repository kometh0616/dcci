exports.run = (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) return
  var workbook = client.xlsx.readFile('./test.xlsx')
  if (workbook) return message.channel.send('Read the file...')
}