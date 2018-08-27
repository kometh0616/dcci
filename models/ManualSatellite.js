module.exports = (sequelize, DataTypes) => {
  return ManualSatellite = sequelize.define('manualsatellite', {
    guildID: DataTypes.STRING,
    channelID: DataTypes.STRING
  })
}
