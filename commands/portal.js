const { RichEmbed } = require('discord.js')
exports.run = async (client, message, args) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return
  const name = args[1] === 'satellite' ? 'satellite-portal' : 'dcci-portal'
  const postModel = args[1] === 'satellite' ? DCCISatellite : DCCIServers
  const checkup = args[1] === 'satellite' ? DCCIServers : DCCISatellite
  const response = args[1] === 'satellite' ? 'mainstream' : 'satellite'
  const initModel = args[1] === 'satellite' ? ManualSatellite : ManualPortal
  const regex = response === 'mainstream' ? /^m/ : /^s/
  const letter = regex === /^m/ ? 'M' : 'S'
  const greenEmoji = client.emojis.get(client.config.greenEmojiID)
  const greyEmoji = client.emojis.get(client.config.greyEmojiID)
  const server = await checkup.findOne({
    where: {
      guildID: message.guild.id
    }
  })
  if (args[0] === 'init') {
    if (!server) return message.reply(`this feature is only for ${response} servers!`)
    let isSetup = await initModel.findOne({where: {guildID: message.guild.id}})
    if (isSetup) return message.reply(`manual ${response} portal is already set up!`)
    message.guild.createChannel(name, 'text', [{
      id: message.guild.id,
      deny: ['SEND_MESSAGES']
    },
    {
      id: message.guild.members.get(client.user.id).roles.find(h => h.name === 'DCCI Beta').id,
      allow: ['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGES']
    }]).then(async channel => {
      await initModel.create({
        guildID: message.guild.id,
        channelID: channel.id
      })
      const main = await postModel.findAll({
        attributes: ['guildID', 'name', 'description', 'link'],
        order: client.sequelize.col('createdAt')
      })
      main.forEach(async model => {
        let guild = client.guilds.get(model.dataValues.guildID)
        let inv = await client.fetchInvite(model.dataValues.link)
        let embed = new RichEmbed()
        .addField(`Link to the server:`, `${model.dataValues.link}\n${greenEmoji} ${inv.presenceCount} online ${greyEmoji} ${inv.memberCount} members`)
        .setThumbnail(guild.iconURL)
        .setColor(message.guild.me.displayColor)
        .setAuthor(model.dataValues.name, guild.iconURL)
        .setDescription(model.dataValues.description)
        let msg = await channel.send({embed})
        await Embeds.create({
          portalID: channel.id,
          guildID: model.dataValues.guildID,
          messageID: msg.id
        })
      })
      await message.reply(`:thumbsup:`)
      const embed = new RichEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setColor(message.guild.members.get(client.user.id).displayColor)
      .setTitle(`${response.replace(regex, letter)} DCCI portal setup enabled!`)
      .addField('Action performed by:', message.author.tag)
      .setFooter(client.user.avatarURL, client.config.copymark)
      const logModel = await Logchannels.findOne({
        where: {
          guildID: message.guild.id,
        }
      })
      if (!logModel) return
      const logChannel = message.guild.channels.get(logModel.get('channelID'))
      await logChannel.send({embed})
    })
  }
  else if (args[0] === 'destroy') {
    let isSetup = await ManualPortal.findOne({where: {guildID: message.guild.id}})
    let satSetup = await ManualSatellite.findOne({where: {guildID: message.guild.id}})
    if (!isSetup && !satSetup) return message.reply('no set up portal found.')
    else {
      let model = isSetup ? isSetup : satSetup
      let channel = client.channels.get(model.get('channelID'))
      await channel.delete()
      await Embeds.destroy({where: {portalID: model.get('channelID')}})
      let portal = await ManualPortal.destroy({where: {guildID: message.guild.id}})
      if (!portal) await ManualSatellite.destroy({where: {guildID: message.guild.id}})
      await message.reply(':thumbsup:')
      const embed = new RichEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setColor(message.guild.members.get(client.user.id).displayColor)
      .setTitle(`${response.replace(regex, letter)} DCCI portal setup disabled!`)
      .addField('Action performed by:', message.author.tag)
      .setFooter(client.user.avatarURL, client.config.copymark)
      const logModel = await Logchannels.findOne({
        where: {
          guildID: message.guild.id,
        }
      })
      if (!logModel) return
      const logChannel = message.guild.channels.get(logModel.get('channelID'))
      await logChannel.send({embed})
    }
  }
}

exports.help = {
  name: 'portal',
  description: 'Sets up a main DCCI portal to be updated. Only for Satellite servers and their admins.',
  subcommands: ['init', 'destroy'].join(', '),
  usage: '>portal <subcommand>'
}
