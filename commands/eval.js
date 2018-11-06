exports.run = (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) {
    const num = Math.floor(Math.random() * 100) + 1
    if (num > 10)
      return message.channel.send({
        files: ['https://cdn.discordapp.com/attachments/354515583464898572/469992679435010048/SOD_OFF.png']
      })
    else
      return message.channel.send({
        files: ['https://cdn.discordapp.com/attachments/354515583464898572/494189773615792129/SOD_OFF_Deep_Fried.png']
      })
  }
  const argument = message.content.split(" ").slice(1)
	const clean = text => {
  	if (typeof(text) === "string")
    	return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
  	else
   		return text
		}
		try {
			const code = argument.join(" ")
			let evaled = eval(code)
			if (typeof evaled !== "string"){
				evaled = require("util").inspect(evaled)
        message.react('✅').then(message.channel.send(clean(evaled), {code:"xl", split: true}))
				}
			} 
			catch (err) {
        message.react('❌').then(message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``))
			}
}