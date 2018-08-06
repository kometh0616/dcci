const { RichEmbed } = require('discord.js')
exports.run = async (client, message, args) => {
  if (!args[0]){
		const servers = await DCCIServers.findAll({
			attributes: ['guildID', 'name', 'description', 'link']
		})
		console.log(servers)
	}
}