const Discord = require('discord.js')
exports.run = async (client, message, args) => {
	let thisServerID = message.guild.id;
	let fetchBList = await DCCIBans.findOne({
		where: {
			guildID: thisServerID,
		}
	})
	let blacklisted;
	let reasonForBList = args.slice(2).join(" ");
  if (args[1]){
	let mention = message.mentions.users.first();
	blacklisted = mention != undefined ? mention.id : args[1]
  	}
	let checkBList = await Blacklist.findOne({
		where: {
			userID: blacklisted,
		}
	})
	let blacklister = message.author.tag
	if (args[0]) {
		let name = isNaN(args[0]) === true ? args[0].toLowerCase() : undefined
		let subcommand = client.blacklistSubcommands.get(name)
		if (!subcommand) return
		subcommand.run(client, message, args, Discord, thisServerID, fetchBList, blacklisted, reasonForBList, checkBList, blacklister)
	} else {
		let grabID = await Blacklist.findAll({
			attributes: ['userID']
		})
		var userList = []
		grabID.forEach(async grabbed => {
			userList.push(grabbed.dataValues.userID)
		})
		let grabTags = await Blacklist.findAll({
			attributes: ['tag']
		})
		let tagList = []
		grabTags.forEach(grabbed => {
			tagList.push(grabbed.dataValues.tag)
		})
		var displayedList = []
		var start = 0;
		var end = 10
		for (let index = start; index < end; index++){
			if (userList[index]){
				displayedList.push(`${userList[index]} - ${tagList[index]}`)
			}
		}
		var currentPage = 1
		var allPages = userList.length % 10 === 0 ? userList.length / 10 : Math.floor(userList.length / 10) + 1
		let embed = new Discord.RichEmbed()
		.setAuthor(message.author.tag, message.author.avatarURL)
		.setTitle('Blacklisted ID\'s')
		.setDescription(displayedList.join('\n'))
		.setFooter(`Page ${currentPage}/${allPages}`, client.user.avatarURL)
		.setTimestamp()
		message.channel.send({embed}).then(async msg => {
			const filter = (reaction, user) => ['⬅', '➡', '❌'].includes(reaction.emoji.name) && user.id === message.author.id 
			await msg.react('⬅')
			await msg.react('➡')
			await msg.react('❌')
			const collector = await msg.createReactionCollector(filter)
			collector.on("collect", async reaction => {
				await reaction.remove(message.author.id)
				if (reaction.emoji.name === '⬅' && start != 0 && end != 9){
					start -= 10
					end -= 10
					displayedList = []
					for (let index = start; index < end; index++){
						if (userList[index]){
							displayedList.push(`${userList[index]} - ${tagList[index]}`)
						}
					}
					currentPage--
					embed.setDescription(displayedList.join('\n'))
					embed.setFooter(`Page ${currentPage}/${allPages}`, client.user.avatarURL)
					msg.edit({embed})
				}
				else if (reaction.emoji.name === '➡' && end <= userList.length){
					start += 10
					end += 10
					displayedList = []
					for (let index = start; index < end; index++){
						if (userList[index]){
							displayedList.push(`${userList[index]} - ${tagList[index]}`)
						}
					}
					currentPage++
					embed.setDescription(displayedList.join('\n'))
					embed.setFooter(`Page ${currentPage}/${allPages}`, client.user.avatarURL)
					msg.edit({embed})
				}
				else if (reaction.emoji.name === '❌'){
					await collector.stop()
					await msg.delete()
					await message.delete()
					start = 0
					end = 9
				}
			})
		})
	}
}


exports.help = {
	name: 'blacklist',
	description: 'Manages DCCI Blacklist. Can be controlled by subcommands.\nAdd and remove subcommands manage people (IDs) in the list. These commands can only be used by DCCI Admins.\nEnable and disable subcommands toggle the blacklist per-server. Only server admins are allowed to use this command.\nThe rest of the subcommands can be used by anyone.',
	subcommands: ['add', 'remove', 'enable', 'disable', 'info'].join(', '),
	usage: ['>blacklist', '>blacklist <subcommand>', '>blacklist <subcommand> <user ID>'].join(', ')
}
