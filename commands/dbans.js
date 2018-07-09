exports.run = async (client, message, args) => {
	if (!message.member.hasPermission('ADMINISTRATOR', false, true, true)) return
	var thisServerID = message.guild.id
	var fetchSwitch = await DBans.findOne({
		where: {
			guildID: thisServerID,
		}
	})
	async function roleAndChannel(){
		message.guild.createRole({
			name: 'DBanned',
			color: 'DARK_BLUE'
		}).then(async (createdVerifyRole) => {
			await DBans.update({
				verifyRole: createdVerifyRole.id
			},
			{
				where: {
					guildID: thisServerID,
					verification: true
				}
			})
			let allChannels = message.guild.channels.map(channel => channel.id)
			allChannels.forEach(thisChannel => {
				let setableChannel = message.guild.channels.get(thisChannel)
				setableChannel.overwritePermissions(createdVerifyRole, {
					VIEW_CHANNEL: false,
					SEND_MESSAGES: false
				})
			})
			message.guild.createChannel('dbans-unverified', 'text', [{
				id: message.guild.id,
				deny: ['SEND_MESSAGES', 'VIEW_CHANNEL']
			},
			{
				id: createdVerifyRole.id,
				allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
			}]).then(async (createdChannel) => {
				await DBans.update({
					verifyChannel: createdChannel.id
				},
				{
					where: {
						guildID: thisServerID,
						verification: true,
					}
				})
			})
		})
	}
	async function removeRoleAndChannel(){
		if (fetchSwitch.get('verification') === true){
			let verifyRole = message.guild.roles.get(fetchSwitch.get('verifyRole'))
			verifyRole.delete().catch(err => console.error(err))
			let verifyChannel = message.guild.channels.get(fetchSwitch.get('verifyChannel'))
			verifyChannel.delete().catch(err => console.error(err))
		}
	}
	switch (args[0]){
		case "enable":
		switch (args[1]){
			case "autoban":
			if (!fetchSwitch){
				await DBans.create({
					guildID: thisServerID,
				}).then(async (created) => {
					await created.update({
						autoBan: true,
						verification: false
					},
				  {
						where : {
							guildID: thisServerID,
						}
				  })
				})
			}
			else if (fetchSwitch){
				removeRoleAndChannel()
				await fetchSwitch.update({
					autoBan: true,
					verification: false
				},
				{
					where: {
						guildID: thisServerID,
					}
				})
			}
			message.reply("autobanning DBanned members enabled in this server succesfully!")
			break;
			case "verification":
			if (!fetchSwitch){
				await DBans.create({
					guildID: thisServerID,
				}).then(async (created) => {
					await created.update({
						autoBan: false,
						verification: true
					},
					{
						where: {
							guildID: thisServerID,
						}
					})
				})
			roleAndChannel()
			}
			else if (fetchSwitch){
				await fetchSwitch.update({
					autoBan: false,
					verification: true
				},	
				{
					where: {
						guildID: thisServerID
					}
				})
				roleAndChannel()
			}
			message.reply("manual verification of DBanned people enabled successfully!")
			break;
			default:
			if (!fetchSwitch){
				await DBans.create({
					guildID: thisServerID,
				}).then(async (created) => {
					await created.update({
						autoBan: false,
						verification: true
					},
					{
						where: {
							guildID: thisServerID,
						}
					})
				})
				roleAndChannel()
			}
			else if (fetchSwitch){
				await fetchSwitch.update({
					autoBan: false,
					verification: true
				},	
				{
					where: {
						guildID: thisServerID
					}
				})
				roleAndChannel()
			}
			message.reply("manual verification of DBanned people enabled successfully!")
			break;
		}
		break;
		case "disable":
		if (!fetchSwitch){
			return message.reply("DBans system is already not enabled in this server!")
		}
		else if (fetchSwitch){
			removeRoleAndChannel()
			await DBans.destroy({
				where: {
					guildID: thisServerID,
				}
			})
			message.reply('DBans system disabled in this server succesfully!')
		}
		break;
		case "check":
		if (!fetchSwitch){
			return message.reply('this server has DBans system disabled!')
		}
		else if (fetchSwitch) {
			let info = []
			info.push("this server has DBans system enabled!")
			if (fetchSwitch.get('autoBan') === true){
				info.push("DBanned people automatically get banned from this server.")
			}
			else if (fetchSwitch.get('verification') === true){
				info.push("DBanned people get locked away from this server until a moderator verifies them to be suitable for being in the server.")
			}
			message.reply(info, {split: true})
		}
		break;
    case "usercheck":
      await client.blacklist.update()
      let idCheck = await client.blacklist.lookup(args[1])
      if (idCheck){
        return message.reply('this ID is blacklisted in Discord List Bans!')
      }
      else if (!idCheck){
        return message.reply('this ID is not blacklisted in Discord List Bans!')
      }
    break;
	}
}

exports.help = {
	name: 'dbans',
	description: 'Toggles DBans list per-server and checks the status of DBans system in the server. Can only be used by server admins.',
	subcommands: ['enable autoban', 'enable verification', 'disable', 'check'],
	usage: './dbans <subcommand>'
}