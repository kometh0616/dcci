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
	switch (args[0]){
		case "add":
		if (checkBList){
			return message.reply(`that ID is already blacklisted!`)
		}
		let addToBList = await Blacklist.create({
			userID: blacklisted,
			reason: reasonForBList,
			author: blacklister,
		})
		message.reply(`ID added to blacklist succesfully!`)
		break;
		case "remove":
		let removeFromBList = await Blacklist.destroy({
			where: {
				userID: blacklisted,
			}
		})
		if (!removeFromBList){
			return message.reply("this ID is not in a blacklist!")
		}
		message.reply("ID removed from blacklist succesfully!")
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
					value: `<@${checkBList.get('userID')}>`
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
		message.reply(`Here are all the ID's that are blacklisted in DCCI:\n${mapOut}\n\nDo \`./blacklist info <id or mention>\` to get information on why were they blacklisted!`)
		break;
	}
}

exports.help = {
	name: 'blacklist',
	description: 'Manages DCCI Blacklist. Can be controlled by subcommands.\nAdd and remove subcommands manage people (IDs) in the list. These commands can only be used by DCCI Admins.\nEnable and disable subcommands toggle the blacklist per-server. Only server admins are allowed to use this command.\nThe rest of the subcommands can be used by anyone.',
	subcommands: ['add', 'remove', 'enable', 'disable', 'info'].join(', '),
	usage: ['./blacklist', './blacklist <subcommand>', './blacklist <subcommand> <user ID>'].join(', ')
}
