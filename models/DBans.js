module.exports = (sequelize, DataTypes) => {
    return DBans = sequelize.define('dbans', {
		guildID: DataTypes.STRING,
		autoBan: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		verification: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		verifyRole: DataTypes.STRING,
		verifyChannel: DataTypes.STRING,
    })
}