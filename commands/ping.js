exports.run = async (client, message, args) => {
  let preEdit = new Date()
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
  message.channel.send("Please wait...").then(m => {
    let postEdit = new Date()
    m.edit({embed: {
      color: message.member.displayColor,
      author
    }})
}
;
exports.help = {
	name: 'ping',
	description: 'Tells you your ping.',
	subcommands: 'none',
	usage: '>ping'
}