const { RichEmbed } = require('discord.js')
exports.run = async (client, message, args) => {
  const param = args[0]
  if (!param) return
  const id = args[1]
  if (!id) return
  if (!client.guilds.get(id)) return message.reply('no guild found with defined ID.')
  if (!client.guilds.get("320659280686743602").members.get(message.author.id).hasPermission('ADMINISTRATOR')) return
  const newData = args.slice(2).join(' ')
  if (!newData) return
  const foundServer = await DCCIServers.findOne({where: {guildID: id}}) || await DCCISatellite.findOne({where: {guildID: id}})
  const greenEmoji = client.emojis.get(client.config.greenEmojiID)
  const greyEmoji = client.emojis.get(client.config.greyEmojiID)
  const editEmbed = async () => {
    const x = await Embeds.findAll({attributes: ['portalID']})
    const ids = Array.from(x.map(h => h.portalID))
    ids.forEach(async i => {
      let dat = await Embeds.findOne({
        where: {
          portalID: i,
          guildID: id
        }
      })
      let msg = await client.channels.get(i).fetchMessage(dat.get('messageID'))
      const inv = await client.fetchInvite(foundServer.get('link'))
      let embed = new RichEmbed()
      .addField(`Link to the server:`, `${foundServer.get('link')}\n${greenEmoji} ${inv.presenceCount} online ${greyEmoji} ${inv.memberCount} members`)
      .setAuthor(foundServer.get('name'), client.guilds.get(id).iconURL)
      .setColor(client.channels.get(i).guild.me.displayColor)
      .setDescription(foundServer.get('description'))
      .setThumbnail(client.guilds.get(id).iconURL)
      return msg.edit({embed})
    })
  }
	const movePortal = async model => {
    let allMainIDs = Array.from(await model.findAll({attributes: ['guildID']}).map(h => h.guildID))
    allMainIDs.forEach(async guildID => {
      let browseDatab = await model.findOne({where: {guildID: guildID}})
			let portal = client.channels.get(foundServer.get('portalChannel'))
			let inv = await client.fetchInvite(browseDatab.get('link'))
      let embed = new RichEmbed()
      .addField(`Link to the server:`, `${browseDatab.get('link')}\n${greenEmoji} ${inv.presenceCount} online ${greyEmoji} ${inv.memberCount} members`)
      .setAuthor(browseDatab.get('name'), client.guilds.get(guildID).iconURL)
      .setColor(portal.guild.me.displayColor)
      .setDescription(browseDatab.get('description'))
      .setThumbnail(client.guilds.get(guildID).iconURL)
      let msg = await portal.send({embed})
      await Embeds.create({
        portalID: portal.id,
        guildID: guildID,
        messageID: msg.id
      })
    })
  }
  if (param === 'link') {
    await foundServer.update({
      link: newData
    },
    {
      where: {
        guildID: id
      }
    })
    await editEmbed()
    await message.reply(`\`${client.guilds.get(id).name}\` server link succesfully updated to ${newData}!`)
  }
  else if (param === 'description') {
    await foundServer.update({
      description: newData
    },
    {
      where: {
        guildID: id
      }
    })
    await editEmbed()
    await message.reply(`\`${client.guilds.get(id).name}\` description succesfully updated!`)
  }
  else if (param === 'portal') {
    let oldPortal = client.channels.get(foundServer.get('portalChannel'))
    await oldPortal.delete()
    await Embeds.destroy({where: {portalID: oldPortal.id}})
    await foundServer.update({
      portalChannel: newData
    },
    {
      where: {
        guildID: id
      }
    })
    const isSatellite = await DCCISatellite.findOne({where: {guildID: id}})
    if (isSatellite) await movePortal(DCCISatellite)
    else await movePortal(DCCIServers)
    await message.reply(`\`${client.guilds.get(id).name}\` portal channel sucessfully updated to <#${newData}>!`)
  }
  else if (param === 'name') {
    await foundServer.update({
      name: newData
    },
    {
      where: {
        guildID: id
      }
    })
    await editEmbed()
    await message.reply(`\`${client.guilds.get(id).name}\` name succesfully updated to ${newData}!`)
  }
  else if (!['portal', 'link', 'description', 'name'].includes(param))
    return message.reply(`I do not recognize parameter \`${param}\``)
}

exports.help = {
  name: 'editinfo',
  description: 'Edits information of a DCCI server. Only for server owners and DCCI admins.',
  subcommands: ['portal', 'name', 'description', 'link'].join(', '),
  usage: '>editinfo <subcommand> <server ID> <new data>'
}