const { RichEmbed } = require('discord.js')
exports.run = async (client, message, args) => {
  if (!args[0]){
		const servers = await DCCIServers.findAll({
			attributes: ['guildID', 'name', 'description', 'link']
		})
		var x = 0
		var curPage = 1
		var allPages = servers.length
		var embed = new RichEmbed()
		.setAuthor(servers[x].dataValues.name, client.guilds.get(servers[x].dataValues.guildID).iconURL)
		.setColor(message.member.displayColor)
		.setDescription(`${servers[x].dataValues.description}\n\n**Link to the server:**\n${servers[x].dataValues.link}`)
		.setFooter(`Page ${curPage}/${allPages} | Requested by ${message.author.tag}`, client.user.avatarURL)
		async function updateEmbed(){
			embed.setAuthor(servers[x].dataValues.name, client.guilds.get(servers[x].dataValues.guildID).iconURL)
			embed.setColor(message.member.displayColor)
			embed.setDescription(`${servers[x].dataValues.description}\n\n**Link to the server:**\n${servers[x].dataValues.link}`)
			embed.setFooter(`Page ${curPage}/${allPages} | Requested by ${message.author.tag}`, client.user.avatarURL)
		}
		await message.channel.send({embed}).then(async m => {
			const filter = (reaction, user) => ['⬅', '➡', '❌'].includes(reaction.emoji.name) && user.id === message.author.id 
			await m.react('⬅')
			await m.react('➡')
			await m.react('❌')
			const collector = m.createReactionCollector(filter)
			collector.on('collect', async reaction => {
				await reaction.remove(message.author.id)
				if (reaction.emoji.name === '⬅' && curPage !== 1){
					x--;
					curPage--;
				  await updateEmbed()
					await m.edit({embed})
				}
				else if (reaction.emoji.name === '➡' && curPage !== allPages){
					x++;
					curPage++;
					await updateEmbed()
					await m.edit({embed})
				}
				else if (reaction.emoji.name === '❌'){
					await collector.stop()
					await m.delete()
					await message.delete()
				}
			})
		})
	}
  else {
		let serverName = args.slice(0).join(" ")
		let server = await DCCIServers.findOne({
			where: {
				name: serverName
			}
		})
    if (!server) return message.reply('couldn\'t find that server in DCCI.')
		let embed = new RichEmbed()
		.setAuthor(server.dataValues.name, client.guilds.get(server.dataValues.guildID).iconURL)
		.setColor(message.member.displayColor)
		.setDescription(`${server.dataValues.description}\n\n**Link to the server:**\n${server.dataValues.link}`)
		.setFooter(`Requested by ${message.author.tag}`, client.user.avatarURL)
		message.channel.send({embed})
	}
}

exports.help = {
	name: 'server',
	description: 'Shows you information about servers that belong to DCCI.',
	subcommands: 'none',
	usage: ['>server', '>server <server name>'].join(', ')
}