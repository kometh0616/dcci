exports.run = async (client, message, args) => {
  if (!client.guilds.get("320659280686743602").members.get(message.author.id).hasPermission('ADMINISTRATOR')) return
  let serverID = args[0]
  if (!serverID) return message.reply('no ID defined!')
  let check = await Permits.findOne({
    where: {
      guildID: serverID
    }
  })
  if (!check) {
    await Permits.create({guildID: serverID})
    return await message.reply('server with defined ID is now allowed to use the bot!')
  } else {
    await Permits.destroy({
      where: {
        guildID: serverID
      }
    })
    return await message.reply('permission to use the bot taken away from the server succesfully!')
  }
}
