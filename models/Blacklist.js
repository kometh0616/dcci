module.exports = (sequelize, DataTypes) => {
	return Blacklist = sequelize.define('blacklist', {
		userID: DataTypes.STRING,
		reason: DataTypes.STRING,
		author: DataTypes.STRING,
	})
}