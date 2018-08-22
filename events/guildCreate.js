module.exports = async (client, guild) => {
  let server = await Permits.findOne({
    where: {
      guildID: guild.id
    }
  })
  if (!server) return guild.leave()
}