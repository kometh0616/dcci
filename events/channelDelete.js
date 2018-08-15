module.exports = async (client, channel) => {
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
	if (newsChannel && channel.id === newsChannel.get('channelID')){
		await newsChannel.destroy({
			where: {
				serverID: channel.guild.id
			}
		})
	}
	if (DBansVerificationChannel && channel.id === DBansVerificationChannel.get('channelID')) {
		await DBansVerificationChannel.destroy({
			where: {
				guildID: channel.guild.id
			}
		})
	}
}
