const fs = require('fs')
const xlsx = require('xlsx')
exports.run = (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) return
  try {
    let name = 'sheetjs'
    let ops = { sheet: 'Sheet 1', type: 'base64' }
    let wb = xlsx.readFile(`${name}.xlsx`)
    let aoa_data = [['Ping', 'Pong'], ['Foo', 'Bar']]
    let aoa_parse = xlsx.utils.aoa_to_sheet(aoa_data)
    let aoa = xlsx.read(aoa_parse)
    xlsx.write(wb, ops)
    xlsx.writeFile(aoa, `./${name}.xlsx`, ops)
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