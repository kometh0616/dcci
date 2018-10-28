const { RichEmbed } = require('discord.js')
module.exports = async (client, oldRole, newRole) => {
  const greenEmoji = client.emojis.get(client.config.greenEmojiID)
  const greyEmoji = client.emojis.get(client.config.greyEmojiID)
  const isInDCCI = await DCCIServers.findOne({where: {guildID: newRole.guild.id}}) || await DCCISatellite.findOne({where: {guildID: newRole.guild.id}})
  if (!isInDCCI) return
  if (newRole === newRole.guild.me.colorRole && oldRole.color !== newRole.color) {
    const messageIDs = await Embeds.findAll({where: {portalID: isInDCCI.get('portalChannel')}}, {attributes: ['messageID']}).map(h => h.messageID)
    messageIDs.forEach(async id => {
      const guildID = await Embeds.findOne({where: {messageID: id}}).get('guildID')
      const browseDatab = await DCCIServers.findOne({where: {guildID: guildID}}) || await DCCISatellite.findOne({where: {guildID: guildID}})
      const message = await client.channels.get(isInDCCI.get('portalChannel')).fetchMessage(id)
      const inv = await client.fetchInvite(browseDatab.get('link'))
      const embed = new RichEmbed()
      .addField(`Link to the server:`, `${browseDatab.get('link')}\n${greenEmoji} ${inv.presenceCount} online ${greyEmoji} ${inv.memberCount} members`)
      .setAuthor(browseDatab.get('name'), client.guilds.get(browseDatab.get('guildID')).iconURL)
      .setColor(newRole.color)
      .setDescription(browseDatab.get('description'))
      .setThumbnail(client.guilds.get(browseDatab.get('guildID')).iconURL)
      await message.edit({embed})
    })
    const hasManualSetUp = await ManualPortal.findOne({where: {guildID: newRole.guild.id}}) || await ManualSatellite.findOne({where: {guildID: newRole.guild.id}})
    if (!hasManualSetUp) return
    const manualIDs = await Embeds.findAll({where: {portalID: hasManualSetUp.get('channelID')}}, {attributes: ['messageID']}).map(h => h.messageID)
    manualIDs.forEach(async id => {
      const guildID = await Embeds.findOne({where: {messageID: id}}).get('guildID')
      const browseDatab = await DCCIServers.findOne({where: {guildID: guildID}}) || await DCCISatellite.findOne({where: {guildID: guildID}})
      const message = await client.channels.get(hasManualSetUp.get('channelID')).fetchMessage(id)
      const inv = await client.fetchInvite(browseDatab.get('link'))
      const embed = new RichEmbed()
      .addField(`Link to the server:`, `${browseDatab.get('link')}\n${greenEmoji} ${inv.presenceCount} online ${greyEmoji} ${inv.memberCount} members`)
      .setAuthor(browseDatab.get('name'), client.guilds.get(browseDatab.get('guildID')).iconURL)
      .setColor(newRole.color)
      .setDescription(browseDatab.get('description'))
      .setThumbnail(client.guilds.get(browseDatab.get('guildID')).iconURL)
      await message.edit({embed})
    })
  }
}
