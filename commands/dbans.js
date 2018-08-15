const Blacklist = require('discordblacklist')
const { RichEmbed } = require('discord.js')
exports.run = async (client, message, args) => {
	const blacklist = new Blacklist(client.config.apiToken)
	let thisServerID = message.guild.id
	let primeModel = await DBans.findOne({
		where: {
			guildID: thisServerID
		}
	})
	if (!primeModel) {
		await DBans.create({
			guildID: thisServerID
		})
	}
	let autoBans = await DBans.findOne({
		where: {
			guildID: thisServerID,
			autoban: true
		}
	})
	let verification = await DBans.findOne({
		where: {
			guildID: thisServerID,
			verification: true
		}
	})
	switch (args[0]) {
		case 'enable':
			if (!message.member.hasPermission('ADMINISTRATOR')) return
			switch (args[1]) {
				case 'autoban':
					if (!autoBans) {
						await DBans.update({
							autoban: true
						},{
							where: {
								guildID: thisServerID
							}
						})
						return await message.reply('DBANS autoban system is enabled for this server!')
					} else if (verification) {
							let role = verification.get('roleID')
							let roleInServer = message.guild.roles.get(role)
							if (roleInServer) await roleInServer.delete()
							let channel = verification.get('channelID')
							let channelInServer = message.guild.channels.get(channel)
							if (channelInServer) await channelInServer.delete()
							await DBans.update({
								autoban: true,
								verification: false,
								roleID: undefined,
								channelID: undefined
							},{
								where:{
									guildID: thisServerID
								}
							})
							return await message.reply('DBANS autoban system is enabled for this server!')
					} else if (autoBans) {
							return message.reply('DBANS autoban system is already enabled! If you want DBanned users to be verified instead, do `>dbans enable verification`, or, if you want to disable the system entirely, do `>dbans disable`!')
					}
					break;
				case 'verification':
					if (!verification || autoBans) {
						await DBans.update({
							autoban: false,
							verification: true
						},{
							where: {
								guildID: thisServerID
							}
						})
						await message.guild.createRole({
							name: 'DBanned User',
							color: 'DARK_BLUE',
							permissions: 67439680
						}, `Needed for DBANS verification system. Enabled by ${message.author.tag}.`).then(async r => {
							message.guild.channels.forEach(async c => {
								await c.overwritePermissions(r, {
									'READ_MESSAGES': false,
									'SEND_MESSAGES': false,
								}, `DBANS verification system enabled by ${message.author.tag}. Roles were overwritten to make sure DBanned people would not see any channels. If you have permission to edit channel permissions, feel free to toggle them under your needs.`)
							})
							await DBans.update({
								roleID: r.id
							},{
								where: {
									guildID: thisServerID
								}
							})
						}).catch(async err => {
							console.error(err)
							return await message.channel.send('Couldn\'t create a role for DBanned people. Make sure I either have `Administrator` or `Manage Roles` permissions!')
						})
						let ver = await DBans.findOne({
							where: {
								guildID: thisServerID,
								verification: true
							}
						})
						let role = await message.guild.roles.get(ver.get('roleID'))
						await message.guild.createChannel('dbans-unverified', 'text', [{
							id: message.guild.id,
							deny: ['READ_MESSAGES', 'SEND_MESSAGES']
						},
						{
							id: role.id,
							allow: ['READ_MESSAGES', 'SEND_MESSAGES']
						}], `Needed for DBANS verification system. Enabled by ${message.author.tag}.`).then(async c => {
							await DBans.update({
								channelID: c.id
							},{
								where: {
									guildID: thisServerID
								}
							})
						}).catch(async err => {
							console.error(err)
							await message.channel.send('Couldn\'t create a channel for DBanned people. Make sure I either have `Administrator` or `Manage Channels` permissions!')
						})
						return await message.reply(`DBANS verification system enabled succesfully!`)
					} else if (verification) {
						return await message.reply('DBANS verification system is already enabled! If you want to autoban DBanned people, do `>dbans enable autoban`, or, if you want to disable the system completely, do `>dbans disable`!')
					}
					break;
				default:
				return await message.reply('please define a mode in which you would like your DBANS system enabled: `autoban` or `verification`')
			}
			break;
		case 'disable':
		if (!message.member.hasPermission('ADMINISTRATOR')) return
		if (verification) {
			let role = await message.guild.roles.get(verification.get('roleID'))
			if (role) await role.delete()
			let channel = await message.guild.channels.get(verification.get('channelID'))
			if (channel) await channel.delete()
			await DBans.update({
				autoban: false,
				verification: false,
				roleID: undefined,
				channelID: undefined
			},{
				where: {
					guildID: thisServerID
				}
			})
		} else {
			await DBans.update({
				autoban: false,
				verification: false,
				roleID: undefined,
				channelID: undefined
			},{
				where: {
					guildID: thisServerID
				}
			})
		}
		await message.reply('DBANS system succesfully disabled for this server!')
		break;
		case 'verify':
			if (!message.member.hasPermission('ADMINISTRATOR')) return
			if (verification) {
				let mentionedUser = message.mentions.members.first()
				if (!mentionedUser) return message.reply('please mention a user you want to verify!')
				let verificationRole = message.guild.roles.get(verification.get('roleID'))
				await mentionedUser.removeRole(verificationRole, `User verified by ${message.author.tag}.`)
				await message.reply('user verified succesfully!')
			} else {
				await message.reply('this server has DBANS verification system disabled!')
			}
			break;
		case 'info':
			let id = args[1]
			client.fetchUser(id).then(async u => {
				await blacklist.lookup(u.id).then(async res => {
					if (res.banned === 0) return await message.reply('this member is not DBanned!')
					let embed = new RichEmbed()
					.setAuthor(u.tag, u.avatarURL)
					.setColor(message.member.displayColor)
					.setTitle('Information on DBanned user')
					.addField('Case ID:', res.case_id)
					.addField('Reason:', res.reason)
					.addField('Evidence (may contain NSFW content):', res.proof)
					.setTimestamp()
					.setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL)
					await message.channel.send({embed})
				}).catch(err => console.error(err))
			}).catch(err => {
				if (err.code === 10013) return message.reply('no user found with defined ID!')
				else {
					console.error(err)
					return message.reply('something went wrong with fetching user.')
				}
			})
			break;
	}
}

exports.help = {
	name: 'dbans',
	description: 'Toggles DBANS system and allows you to view DBANS data. System toggling is for server admins, while data can be viewed by anyone.',
	subcommands: ['enable autoban', 'enable verification', 'disable', 'verify <mention>', 'info <user id>'].join(', '),
	usage: '>dbans <subcommand>'
}
