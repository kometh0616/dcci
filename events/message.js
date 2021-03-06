module.exports = async (client, message) => {
	if (message.channel.id === client.config.streamChannelID) {
		const allChannels = await Newschannels.findAll({
			attributes: ['channelID']
		})
		if (!allChannels) return
		allChannels.forEach(async grabbed => {
			let newsChannel = client.channels.get(grabbed.dataValues.channelID)
			const hook = await newsChannel.createWebhook(message.author.username, message.author.avatarURL)
			await hook.send(message.content)
			await hook.delete()
		})
	}
	else {	
		if (!message.content.startsWith(client.config.prefix) || message.author.bot || message.channel.type === "dm") return;
		const args = message.content.slice(client.config.prefix.length).split(/ +/)
		const command = args.shift().toLowerCase();
		const cmd = client.commands.get(command)
		if (!cmd) return
		cmd.run(client, message, args)
	}
}
