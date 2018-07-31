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
  let preEdit = new Date()
  message.channel.send("Please wait...").then(m => {
    let postEdit = new Date()
    m.edit({embed: {
      color: message.member.displayColor,
      author: {
        name: message.author.tag,
        icon_url: message.author.avatarURL
      },
      title: "Information about ping.",
      fields: [{
        name: "This command was called",
        value: `${thisMuch} times in this server.`
      },
      {
        name: "Server ping:",
        value: `${postEdit - preEdit}ms`
      },
      {
        name: "API ping:",
        value: `${client.pings[0]}ms`
      }],
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: client.config.copymark
      }
    }})
  })
}
;
exports.help = {
	name: 'ping',
	description: 'Tells you your ping.',
	subcommands: 'none',
	usage: '?ping'
}