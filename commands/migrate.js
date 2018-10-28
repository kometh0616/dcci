const { RichEmbed } = require('discord.js')
exports.run = async (client, message, args) => {
	const greenEmoji = client.emojis.get(client.config.greenEmojiID)
	const greyEmoji = client.emojis.get(client.config.greyEmojiID)
	if (message.author.id !== '209635318503047168') return
	try {
		const model = await DCCIServers.findAll({ attributes: ['portalChannel'] })
		const ids = model.map(h => h.portalChannel)
		ids.forEach(async id => {
			const channel = client.channels.get(id)
			const messages = await channel.fetchMessages()
			const msgs = messages.filter(x => x.author.id === client.user.id)
			msgs.forEach(async msg => await msg.delete())
		})	

		const sat = await DCCISatellite.findAll({ attributes: ['portalChannel'] })
		const satIDs = sat.map(h => h.portalChannel)
		satIDs.forEach(async id => {
			const channel = client.channels.get(id)
			const messages = await channel.fetchMessages()
			const msgs = messages.filter(x => x.author.id === client.user.id)
			msgs.forEach(async msg => await msg.delete())
		})

		const manualMain = await ManualPortals.findAll({ attributes: ['channelID'] })
		const manualMainIDs = manualMain.map(h => h.channelID)
		manualMainIDs.forEach(async id => {
			const channel = client.channels.get(id)
			const messages = await channel.fetchMessages()
			const msgs = messages.filter(x => x.author.id === client.user.id)
			msgs.forEach(async msg => await msg.delete())
		})

		const manualSat = await ManualSatellite.findAll({ attributes: ['channelID'] })
		const manualSatIDs = manualSat.map(h => h.channelID)
		manualSatIDs.forEach(async id => {
			const channel = client.channels.get(id)
			const messages = await channel.fetchMessages()
			const msgs = messages.filter(x => x.author.id === client.user.id)
			msgs.forEach(async msg => await msg.delete())
		})

	} finally {
		const main = await DCCIServers.findAll({
			attributes: ['guildID', 'portalChannel'],
			order: client.sequelize.col('createdAt')
		})
		const channelIDs = main.map(h => h.portalChannel)
		const guildIDs = main.map(h => h.guildID)
		channelIDs.forEach(async cid => {
			const channel = client.channels.get(cid)
			guildIDs.forEach(async gid => {
				const browseData = await DCCIServers.findOne({ where: { guildID: gid } })
				const inv = await client.fetchInvite(browseData.get('link'))
				const embed = new RichEmbed()
					.addField(`Link to the server:`, `${browseData.get('link')}\n${greenEmoji} ${inv.presenceCount} online ${greyEmoji} ${inv.memberCount} members`)
					.setAuthor(browseData.get('name'), client.guilds.get(gid).iconURL)
					.setColor(channel.guild.me.displayColor)
					.setDescription(browseData.get('description'))
					.setThumbnail(client.guilds.get(gid).iconURL)
				const msg = await channel.send({ embed })
				await Embeds.create({
					portalID: channel.id,
					guildID: gid,
					messageID: msg.id
				})
			})
		})

		const sat = await DCCISatellite.findAll({
			attributes: ['guildID', 'portalChannel'],
			order: client.sequelize.col('createdAt')
		})
		const satChannelIDs = sat.map(h => h.portalChannel)
		const satGuildIDs = sat.map(h => h.guildID)
		satChannelIDs.forEach(async cid => {
			const channel = client.channels.get(cid)
			satGuildIDs.forEach(async gid => {
				const browseData = await DCCISatellite.findOne({ where: { guildID: gid } })
				const inv = await client.fetchInvite(browseData.get('link'))
				const embed = new RichEmbed()
					.addField(`Link to the server:`, `${browseData.get('link')}\n${greenEmoji} ${inv.presenceCount} online ${greyEmoji} ${inv.memberCount} members`)
					.setAuthor(browseData.get('name'), client.guilds.get(gid).iconURL)
					.setColor(channel.guild.me.displayColor)
					.setDescription(browseData.get('description'))
					.setThumbnail(client.guilds.get(gid).iconURL)
				const msg = await channel.send({ embed })
				await Embeds.create({
					portalID: channel.id,
					guildID: gid,
					messageID: msg.id
				})
			})
		})

		const manualMain = await ManualPortals.findAll({ attributes: ['portalChannel'] })
		const manualMainChannelIDs = manualMain.map(h => h.portalChannel)
		manualMainChannelIDs.forEach(async cid => {
			const channel = client.channels.get(cid)
			guildIDs.forEach(async gid => {
				const browseData = await DCCIServers.findOne({ where: { guildID: gid } })
				const inv = await client.fetchInvite(browseData.get('link'))
				const embed = new RichEmbed()
					.addField(`Link to the server:`, `${browseData.get('link')}\n${greenEmoji} ${inv.presenceCount} online ${greyEmoji} ${inv.memberCount} members`)
					.setAuthor(browseData.get('name'), client.guilds.get(gid).iconURL)
					.setColor(channel.guild.me.displayColor)
					.setDescription(browseData.get('description'))
					.setThumbnail(client.guilds.get(gid).iconURL)
				const msg = await channel.send({ embed })
				await Embeds.create({
					portalID: channel.id,
					guildID: gid,
					messageID: msg.id
				})
			})
		})

		const manualSat = ManualSatellite.findAll({ attributes: ['channelID'] })
		const manualSatChannelIDs = manualSat.map(h => h.channelID)
		manualSatChannelIDs.forEach(async cid => {
			const channel = client.channels.get(cid)
			satGuildIDs.forEach(async gid => {
				const browseData = await DCCISatellite.findOne({ where: { guildID: gid } })
				const inv = await client.fetchInvite(browseData.get('link'))
				const embed = new RichEmbed()
					.addField(`Link to the server:`, `${browseData.get('link')}\n${greenEmoji} ${inv.presenceCount} online ${greyEmoji} ${inv.memberCount} members`)
					.setAuthor(browseData.get('name'), client.guilds.get(gid).iconURL)
					.setColor(channel.guild.me.displayColor)
					.setDescription(browseData.get('description'))
					.setThumbnail(client.guilds.get(gid).iconURL)
				const msg = await channel.send({ embed })
				await Embeds.create({
					portalID: channel.id,
					guildID: gid,
					messageID: msg.id
				})
			})
		})

	}
}