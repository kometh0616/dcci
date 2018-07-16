exports.run = async (client, message, args) => {
	let thisServerID = message.guild.id;
	let fetchBList = await DCCIBans.findOne({
		where: {
			guildID: thisServerID,
		}
	})
	let blacklisted;
	let reasonForBList = args.slice(2).join(" ");
	if (!message.mentions.users.first()){
		blacklisted = args[1]
	}
	else if (message.mentions.users.first()){
		blacklisted = message.mentions.users.first().id;
	}
	let checkBList = await Blacklist.findOne({
		where: {
			userID: blacklisted,
		}
	})
	let blacklister = message.author.tag
  let blacklistedTag = `${client.fetchUser()}`
	switch (args[0]){
		case "add":
    if (!client.guilds.get("320659280686743602").members.get(message.author.id).hasPermission('ADMINISTRATOR')) return
    if (!args[1]) return message.reply('no ID defined!')
    if (!client.fetchUser(blacklisted)) return message.reply('invalid ID!')
		if (checkBList){
			return message.reply(`that ID is already blacklisted!`)
		}
		let addToBList = await Blacklist.create({
			userID: blacklisted,
			reason: reasonForBList,
			author: blacklister,
		})
		message.reply(`ID added to blacklist succesfully!`)
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
        value: `<@${blacklisted}>\n${blacklistedTag}`
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
		}})
		break;
		case "remove":
    if (!client.guilds.get("320659280686743602").members.get(message.author.id).hasPermission('ADMINISTRATOR')) return
    if (!args[1]) return message.reply('no ID defined!')
    if (!client.fetchUser(blacklisted)) return message.reply('invalid ID!')
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
			},
      {
        name: "Removed user:",
        value: `<@${blacklisted}>\n${blacklistedTag}`
      }],
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: client.config.copymark
			}
		}})
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
			message.channel.send({embed:{
				color: message.guild.members.get(message.author.id).displayColor,
				author: {
					name: client.user.username,
					icon_url: client.user.avatarURL
				},
				title: "Information on blacklisted ID",
				fields:[{
					name: "Blacklisted user:",
					value: `<@${checkBList.get('userID')}>\n${client.fetchUser(checkBList.get('userID')).tag}`
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
			break;
		}
		default:
		let grabAll = await Blacklist.findAll({
			attributes: ['userID']
		})
		let mapOut = grabAll.map(g => g.userID).join(`\n`)
		message.reply(`Here are all the ID's that are blacklisted in DCCI:\n${mapOut}\n\nDo \`>blacklist info <id or mention>\` to get information on why were they blacklisted!`, {split: true})
		break;
	}
}

exports.help = {
	name: 'blacklist',
	description: 'Manages DCCI Blacklist. Can be controlled by subcommands.\nAdd and remove subcommands manage people (IDs) in the list. These commands can only be used by DCCI Admins.\nEnable and disable subcommands toggle the blacklist per-server. Only server admins are allowed to use this command.\nThe rest of the subcommands can be used by anyone.',
	subcommands: ['add', 'remove', 'enable', 'disable', 'info'].join(', '),
	usage: ['>blacklist', '>blacklist <subcommand>', '>blacklist <subcommand> <user ID>'].join(', ')
}
