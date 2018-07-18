const fs = require('fs')
const xlsx = require('xlsx')
exports.run = (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) return
  try {
    xlsx.readFile('test.xlsx')
    return message.channel.send('Worked!')
  }
  catch (error) {
    console.error(error)
    return message.channel.send(
}