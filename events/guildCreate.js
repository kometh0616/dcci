module.exports = (client, guild) => {
  if (guild.id in client.config.guilds === false) return guild.leave()
}