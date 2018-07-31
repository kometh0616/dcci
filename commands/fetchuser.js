exports.run = (client, message, args) => {
	if (message.author.id !== client.config.botOwnerID) return
	const id = args[0]
	if (!id) return
	client.fetchUser(id).then(u => {
		switch (args[1]){
			case 'tag':
			return message.reply(`User's tag is \`${u.tag}\``)
			case 'avatar':
			if (!u.avatarURL) return message.reply('User has no avatar!')
			return message.reply({files: [u.avatarURL]})
			case 'creationtime':
			return message.reply(`User was created at \`${u.createdAt}\``)
			default:
			return message.reply('User fetched!')
		}
	}).catch(err => {
		console.error(err)
		return message.reply('No user fetched!')
	})
}