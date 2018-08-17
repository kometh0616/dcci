module.exports = async (client, role) => {
	const { RichEmbed } = require('discord.js')
	let fetch = await DBans.findOne({
	where: {
			guildID: role.guild.id,
			verification: true
		}
	})
	let loggingChannel = await Logchannels.findOne({
		where: {
			guildID: role.guild.id
		}
	})
	if (!fetch) return
	else if (fetch) {
		if (fetch.get('roleID') === role.id){
			await fetch.destroy({
				where: {
					guildID: role.guild.id,
				}
			})
			if (loggingChannel) {
				let logChannel = role.guild.channels.get(loggingChannel.get('channelID'))
				let embed = new RichEmbed()
				.setColor(role.guild.members.get(client.user.id).displayColor)
				.setTitle('DBANS verification system was disabled!')
				.addField('Reason:', 'Set up verification role got deleted!')
				.setFooter(client.config.copymark, client.user.avatarURL)
				.setTimestamp()
				await logChannel.send({embed})
			}
		}
	}
}