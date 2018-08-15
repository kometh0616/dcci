module.exports = (sequelize, DataTypes) => {
    return DBans = sequelize.define('dbans_update', {
        guildID: DataTypes.STRING,
        autoban: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        verification: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        roleID: DataTypes.STRING,
        channelID: DataTypes.STRING
    })
}
