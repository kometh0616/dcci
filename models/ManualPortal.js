module.exports = (sequelize, DataTypes) => {
  return ManualPortal = sequelize.define('manualportals', {
    guildID: DataTypes.STRING,
    channelID: DataTypes.STRING
  })
}
