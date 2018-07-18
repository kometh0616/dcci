const fs = require('fs')
const xlsx = require('xlsx')
const request = require('request')
exports.run = (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) return
  try {
    request(url, {encoding: null}, (err, res, data) => {
      if (err || res.statusCode !== 200) return console.error(err)
      var 
  }
  catch (error) {
    console.error(error)
    return message.channel.send('Error!')
  }
}