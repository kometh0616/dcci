exports.run = (client, message, args, xlsx) => {
  if (message.author.id !== client.config.botOwnerID) return
  try {
    client.xlsx.readFile('test.xlsx')
    return message.channel.send('Worked!')
  }
  catch (error){
    return message.channel.send('Error!')
  }
}