const fs = require('fs')
const xlsx = require('xlsx')
exports.run = (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) return
  try {
    let workbook = xlsx.utils.book_new()
    let aoa_data = [['Hello', 'World!'], ['Ping', 'Pong'], ['Foo', 'Bar']]
    let name = 'sheetjs'
    let aoa = xlsx.utils.aoa_to_sheet(aoa_data)
    let sheet = xlsx.utils.book_append_sheet(workbook, aoa, name)
    return message.channel.send({
      files: [{
        attachment: `./${name}.xlsx`,
        name: `${name}.xlsx`
      }]
    })
  }
  catch (error) {
    console.error(error)
    return message.channel.send('Error!')
  }
}