module.exports = (sequelize, DataTypes) => {
  return DCCISatellite = sequelize.define('dccisat', {
    guildID: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    portalChannel: DataTypes.STRING,
    link: DataTypes.STRING,
  })
}
