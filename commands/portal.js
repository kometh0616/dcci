const { RichEmbed } = require('discord.js')
exports.run = async (client, message, args) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return
  const server = await DCCISatellite.findOne({
    where: {
      guildID: message.guild.id
    }
  })
  if (!server) return message.reply('this feature is only for satellite servers!')
  else if (args[0] === 'init') {
    message.guild.createChannel('dcci-portal', 'text', [{
      id: message.guild.id,
      deny: ['SEND_MESSAGES']
    },
    {
      // NOTE: Guild needs to have the role named as "DCCI".
      id: message.guild.members.get(client.user.id).roles.find('name', 'DCCI').id,
      allow: ['SEND_MESSAGES', 'EMBED_LINKS', 'READ_MESSAGES']
    }]).then(async channel => {
      await ManualPortal.create({
        guildID: message.guild.id,
        channelID: channel.id
      })
      const main = await DCCIServers.findAll({
        attributes: ['guildID', 'name', 'description', 'link']
      })
      main.forEach(async model => {
        let guild = client.guilds.get(model.dataValues.guildID)
        let embed = new RichEmbed()
        .setColor(message.guild.members.get(client.user.id).displayColor)
        .setAuthor(model.dataValues.name, guild.iconURL)
        .setDescription(`${model.dataValues.description}\n\nLink to the server:\n${model.dataValues.link}`)
        await channel.send({embed})
      })
      await message.reply('main DCCI portal set up for your server succesfully!')
      const embed = new RichEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setColor(message.guild.members.get(client.user.id).displayColor)
      .setTitle('Main DCCI portal setup enabled!')
      .addField('Action performed by:', message.author.tag)
      .setFooter(client.user.avatarURL, client.config.copymark)
      const logModel = await Logchannels.findOne({
        where: {
          guildID: message.guild.id,
        }
      })
      const logChannel = message.guild.channels.get(logModel.get('channelID'))
      if (!logChannel) return
      await logChannel.send({embed})
    }).catch(err => {
      console.error(err)
      return message.channel.send('Something went wrong. Please make sure bot has permissions to manage channels.')
    })
  }
  else if (args[0] === 'destroy') {
    let isSetup = await DCCISatellite.findOne({
      where: {
        guildID: message.guild.id
      }
    })
    if (!isSetup) return message.reply('no set up portal found.')
    else {
      let channel = client.channels.get(isSetup.get('channelID'))
      await channel.delete()
      await ManualPortal.destroy({
        where: {
          guildID: message.guild.id
        }
      })
      await message.reply('main DCCI portal setup removed from your server succesfully!')
      const embed = new RichEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL)
      .setColor(message.guild.members.get(client.user.id).displayColor)
      .setTitle('Main DCCI portal setup disabled!')
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
