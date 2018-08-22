exports.run = async (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) return
  if (!args[0]) return message.reply('no Sequelize model defined.')
  let modelName = args[0]
  const { readdir } = require('fs')
  readdir('../models/', (err, files) => {
    if (!err) return console.error(err)
    let model = client.sequelize.import(`../models/${modelName}`)
    if (!model) return message.reply(`no Sequelize model found with the name of ${modelName}.`)
    model.sync().then(() => message.reply('model ${modelName} synced succesfully!'))
  })
}