exports.run = async (client, message, args) => {
	let thisServerID = message.guild.id;
	let findInDatab = await Pings.findOne({
		where: {
			guildID: thisServerID,
		}
	})
	if (!findInDatab){
		findInDatab = await Pings.create({
			guildID: thisServerID,
		})
	}
	let thisMuch = await findInDatab.get('amount')
	findInDatab.increment('amount').catch(console.error)
	message.channel.send(`Pong! This command was called ${thisMuch} times!\nYour ping is: \`${(Date.now() - message.createdAt) * -1}\`ms!`).catch(console.error)
}

exports.help = {
	name: 'ping',
	description: 'Tells you your ping.',
	subcommands: 'none',
	usage: '>ping'
}