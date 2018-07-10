exports.run = (client, message, args) => {
  if (message.author.id !== client.config.botOwnerID) return;
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
				message.channel.send(clean(evaled), {code:"xl"});
				}
			} 
			catch (err) {
				message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
			}
}

exports.help = {
  name: 'eval',
  description: 'Evaluates a code. Only for a bot developer.',
  subcommands: 'none',
  usage: './eval <code>'
}