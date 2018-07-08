module.exports = (client, message) => {
	if (!message.content.startsWith(client.config.prefix) || message.author.bot || message.channel.type === "dm") return;
	const args = message.content.slice(client.config.prefix.length).split(/ +/)
	const command = args.shift().toLowerCase();
	const cmd = client.commands.get(command)
	if (!cmd) return
	cmd.run(client, message, args)
}
