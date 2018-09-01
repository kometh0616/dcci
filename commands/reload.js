exports.run = (client, message, args) => {
  const {readdir} = require('fs')
  if (message.author.id !== client.config.botOwnerID) return
  if(!args || args.size < 1) return message.reply("Must provide a command name to reload.");
  const commandName = args[0];
  if(!client.commands.has(commandName)) {
    readdir(`./`, (err, files) => {
      if (err) return console.error(err)
      let command = files.find(x => x.startsWith(commandName))
      if (!command) return message.reply('That command doesn\'t exist.')
      const props = require(`./${commandName}.js`)
      client.commands.set(command, props)
      return message.reply(`The command ${command} has been loaded`)
    })
  }
  delete require.cache[require.resolve(`./${commandName}.js`)];
  client.commands.delete(commandName);
  const props = require(`./${commandName}.js`);
  client.commands.set(commandName, props);
  return message.reply(`The command ${commandName} has been reloaded`);
};