module.exports = (client) => {
  client.user.setPresence({
		game: {
			type: 'WATCHING',
			name: 'over DCCI | Do ./help!'
		},
		status: 'online'
	})
}