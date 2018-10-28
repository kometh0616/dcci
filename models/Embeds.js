module.exports = (sequelize, DataTypes) => {
  return Embeds = sequelize.define('embeds', {
    portalID: DataTypes.STRING,
    guildID: DataTypes.STRING,
    messageID: DataTypes.STRING
  })
}