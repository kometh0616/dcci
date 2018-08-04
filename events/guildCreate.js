module.exports = (client, guild) => {
  if (!client.config.guilds.find(g => g = guild.id) return guild.leave())
}