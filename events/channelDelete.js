module.exports = async (client, channel) => {
	let newsChannel = await Newschannels.findOne({
		where: {
			serverID: channel.guild.id
		}
	})
	if (!newsChannel) return
	else if (newsChannel){
		await newsChannel.destroy({
			where: {
				serverID: channel.guild.id
			}
		})
	}
}