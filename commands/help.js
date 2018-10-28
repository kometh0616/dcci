const fs = require('fs')
exports.run = async (client, message, args) => {
	let namelist = ""
	let desclist = ""
	let helplist = []
  if (!args[0]){
    fs.readdir("./commands/", (err, files) => {
 	  	if (err) return console.error(err)
 	  	let jsfiles = files.filter(f => f.split(".").pop() === "js")
			if (jsfiles.length <= 0) return console.log("No commands to load")
 	  	jsfiles.forEach((f, i) => { 
 	  		let props = require(`./${f}`)
        if (props.help){
					namelist = props.help.name
  				desclist = props.help.description
					helplist.push(`**${namelist}** - ${desclist}`)
        }
 	  	})
		})
		try {
			const dmChannel = await message.author.createDM()
			await dmChannel.send(helplist, { split: true })
			await message.reply('sent you a list of my commands!')
		} catch (e) {
			console.error(e)
			await message.reply('there was an issue trying to send you a list of my commands. Please try again!')
		}
  }
   if (args[0]) {
     let command = client.commands.get(args[0]) || client.commands.find(c => c.help.name && c.help.name.includes(args[0]))
     if (!command) return message.channel.send(`That is not a valid command!`)
     let precise = []
     precise.push(`**Name: **${command.help.name}`)
     if (command.help.description) precise.push(`**Description:** ${command.help.description}`)
     if (command.help.subcommands) precise.push(`**Subcommands:** ${command.help.subcommands}`)
     if (command.help.usage) precise.push(`**Usage:** ${command.help.usage}`)
     await message.channel.send(precise, {split: true})
   }
}
 exports.help = {
 	name: 'help',
 	description: 'DM\'s you this list of commands.',
 	subcommands: 'none',
 	usage: '>help'
 }