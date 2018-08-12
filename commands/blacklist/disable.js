exports.run = async (client, message, args, Discord, thisServerID, fetchBList, blacklisted, reasonForBList, checkBList, blacklister) => {
    if (!message.member.hasPermission('ADMINISTRATOR', false, true, true)) return
    if (!fetchBList){
        return message.reply(`DCCI blacklist is already disabled!`)
    }
    else if (fetchBList){
        if (fetchBList.get('switch') === false){
            return message.reply(`DCCI blacklist is already disabled!`)
        }
        let disableList = await DCCIBans.update({
            switch: false,
        },
        {
        where: {
            guildID: thisServerID
        }})
        message.reply(`DCCI blacklist has been disabled for this server!`)
    }
}