const discordblacklist = require('discordblacklist');
module.exports = async (client, member) => {
	const blacklist =  new discordblacklist(client.config.apiToken)
	let joinedID = member.id;
	let thisServerID = member.guild.id;
	let fetchDCCISettingTrue = await DCCIBans.findOne({
		where: {
			guildID: thisServerID,
			switch: true,
		}
	})
	let fetchDBansSettings = await DBans.findOne({
		where: {
			guildID: thisServerID,
		}
	})
	if (fetchDCCISettingTrue){
		let lookout = await Blacklist.findOne({
			where: {
				userID: joinedID,
			}
		})
		if (lookout){
			member.ban('This user is in a DCCI blacklist.').catch(console.error);
		}
	}
	if (fetchDBansSettings) {
		if (fetchDBansSettings.get('autoban') === true){
			blacklist.isBanned(joinedID).then(u => {
				if (u === true) member.ban('This user is DBanned.')
			})
		}
		else if (fetchDBansSettings.get('verification') === true) {
			blacklist.isBanned(joinedID).then(async u => {
				if (u === true) {
					let verificationRole = await member.guild.roles.get(fetchDBansSettings.get('roleID'))
					let verificationChannel = await member.guild.channels.get(fetchDBansSettings.get('channelID'))
					await member.addRole(verificationRole)
					await verificationChannel.send(`${member}, welcome to **${member.guild.name}!**\nYou are here, because you are DBanned and you need to be verified by server's staff members. Please mention them so that you could be noticed and get verified!`)
				}
			})
		}
	}
}
