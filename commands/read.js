const fs = require('fs')
const xlsx = require('xlsx')
exports.run = (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) return
  try {
    let name = 'sheetjs'
    let wb = xlsx.utils.book_new({name: `${name}`})
    let opts = { bookType: 'xlsx', sheet: "Main sheet"}
    let aoa_data = [['Ping', 'Pong'], ['Foo', 'Bar']]
    let aoa = xlsx.utils.aoa_to_sheet(aoa_data)
    xlsx.write(wb, aoa, opts)
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