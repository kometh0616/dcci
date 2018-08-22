exports.run = async (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) return
  if (!args[0]) return message.reply('no Sequelize model defined.')
  let modelName = args[0]
  const { readdir } = require('fs')
  const { sequelize } = require(`../index.js`)
  readdir('../models/', (err, files) => {
    if (!err) return console.error(err)
    let model = sequelize.import(`../models/${modelName}`)
    model.sync().then(() => message.reply('model ${modelName} synced succesfully!'))
  })
}