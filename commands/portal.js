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
  const server = await checkup.findOne({
    where: {
      guildID: message.guild.id
    }
  })
  if (!server) return message.reply(`this feature is only for ${response} servers!`)
  else if (args[0] === 'init') {
    let isSetup = await initModel.findOne({where: {guildID: message.guild.id}})
    if (isSetup) return message.reply(`manual ${response} portal is already set up!`)
    message.guild.createChannel(name, 'text', [{
      id: message.guild.id,
      deny: ['SEND_MESSAGES']
    },
    {
      id: message.guild.members.get(client.user.id).roles.find('name', 'DCCI').id,
      allow: ['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGES']
    }]).then(async channel => {
      await initModel.create({
        guildID: message.guild.id,
        channelID: channel.id
      })
      const main = await postModel.findAll({
        attributes: ['guildID']
      })
      main.forEach(async model => {
        let guild = client.guilds.get(model.dataValues.guildID)
        let embed = new RichEmbed()
        .setColor(message.guild.members.get(client.user.id).displayColor)
        .setAuthor(model.dataValues.name, guild.iconURL)
        .setDescription(`${model.dataValues.description}\n\nLink to the server:\n${model.dataValues.link}`)
        await message.channel.send({embed})
      })
      await message.reply(`${response.replace(regex, letter)} DCCI portal set up for your server succesfully!`)
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
      const logChannel = message.guild.channels.get(logModel.get('channelID'))
      await logChannel.send({embed})
    })
  }
  else if (args[0] === 'destroy') {
    let isSetup = await DCCISatellite.findOne({where: {guildID: message.guild.id }}) || await DCCIServers.findOne({where: {guildID: message.guild.id}})
    if (!isSetup) return message.reply('no set up portal found.')
    else {
      let channel = client.channels.get(isSetup.get('channelID'))
      await channel.delete()
      let portal = await ManualPortal.destroy({where: {guildID: message.guild.id}})
      if (!portal) await ManualSatellite.destroy({where: {guildID: message.guild.id}})
      await message.reply('manual DCCI portal setup removed from your server succesfully!')
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
