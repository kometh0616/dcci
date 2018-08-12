exports.run = async (client, message, args, Discord, thisServerID, fetchBList, blacklisted, reasonForBList, checkBList, blacklister) => {
    if (!message.member.hasPermission('ADMINISTRATOR', false, true, true)) return
    if (!fetchBList){
        fetchBList = await DCCIBans.create({
            guildID: thisServerID,
        })
    }
    if (fetchBList.get('switch') === true){
        return message.reply(`DCCI blacklist is already enabled!`)
    }
    else if (fetchBList.get('switch') === false){
        let enableBList = await DCCIBans.update({
            switch: true
        },
        {
        where:{
            guildID: thisServerID
        }})
        message.reply('DCCI blacklist has been enabled for this server!')
    }
}