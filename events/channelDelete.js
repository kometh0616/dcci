module.exports = async (client, channel) => {
	const { RichEmbed } = require('discord.js')
	let newsChannel = await Newschannels.findOne({
		where: {
			serverID: channel.guild.id
		}
	})
	let DBansVerificationChannel = await DBans.findOne({
		where: {
			guildID: channel.guild.id,
			verification: true
		}
	})
	let loggingChannel = await Logchannels.findOne({
		where: {
			guildID: channel.guild.id
		}
	})
	if (newsChannel && channel.id === newsChannel.get('channelID')){
		await newsChannel.destroy({
			where: {
				serverID: channel.guild.id
			}
		})
		if (loggingChannel) {
			let logChannel = channel.guild.channels.get(loggingChannel.get('channelID'))
			let embed = new RichEmbed()
			.setColor(channel.guild.members.get(client.user.id).displayColor)
			.setTitle('DCCI news subscription was disabled!')
			.addField('Reason:', 'Set up news channel got deleted!')
			.setFooter(client.config.copymark, client.user.avatarURL)
			.setTimestamp()
			await logChannel.send({embed})
		}
	}
	if (DBansVerificationChannel && channel.id === DBansVerificationChannel.get('channelID')) {
		await DBansVerificationChannel.destroy({
			where: {
				guildID: channel.guild.id
			}
		})
		if (loggingChannel) {
			let logChannel = channel.guild.channels.get(loggingChannel.get('channelID'))
			let embed = new RichEmbed()
			.setColor(channel.guild.members.get(client.user.id).displayColor)
			.setTitle('DBANS verification system was disabled!')
			.addField('Reason:', 'Set up verification channel got deleted!')
			.setFooter(client.config.copymark, client.user.avatarURL)
			.setTimestamp()
			await logChannel.send({embed})
		}
	}
	if (loggingChannel && channel.id === loggingChannel.get('channelID')) {
		await loggingChannel.destroy({
			where: {
				guildID: channel.guild.id
			}
		})
	}
}