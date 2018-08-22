module.exports = (sequelize, DataTypes) => {
  return Permits = sequelize.define('permits', {
    guildID: DataTypes.STRING
  })
}
