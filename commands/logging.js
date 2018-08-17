exports.run = async (client, message, args) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return
  let mention = message.mentions.channels.first()
  let thisServerID = message.guild.id
  let channelID = mention != undefined ? mention.id : args[1]
  if (!channelID) {
    channelID = message.channel.id
  }
  let loggingIsEnabled = await Logchannels.findOne({
    where: {
      guildID: thisServerID
    }
  })
  if (args[0] === 'enable') {
    if (loggingIsEnabled) return message.reply('action logging is already enabled for this server!')
    else {
      await Logchannels.create({
        guildID: thisServerID,
        channelID: channelID
      })
      return await message.reply('action logging has been succesfully enabled for this server!')
    }
  }
  else if (args[0] === 'disable') {
    if (!loggingIsEnabled) return message.reply('action logging is already disabled for this server!')
    else {
      await Logchannels.destroy({
        where: {
          guildID: thisServerID
        }
      })
      return await message.reply('action logging has been succesfully disabled for this server!')
    }
  }
}

exports.help = {
  name: 'logging',
  description: 'Enables logging of the most important administrative actions related to this bot\'s functionality happening in this server. For server admins.',
  subcommands: ['enable', 'disable'].join(', '),
  usage: '>logging <subcommand> <channel mention>'
}
