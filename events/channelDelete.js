module.exports = async (client, channel) => {
	let fetch = await DBans.findOne({
	where: {
			guildID: channel.guild.id,
			verification: true
		}
	})
	if (!fetch) return
	else if (fetch){
		if (fetch.get('verifyChannel') === channel.id){
			fetch.destroy({
				where: {
					guildID: channel.guild.id,
				}
			})
		}
	}
}