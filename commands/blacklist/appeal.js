const { RichEmbed } = require('discord.js')
exports.run = async (client, message) => {
	try {
		const isBlacklisted = await Blacklist.findOne({ where: { userID: message.author.id } })
		if (!isBlacklisted) return message.reply('you are not blacklisted, therefore, you don\'t need to appeal anything!')
		let knewAboutBan
		let reasoning
		let additNotes
		const appealChannel = client.channels.get(client.config.appealChannelID)
		const filter = m => m.author.id === message.author.id
		const dmChannel = await message.author.createDM()
		await message.reply('go check your private messages, where you\'ll receive an appeal prompt!')
		await dmChannel.send('Welcome to the appeal system! Here, you can get '
			+ 'yourself removed from DCCI blacklist. Just answer a couple of '
			+ 'questions given to you in this DM by a bot to get your appeal '
			+ 'sent! You will have 30 seconds to answer each question! '
			+ `Do \`${client.config.prefix}begin\` to start the process!`)
		let collected = await dmChannel.awaitMessages(filter, {
			time: 30000,
			max: 1,
			errors: ['time']
		})
		if (collected.first().content === `${client.config.prefix}begin`) {
			const reactFilter = (reaction, user) =>
				['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id
			const msg = await dmChannel.send('Did you knew that you were DCCI-wide '
				+ ' blacklisted the moment you\'ve gotten blacklisted? Click on '
				+ ':white_check_mark: if your answer is "Yes" and :x: if your answer is "No".')
			await msg.react('✅')
			await msg.react('❌')
			collected = await msg.awaitReactions(reactFilter, {
				time: 30000,
				max: 1,
				errors: ['time']
			})
			knewAboutBan = collected.first().emoji.name === '✅' ? 'Yes' : 'No'
			await dmChannel.send('Explain us your situation. What has gotten you blacklisted, '
				+ 'and why do you think should we remove you from the blacklist?')
			collected = await dmChannel.awaitMessages(filter, {
				time: 30000,
				max: 1,
				errors: ['time']
			})
			reasoning = collected.first().content
			await dmChannel.send('Is there anything else you would like to say?')
			collected = await dmChannel.awaitMessages(filter, {
				time: 30000,
				max: 1,
				errors: ['time']
			})
			additNotes = collected.first().content
			const id = isBlacklisted.get('userID')
			const user = await client.fetchUser(id)
			const embed = new RichEmbed()
				.setAuthor(user.tag, user.avatarURL)
				.setTitle('Blacklisted user\'s appeal')
				.addField('Has user known about their presence in blacklist?', knewAboutBan)
				.addField('Blacklisted user\'s explanation:', reasoning)
				.addField('Blacklisted user\'s additional notes:', additNotes)
				.setThumbnail(user.avatarURL)
				.setColor(appealChannel.guild.me.displayColor)
				.setFooter(client.config.copymark, client.user.avatarURL)
				.setTimestamp()
			const m = await appealChannel.send({ embed })
			await m.react('✅')
			await m.react('❌')
			await dmChannel.send('Your appeal has been sent to our server! We will reach '
				+ 'you out once we will take a decision on your appeal.')
			const collector = await m.createReactionCollector(reactFilter, {
				time: 172800000,
			})
			collector.on('collect', async reaction => {
				if (reaction.emoji.name === '✅' && reaction.count === 6) {
					await Blacklist.destroy({ where: { userID: id } })
					await dmChannel.send('Your appeal has been accepted and you have been removed from our blacklist!')
					await collector.stop()
				} else if (reaction.emoji.name === '❌' && reaction.count === 6) {
					await dmChannel.send('Unfortunately, your appeal has been rejected. Better luck next time.')
				}
			})
			collector.on('stop', async (collection, reason) => {
				if (reason === 'time')
					await dmChannel.send('Unfortunately, your appeal has been rejected. Better luck next time.')
			})
		} else return dmChannel.send('Exited the prompt.')
	} catch (e) {
		console.error(e)
		const dmChannel = client.channels.get(message.author.dmChannel.id)
		if (dmChannel)
			if (e.toString() === '[object Map]')
				return dmChannel.send('Exited the prompt due to no message received by an elapsed time.')
			else
				return dmChannel.send('A bot has ran into an issue while accepting information from you. '
				+ 'Please try again. If the issues persist, contact the developer of the bot.')
		else
			return message.channel.send('Failed to create a DM with you. Please make sure you have private messages enabled!')
	}
}