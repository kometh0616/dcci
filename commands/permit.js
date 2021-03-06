exports.run = async (client, message, args) => {
  if (!client.guilds.get("320659280686743602").members.get(message.author.id).hasPermission('ADMINISTRATOR')
     && !client.guilds.get("452631886691434496").members.get(message.author.id).hasPermission('ADMINISTRATOR')) return
  let serverID = args[0]
  if (!serverID) return message.reply('no ID defined!')
  let check = await Permits.findOne({
    where: {
      guildID: serverID
    }
  })
  if (!check) {
    await Permits.create({guildID: serverID})
    await message.reply('server with defined ID is now allowed to use the bot!')
  } else {
    await Permits.destroy({
      where: {
        guildID: serverID
      }
    })
    await message.reply('permission to use the bot taken away from the server succesfully!')
  }
}

exports.help = {
  name: 'permit',
  description: 'Allows a server to use the bot. Can only be ran by DCCI admins.',
  subcommands: 'none',
  usage: '>permit <server ID>'
}
