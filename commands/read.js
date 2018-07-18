const fs = require('fs')
const xlsx = require('xlsx')
exports.run = (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) return
  try {
    let workbook = xlsx.readFile('test.xlsx')
    let aoa = [['Hello', 'World!'], ['Ping', 'Pong'], ['Foo', 'Bar']]
    workbook.write
    return message.channel.send('Worked!')
  }
  catch (error) {
    console.error(error)
    return message.channel.send('Error!')
  }
}