module.exports = (client, guild) => {
  let servers = require('./guilds.json')
  if (!servers.find(guild.id)) return guild.leave()
}