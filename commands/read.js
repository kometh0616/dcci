const fs = require('fs')
const xlsx = require('xlsx')
exports.run = (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) return
  try {
    let name = 'sheetjs'
    let ops = {  bookType: 'xlsx', bookSST: false, type: 'base64' }
    let wb = xlsx.readFile(`${name}.xlsx`)
    let aoa_data = [['Ping', 'Pong'], ['Foo', 'Bar']]
    let aoa = xlsx.utils.aoa_to_sheet(aoa_data)
    xlsx.writeFile(wb, `${name}.xlsx`, ops)
    message.channel.send({
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