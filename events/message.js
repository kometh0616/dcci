const Discord = require('discord.js')
module.exports = async (client, message) => {
	if (message.channel.id === client.config.streamChannelID){
		const allChannels = await Newschannels.findAll({
			attributes: ['channelID']
		})
		if (!allChannels) return
		allChannels.forEach(async grabbed => {
			let newsChannel = client.channels.get(grabbed.dataValues.channelID)
			let embed = new Discord.RichEmbed()
			.setColor(newsChannel.guild.members.get(client.user.id).displayColor)
			.setAuthor(message.author.tag, message.author.avatarURL)
			.setDescription(message)
			.setFooter(client.config.copymark, client.user.avatarURL)
			.setTimestamp()
			if (message.mentions.everyone){
				await newsChannel.send(`@everyone`)
				await newsChannel.send({embed})
			}
			else {
				await newsChannel.send({embed})
			}
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
