module.exports = (sequelize, DataTypes) => {
    return Newschannels = sequelize.define('newschannels', {
        serverID: DataTypes.STRING,
        channelID: DataTypes.STRING,
    })
}