exports.run = async (client, message, args, Discord, thisServerID, fetchBList, blacklisted, reasonForBList, checkBList, blacklister) => {
    		var blackIDs = []
		var included = []
		for (let arg of args) {
			if (arg === 'bulkadd' || isNaN(arg) === true) continue
			let checkIDs = await Blacklist.findOne({
				where: {
					userID: arg
				}
			})
			if (checkIDs) {
				included.push(checkIDs.dataValues.userID)
				continue
			}
			blackIDs.push(arg)
		}
		async function perform() {
			blackIDs.forEach(async id => {
				async function addToList() {
					client.fetchUser(id).then(async user => {
						let reasonForBList = args.slice(blackIDs.length + 1).join(' ') || "None"
						await Blacklist.create({
							userID: user.id,
							tag: user.tag,
							reason: reasonForBList,
							author: blacklister
						})
						await client.channels.get(client.config.logChannelID).send({embed: {
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
							value: `<@${id}>\n${user.tag}`
							},
							{
								name: "Blacklisted ID:",
								value: id
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
					}).catch(async err => {
						console.error(err)
						if (err.code = 10013) await message.channel.send(`User with ID ${id} doesn't exist, skipping...`)
					})
				}
			})
		}
		await perform()
		async function answer() {
			let reply = 'ID\'s added to blacklist succesfully!'
			if (included[0] !== undefined) {
				reply += `\nThese ID's were skipped because they were already in a blacklist:\n${included.join('\n')}`
			}
			await message.reply(reply)
		}
		await answer()
}