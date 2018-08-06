const { RichEmbed } = require('discord.js')
exports.run = async (client, message, args) => {
  if (!args[0]){
		const servers = await DCCIServers.findAll({
			attributes: ['guildID', 'name', 'description', 'link']
		})
		var x = 0
		var curPage = 1
		var allPages = servers.length
		var server = await client.guilds.get(servers[x].dataValues.guildID)
		var embed = new RichEmbed()
		.setAuthor(servers[x].dataValues.name)
    .setColor(message.member.displayColor)
		.setThumbnail(server.iconURL)
		.setDescription(servers[x].dataValues.description)
		.addField('Link to the server:', servers[x].dataValues.link)
		.setFooter(`Page ${curPage}/${allPages} | Requested by ${message.author.tag}`, client.user.avatarURL)
    .setTimestamp()
		await message.channel.send({embed})
	}
}