module.exports = async (client, member) => {
	let joinedID = member.id;
	let thisServerID = member.guild.id;
	let fetchDCCISettingTrue = await DCCIBans.findOne({
		where: {
			guildID: thisServerID,
			switch: true,
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
	else return;
	}
}