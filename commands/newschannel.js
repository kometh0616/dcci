exports.run = async (client, message, args) => {
	const { RichEmbed } = require('discord.js')
	if (!message.member.hasPermission('ADMINISTRATOR')) return
	if (args[0] === 'destroy'){
		let curChannel = await Newschannels.findOne({
			where: {
				serverID: message.guild.id
			}
		})
		if (curChannel){
			await Newschannels.destroy({
				where: {
					serverID: message.guild.id
				}
			})
			return message.reply('DCCI news subscription is removed from your news channel succesfully!').then(async () => {
				let embed = new RichEmbed()
				.setColor(message.guild.members.get(client.user.id).displayColor)
				.setAuthor(message.author.tag, message.author.avatarURL)
				.setTitle('DCCI news subscription was removed!')
				.addField('Action performed by:', message.author.tag)
				.setFooter(client.config.copymark, client.user.avatarURL)
				.setTimestamp()
				let browse = await Logchannels.findOne({
					where: {
						guildID: message.guild.id
					}
				})
        if (!browse) return
				let logChannel = message.guild.channels.get(browse.get('channelID'))
				logChannel.send({embed})
			})
		}
		else {
			return message.reply('no news channel detected!')
		}
	}
	else {
		let channelMention = message.mentions.channels.first()
		let channel = channelMention != undefined ? channelMention.id : args[0]
		let server = client.channels.get(channel).guild.id
		await Newschannels.create({
			serverID: server,
			channelID: channel
		})
		return message.reply(`the channel <#${channel}> is now set up to inform you about any DCCI annoucements!`).then(async () => {
			let embed = new RichEmbed()
			.setColor(message.guild.members.get(client.user.id).displayColor)
			.setAuthor(message.author.tag, message.author.avatarURL)
			.setTitle('DCCI news subscription was enabled!')
			.addField('Action performed by:', message.author.tag)
			.addField('Set up channel:', `<#${channel}> (${client.channels.get(channel).name})`)
			.setFooter(client.config.copymark, client.user.avatarURL)
			.setTimestamp()
			let browse = await Logchannels.findOne({
				where: {
					guildID: message.guild.id
				}
			})
      if (!browse) return
			let logChannel = message.guild.channels.get(browse.get('channelID'))
			logChannel.send({embed})
		})
	}
}

exports.help = {
	name: 'newschannel',
	description: 'Sets up a bot to send a message everytime one is sent in DCCI news channel. Can only be used by server admins.',
	subcommands: ['destroy'],
	usage: '>newschannel <channel ID, channel mention or a subcommand>'
}