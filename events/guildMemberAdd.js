module.exports = async (client, member) => {
	let joinedID = member.id;
	let thisServerID = member.guild.id;
	var newlist = await client.blacklist.update()
	var dBansLookup = newlist.lookup(joinedID)
	let fetchDBansAutoban = await DBans.findOne({
		where: {
			guildID: thisServerID,
			autoBan: true,
		}
	})
	let fetchDBansVerification = await DBans.findOne({
		where: {
			guildID: thisServerID,
			verification: true
		}
	})
	if (fetchDBansAutoban){
		if (dBansLookup){
			return member.ban('This user is in a DBans blacklist.')
		}
	}
	else if (fetchDBansVerification){
		if (dBansLookup){
			member.addRole(fetchDBansVerification.get('verifyRole'))
			member.guild.channels.get(fetchDBansVerification.get('verifyChannel')).send(`${member}, welcome to the **${member.guild.name}**!\nYou are in this channel, because you are DBanned and in need to be manually verified. Please mention a staff member, so that they could get you through a verification procedure.`)
		}
	}
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