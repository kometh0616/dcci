module.exports = async (client, guildMember) => {
	const { RichEmbed } = require('discord.js')
	const greenEmoji = client.emojis.get(client.config.greenEmojiID)
	const greyEmoji = client.emojis.get(client.config.greyEmojiID)
	const findServer = await DCCIServers.findOne({ where: { guildID: guildMember.guild.id } }) || await DCCISatellite.findOne({ where: { guildID: guildMember.guild.id } })
	if (!findServer) return
	const link = await client.fetchInvite(findServer.get('link'))
	const portals = await Embeds.findAll({ attributes: ['portalID'] }).map(h => h.portalID)
	portals.forEach(async channelID => {
		const dat = await Embeds.findOne({
			where: {
				portalID: channelID,
				guildID: guildMember.guild.id,
			}
		})
		if (!dat) return
		const portal = client.channels.get(channelID)
		const msg = await portal.fetchMessage(dat.get('messageID'))
		const embed = new RichEmbed()
			.addField('Link to the server:', `${findServer.get('link')}\n${greenEmoji} ${link.presenceCount} online ${greyEmoji} ${link.memberCount} members`)
			.setAuthor(guildMember.guild.name, guildMember.guild.iconURL)
			.setColor(portal.guild.me.displayColor)
			.setDescription(findServer.get('description'))
			.setThumbnail(guildMember.guild.iconURL)
		await msg.edit({ embed })
	})
}