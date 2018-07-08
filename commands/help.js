const fs = require('fs')
exports.run = (client, message, args) => {
  fs.readdir("./commands/", (err, files) => {
		if (err) return console.error(err)
		let jsfiles = files.filter(f => f.split(".").pop() === "js")
		if (jsfiles.length <= 0){
			console.log("No commands to load")
			return
		}
		var namelist = ""
		var desclist = ""
		var sublist = ""
		var usagelist = ""
		message.reply(`sending you a DM of my commands!`)
		message.author.createDM().then(() => {
			jsfiles.forEach((f, i) => { 
				let props = require(`./${f}`)
				namelist = props.help.name
				desclist = props.help.description
				sublist = props.help.subcommands
				usagelist = props.help.usage
				message.author.dmChannel.send(`--------------------------------------------------\n**Name: ${namelist}**\n\nDescription: ${desclist}\n\nSubcommands: ${sublist}\n\nUsage: ${usagelist}`)
			})
		})
	})
}

exports.help = {
	name: 'help',
	description: 'DM\'s you this list of commands.',
	subcommands: 'none',
	usage: './help'
}