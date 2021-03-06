module.exports = async (client) => {
  const date = new Date()
  const logChannel = client.channels.get(client.config.logChannelID)
  await client.user.setPresence({
		game: {
			type: 'WATCHING',
			name: 'over DCCI | Do >help!'
		},
		status: 'online'
	})
  const hourParse = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : `${date.getUTCHours()}`
  const timeParse = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : `${date.getUTCMinutes()}`
  await logChannel.send(`Logged in as ${client.user.tag} at ${hourParse}:${timeParse} UTC`)
}