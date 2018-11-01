module.exports = async (client) => {
  const logChannel = client.channels.get(client.config.logChannelID)
  await client.user.setPresence({
		game: {
			type: 'WATCHING',
			name: 'over DCCI | Do >help!'
		},
		status: 'online'
	})
  await logChannel.send(`Logged in as ${client.user.tag} at `)
}