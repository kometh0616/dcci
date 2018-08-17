module.exports = (sequelize, DataTypes) => {
  return Logchannels = sequelize.define('logchannels', {
    guildID: DataTypes.STRING,
    channelID: DataTypes.STRING,
  })
}
