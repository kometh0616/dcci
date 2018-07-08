module.exports = (sequelize, DataTypes) => {
	return Pings = sequelize.define('pings', {
		guildID: DataTypes.STRING,
		amount: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		}
	})
}