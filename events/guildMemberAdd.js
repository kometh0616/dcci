const discordblacklist = require('discordblacklist')
const { RichEmbed } = require('discord.js')
module.exports = async (client, member) => {
	const blacklist =  new discordblacklist(client.config.apiToken)
	let joinedID = member.id;
	let thisServerID = member.guild.id;
	let fetchDCCISettingTrue = await DCCIBans.findOne({
		where: {
			guildID: thisServerID,
			switch: true,
		}
	})
	let fetchDBansSettings = await DBans.findOne({
		where: {
			guildID: thisServerID,
		}
	})
	let loggingChannel = await Logchannels.findOne({
		where: {
			guildID: thisServerID
		}
	})
	if (fetchDCCISettingTrue) {
		let lookout = await Blacklist.findOne({
			where: {
				userID: joinedID,
			}
		})
		if (lookout) {
			member.ban('This user is in a DCCI blacklist.').then(async m => {
				if (!loggingChannel) return
				let logChannel = member.guild.channels.get(loggingChannel.get('channelID'))
				let embed = new RichEmbed()
				.setColor(member.guild.members.get(client.user.id).displayColor)
				.setAuthor(m.user.tag, m.user.avatarURL)
				.setThumbnail(m.user.avatarURL)
				.setTitle('User autobanned from this server!')
				.addField('Autobanned user: ', `<@${m.user.id}> (${m.user.tag})`)
				.addField('User\'s ID:', m.user.id)
				.addField('Reason:', 'Blacklisted in DCCI.')
				.addField('Blacklisted for:', lookout.get('reason'))
				.setFooter(client.config.copymark, client.user.avatarURL)
				.setTimestamp()
				logChannel.send({embed})
			}).catch(console.error);
		}
	}
	if (fetchDBansSettings) {
		if (fetchDBansSettings.get('autoban')){
			blacklist.lookup(joinedID).then(u => {
				if (u.banned === '1') member.ban('This user is DBanned.').then(async m => {
					if (!loggingChannel) return
					let logChannel = member.guild.channels.get(loggingChannel.get('channelID'))
					let embed = new RichEmbed()
					.setColor(member.guild.members.get(client.user.id).displayColor)
					.setAuthor(m.user.tag, m.user.avatarURL)
					.setThumbnail(m.user.avatarURL)
					.setTitle('User autobanned from this server!')
					.addField('Autobanned user: ', `<@${m.user.id}> (${m.user.tag})`)
					.addField('User\'s ID:', m.user.id)
					.addField('Reason:', 'Blacklisted in DBANS.')
					.addField('Blacklisted for:', u.reason)
					.addField('Evidence (may contain NSFW content):', u.proof)
					.setFooter(client.config.copymark, client.user.avatarURL)
					.setTimestamp()
					logChannel.send({embed})
				})
			}).catch(err => console.error(err))
		}
		else if (fetchDBansSettings.get('verification')) {
			blacklist.lookup(joinedID).then(async u => {
				if (u.banned === "1") {
					let verificationRole = await member.guild.roles.get(fetchDBansSettings.get('roleID'))
					let verificationChannel = await member.guild.channels.get(fetchDBansSettings.get('channelID'))
					await member.addRole(verificationRole).then(async m => {
							if (!loggingChannel) return
							let logChannel = member.guild.channels.get(loggingChannel.get('channelID'))
							let embed = new RichEmbed()
							.setColor(member.guild.members.get(client.user.id).displayColor)
							.setAuthor(m.user.tag, m.user.avatarURL)
							.setThumbnail(m.user.avatarURL)
							.setTitle('DBanned user has joined the server!')
							.addField('User: ', `<@${m.user.id}> (${m.user.tag})`)
							.addField('User\'s ID:', m.user.id)
							.addField('Blacklisted for:', u.reason)
							.addField('Evidence (may contain NSFW content):', u.proof)
							.setFooter(client.config.copymark, client.user.avatarURL)
							.setTimestamp()
							logChannel.send({embed})
					})
					await verificationChannel.send(`${member}, welcome to **${member.guild.name}!**\nYou are here, because you are DBanned and you need to be verified by server's staff members. Please mention them so that you could be noticed and get verified!`)
				}
			})
		}
	}
	const greenEmoji = client.emojis.get(client.config.greenEmojiID)
	const greyEmoji = client.emojis.get(client.config.greyEmojiID)
	const findServer = await DCCIServers.findOne({ where: { guildID: member.guild.id } }) || await DCCISatellite.findOne({ where: { guildID: member.guild.id } })
	if (!findServer) return
	const link = await client.fetchInvite(findServer.get('link'))
	const portals = await Embeds.findAll({ attributes: ['portalID'] }).map(h => h.portalID)
	portals.forEach(async channelID => {
		const dat = await Embeds.findOne({
			where: {
				portalID: channelID,
				guildID: member.guild.id,
			}
		})
		if (!dat) return
		const portal = client.channels.get(channelID)
		const msg = await portal.fetchMessage(dat.get('messageID'))
		const embed = new RichEmbed()
			.addField('Link to the server:', `${findServer.get('link')}\n${greenEmoji} ${link.presenceCount} online ${greyEmoji} ${link.memberCount} members`)
			.setAuthor(member.guild.name, member.guild.iconURL)
			.setColor(portal.guild.me.displayColor)
			.setDescription(findServer.get('description'))
			.setThumbnail(member.guild.iconURL)
		await msg.edit({ embed })
	})
}