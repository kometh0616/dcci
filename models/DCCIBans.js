module.exports = (sequelize, DataTypes) => {
	return DCCIBans = sequelize.define('DCCIBans', {
		guildID: DataTypes.STRING,
		switch: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		}
	})
}