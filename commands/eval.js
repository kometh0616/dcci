exports.run = (client, message, args) => {
  if (message.author.id !== "209635318503047168") return;
  const argument = message.content.split(" ").slice(1);
	const clean = text => {
  	if (typeof(text) === "string")
    	return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  	else
   		return text;
		}
		if (message.author.id !== "209635318503047168") return;
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

exp