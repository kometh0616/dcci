module.exports = (sequelize, DataTypes) => {
	return DCCIServers = sequelize.define('DCCIServers', {
		guildID: DataTypes.STRING,
		name: DataTypes.STRING,
		description: DataTypes.TEXT,
		portalChannel: DataTypes.STRING,
		link: DataTypes.STRING,
	})
}
