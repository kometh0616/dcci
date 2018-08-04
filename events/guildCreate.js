module.exports = (client, guild) => {
  let servers = Array.from(client.config.guilds)
  if (servers.includes(guild.id) === false) return guild.leave()
}