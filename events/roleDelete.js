module.exports = async (client, role) => {
	let fetch = await DBans.findOne({
	where: {
			guildID: role.guild.id,
			verification: true
		}
	})
	if (!fetch) return
	else if (fetch){
		if (fetch.get('roleID') === role.id){
			fetch.destroy({
				where: {
					guildID: role.guild.id,
				}
			})
		}
	}
}
