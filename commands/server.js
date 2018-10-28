const { RichEmbed } = require('discord.js')
exports.run = async (client, message, args) => {
  const greenEmoji = client.emojis.get(client.config.greenEmojiID)
  const greyEmoji = client.emojis.get(client.config.greyEmojiID)
  if (!args[0]) {
    const servers = await DCCIServers.findAll({
      attributes: ['name', 'description', 'guildID', 'link', 'createdAt'],
      order: client.sequelize.col('createdAt')
    })
    const allPages = servers.length
    let iterator = 0
    let currentPage = 1
    let link = await client.fetchInvite(servers[iterator].get('link'))
    let embed = new RichEmbed()
    .addField('Link to the server:', `${servers[iterator].get('link')}\n${greenEmoji} ${link.presenceCount} online ${greyEmoji} ${link.memberCount} members`)
    .setAuthor(servers[iterator].get('name'), client.guilds.get(servers[iterator].get('guildID')).iconURL)
    .setColor(message.member.displayColor)
    .setDescription(servers[iterator].get('description'))
    .setFooter(`${currentPage}/${allPages} pages | Requested by ${message.author.tag}`, message.author.avatarURL)
    .setThumbnail(client.guilds.get(servers[iterator].get('guildID')).iconURL)
    const updateEmbed = async () => {
      return new Promise(async (resolve, reject) => {
        let link = await client.fetchInvite(servers[iterator].get('link'))
        let embed = new RichEmbed()
        .addField('Link to the server:', `${servers[iterator].get('link')}\n${greenEmoji} ${link.presenceCount} online ${greyEmoji} ${link.memberCount} members`)
        .setAuthor(servers[iterator].get('name'), client.guilds.get(servers[iterator].get('guildID')).iconURL)
        .setColor(message.member.displayColor)
        .setDescription(servers[iterator].get('description'))
        .setFooter(`${currentPage}/${allPages} pages | Requested by ${message.author.tag}`, message.author.avatarURL)
        .setThumbnail(client.guilds.get(servers[iterator].get('guildID')).iconURL)
        resolve(embed)
        reject(new Error('Failed to create an embed.'))
      });
    }
    const filter = (reaction, user) => ['⬅', '➡', '❌'].includes(reaction.emoji.name) && user.id === message.author.id
    const msg = await message.channel.send({embed})
    await msg.react('⬅')
    await msg.react('➡')
    await msg.react('❌')
    const collector = msg.createReactionCollector(filter, {
      time: 600000
    })
    collector.on('collect', async reaction => {
      await reaction.remove(message.author.id)
      if (reaction.emoji.name === '⬅' && currentPage != 1) {
        try {
          iterator--
          currentPage--
          let newEmbed = await updateEmbed()
          await msg.edit({embed: newEmbed})
        } catch (e) {
          console.error(e)
          await msg.edit('Something went wrong. Please contact a developer!')
        }
      }
      else if (reaction.emoji.name === '➡' && currentPage !== allPages) {
        try {
          iterator++
          currentPage++
          let newEmbed = await updateEmbed()
          await msg.edit({embed: newEmbed})
        } catch (e) {
          console.error(e)
          await msg.edit('Something went wrong. Please contact a developer!')
        }
      }
      else if (reaction.emoji.name === '❌') {
        try {
          await collector.stop()
          await msg.delete()
          await message.delete()
        } catch (e) {
          console.error(e)
          await msg.edit('Something went wrong. Please contact a developer!')
        }
      }
    })
  } else if (args[0] === '--satellite') {
    const servers = await DCCISatellite.findAll({
      attributes: ['name', 'description', 'guildID', 'link', 'createdAt'],
      order: client.sequelize.col('createdAt')
    })
    const allPages = servers.length
    let iterator = 0
    let currentPage = 1
    let link = await client.fetchInvite(servers[iterator].get('link'))
    let embed = new RichEmbed()
    .addField('Link to the server:', `${servers[iterator].get('link')}\n${greenEmoji} ${link.presenceCount} online ${greyEmoji} ${link.memberCount} members`)
    .setAuthor(servers[iterator].get('name'), client.guilds.get(servers[iterator].get('guildID')).iconURL)
    .setColor(message.member.displayColor)
    .setDescription(servers[iterator].get('description'))
    .setFooter(`${currentPage}/${allPages} pages | Requested by ${message.author.tag}`, message.author.avatarURL)
    .setThumbnail(client.guilds.get(servers[iterator].get('guildID')).iconURL)
    const updateEmbed = async () => {
      return new Promise(async (resolve, reject) => {
        let link = await client.fetchInvite(servers[iterator].get('link'))
        let embed = new RichEmbed()
        .addField('Link to the server:', `${servers[iterator].get('link')}\n${greenEmoji} ${link.presenceCount} online ${greyEmoji} ${link.memberCount} members`)
        .setAuthor(servers[iterator].get('name'), client.guilds.get(servers[iterator].get('guildID')).iconURL)
        .setColor(message.member.displayColor)
        .setDescription(servers[iterator].get('description'))
        .setFooter(`${currentPage}/${allPages} pages | Requested by ${message.author.tag}`, message.author.avatarURL)
        .setThumbnail(client.guilds.get(servers[iterator].get('guildID')).iconURL)
        resolve(embed)
        reject(new Error('Failed to create an embed.'))
      });
    }
    const filter = (reaction, user) => ['⬅', '➡', '❌'].includes(reaction.emoji.name) && user.id === message.author.id
    const msg = await message.channel.send({embed})
    await msg.react('⬅')
    await msg.react('➡')
    await msg.react('❌')
    const collector = msg.createReactionCollector(filter, {
      time: 600000
    })
    collector.on('collect', async reaction => {
      await reaction.remove(message.author.id)
      if (reaction.emoji.name === '⬅' && currentPage != 1) {
        try {
          iterator--
          currentPage--
          let newEmbed = await updateEmbed()
          await msg.edit({embed: newEmbed})
        } catch (e) {
          console.error(e)
          await msg.edit('Something went wrong. Please contact a developer!')
        }
      }
      else if (reaction.emoji.name === '➡' && currentPage !== allPages) {
        try {
          iterator++
          currentPage++
          let newEmbed = await updateEmbed()
          await msg.edit({embed: newEmbed})
        } catch (e) {
          console.error(e)
          await msg.edit('Something went wrong. Please contact a developer!')
        }
      }
      else if (reaction.emoji.name === '❌') {
        try {
          await collector.stop()
          await msg.delete()
          await message.delete()
        } catch (e) {
          console.error(e)
          await msg.edit('Something went wrong. Please contact a developer!')
        }
      }
    })
  }
}

exports.help = {
	name: 'server',
	description: 'Shows you information about servers that belong to DCCI.',
	subcommands: '--satellite',
	usage: ['>server', '>server <server name>', '>server <subcommand>'].join(', ')
}