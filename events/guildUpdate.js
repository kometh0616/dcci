const { RichEmbed } = require('discord.js')
module.exports = async (client, oldGuild, newGuild) => {
  const greenEmoji = client.emojis.get(client.config.greenEmojiID)
  const greyEmoji = client.emojis.get(client.config.greyEmojiID)
  const isInDCCI = await DCCIServers.findOne({where: {guildID: oldGuild.id}}) || await DCCISatellite.findOne({where: {guildID: oldGuild.id}})
  if (!isInDCCI) return
  const updateInfo = async () => {
    const portals = await Embeds.findAll({attributes: ['portalID']}).map(h => h.portalID)
    const inv = await client.fetchInvite(isInDCCI.get('link'))
    portals.forEach(async portal => {
      const emb = await Embeds.findOne({
        where: {
          portalID: portal,
          guildID: newGuild.id
        }
      })
      if (!emb) return
      const msg = await client.channels.get(portal).fetchMessage(emb.get('messageID'))
      let embed = new RichEmbed()
      .addField(`Link to the server:`, `${isInDCCI.get('link')}\n${greenEmoji} ${inv.presenceCount} online ${greyEmoji} ${inv.memberCount} members`)
      .setAuthor(newGuild.name, newGuild.iconURL)
      .setColor(msg.guild.me.displayColor)
      .setDescription(isInDCCI.get('description'))
      .setThumbnail(newGuild.iconURL)
      await msg.edit({embed})
    })
  }
  if (oldGuild.name !== newGuild.name) {
    await isInDCCI.update({
      name: newGuild.name
    },
    {
      where: {
        guildID: newGuild.id
      }
    })
    await updateInfo()
  }
  else if (oldGuild.iconURL !== newGuild.iconURL) await updateInfo()
}