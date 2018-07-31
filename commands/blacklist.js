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
	switch (args[0]){
		case "add":
	if (!client.guilds.get("320659280686743602").members.get(message.author.id).hasPermission('ADMINISTRATOR')) return
	if (!args[1]) return message.reply('no ID defined!')
	if (!client.fetchUser(blacklisted)) return message.reply('invalid ID!')
		if (checkBList){
			return message.reply(`that ID is already blacklisted!`)
		}
		client.fetchUser(blacklisted).then(async user => {
			await Blacklist.create({
				userID: blacklisted,
				tag: user.tag,
				reason: reasonForBList,
				author: blacklister,
			})
	     client.channels.get(client.config.logChannelID).send({embed: {
		  	color: client.channels.get(client.config.logChannelID).guild.members.get(client.user.id).displayColor,
		  	author: {
		  		name: message.author.username,
		  		icon_url: message.author.avatarURL
		  	},
		  	title: "New user added to blacklist!",
		  	fields: [{
		  		name: "Action performed by:",
		  		value: blacklister
		  	},
			{
				name: "Blacklisted user:",
				value: `<@${blacklisted}>\n${user.tag}`
			},
  			{
  				name: "Blacklisted ID:",
				  value: blacklisted
			  },
		  	{
		  		name: "Reason for adding to blacklist:",
		  		value: reasonForBList
		  	}],
		  	timestamp: new Date(),
		  	footer: {
		  		icon_url: client.user.avatarURL,
		  		text: client.config.copymark
		  	}
		  }}).catch(err => {
			console.log('Error in add subcommand!')
			console.error(err)
		})
		  return message.reply('ID added to blacklist succesfully!')
		}).catch(err => {
			console.error(err)
			if (err.code = 10013){
				return message.reply('no user found with this ID!')
			}
		})
		break;
		case "remove":
		if (!client.guilds.get("320659280686743602").members.get(message.author.id).hasPermission('ADMINISTRATOR')) return
		if (!args[1]) return message.reply('no ID defined!')
		let removeFromBList = await Blacklist.destroy({
			where: {
				userID: blacklisted,
			}
		})
		if (!removeFromBList){
			return message.reply("this ID is not in a blacklist!")
		}
		message.reply("ID removed from blacklist succesfully!")
		client.channels.get(client.config.logChannelID).send({embed: {
			color: client.channels.get(client.config.logChannelID).guild.members.get(client.user.id).displayColor,
			author: {
				name: message.author.username,
				icon_url: message.author.avatarURL
			},
			title: "User ID removed from DCCI blacklist!",
			fields: [{
				name: "Action performed by:",
				value: blacklister
			},
			{
				name: "Removed ID:",
				value: blacklisted
			}],
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: client.config.copymark
			}
		}}).catch(err => {
			console.log('Error in remove subcommand!')
			console.error(err)
		})
		break;
		case "enable":
		if (!message.member.hasPermission('ADMINISTRATOR', false, true, true)) return
		if (!fetchBList){
			fetchBList = await DCCIBans.create({
				guildID: thisServerID,
			})
		}
		if (fetchBList.get('switch') === true){
			return message.reply(`DCCI blacklist is already enabled!`)
		}
		else if (fetchBList.get('switch') === false){
			let enableBList = await DCCIBans.update({
				switch: true
			},
			{
			where:{
				guildID: thisServerID
			}})
			message.reply('DCCI blacklist has been enabled for this server!')
		}
		break;
		case "disable":
		if (!message.member.hasPermission('ADMINISTRATOR', false, true, true)) return
		if (!fetchBList){
			return message.reply(`DCCI blacklist is already disabled!`)
		}
		else if (fetchBList){
			if (fetchBList.get('switch') === false){
				return message.reply(`DCCI blacklist is already disabled!`)
			}
			let disableList = await DCCIBans.update({
				switch: false,
			},
			{
			where: {
				guildID: thisServerID
			}})
			message.reply(`DCCI blacklist has been disabled for this server!`)
		}
		break;
		case "info":
	if (!args[1]) return message.reply('no ID defined!')
		if (!checkBList){
			return message.reply(`this user is not blacklisted!`)
		}
		else if (checkBList){
			let getReason = checkBList.get('reason') || "none"
	  client.fetchUser(checkBList.get('userID')).then(user => {
		  	message.channel.send({embed:{
		  		color: message.member.displayColor,
		  		author: {
		  			name: message.author.tag,
		  			icon_url: message.author.avatarURL
	  			},
		  		title: "Information on blacklisted ID",
		  		fields:[{
		  			name: "Blacklisted user:",
		  			value: `<@${checkBList.get('userID')}>\n${user.tag}`
		  		},
		  		{
		  			name: "ID:",
			  		value: `${checkBList.get('userID')}`
			  	},
			  	{
		  			name: "Blacklisted by:",
		  			value: `${checkBList.get('author')}`
		  		},
		  		{
		  			name: "Reason:",
		  			value: `${getReason}`
		  		}],
		  		timestamp: new Date(),
			  	footer: {
			  		icon_url: client.user.avatarURL,
			  		text: "© DCCI Bot"
			  	}
			  }})
	  }).catch(err => {
		console.log(err)
		message.reply('an error has occured. Chances are the blacklisted user you\'ve declared is not in Discord anymore. If that is not the case, please contact a developer.')
	  })
			break;
		}
		default:
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
		break;
	}
}

exports.help = {
	name: 'blacklist',
	description: 'Manages DCCI Blacklist. Can be controlled by subcommands.\nAdd and remove subcommands manage people (IDs) in the list. These commands can only be used by DCCI Admins.\nEnable and disable subcommands toggle the blacklist per-server. Only server admins are allowed to use this command.\nThe rest of the subcommands can be used by anyone.',
	subcommands: ['add', 'remove', 'enable', 'disable', 'info'].join(', '),
	usage: ['?blacklist', '?blacklist <subcommand>', '?blacklist <subcommand> <user ID>'].join(', ')
}
