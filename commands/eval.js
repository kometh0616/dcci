exports.run = (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID){
    return message.channel.send({
      files: ['https://cdn.discordapp.com/attachments/354515583464898572/469992679435010048/SOD_OFF.png']
    }) 
  };
  const argument = message.content.split(" ").slice(1);
	const clean = text => {
  	if (typeof(text) === "string")
    	return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  	else
   		return text;
		}
		try {
			const code = argument.join(" ");
			let evaled = eval(code);
			if (typeof evaled !== "string"){
				evaled = require("util").inspect(evaled);
        message.react('✅').then(message.channel.send(clean(evaled), {code:"xl"});)
				}
			} 
			catch (err) {
        message.react(
				message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
			}
}