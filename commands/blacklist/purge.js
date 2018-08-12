exports.run = async (client, message, args, Discord, thisServerID, fetchBList, blacklisted, reasonForBList, checkBList, blacklister) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) return
    const filter = m => m.author.id === message.author.id
    message.channel.send(`**__WARNING!!!__**\nThis command will perform a whole server members' inspection and will ban every single user that is currently blacklisted from joining DCCI servers. Are you sure you want to perform this action? (Type in \`PURGE\` in capital letters to continue.)`)
    .then(() => {
        message.channel.awaitMessages(filter, {
            max: 1,
            time: 40000,
            errors: ['time']
        })
        .then(collected => {
            if (collected.first().content === 'PURGE'){
                message.guild.members.forEach(async m => {
                    let id = m.id
                    let isInDatab = await Blacklist.findOne({
                        where: {
                            userID: id
                        }
                    })
                    if (isInDatab && m.bannable === true) m.ban(`Banned due to ID match in a blacklist. Purge command performed by ${message.author.tag}.`)
                })
                return message.reply('Purge completed succesfully! You have no more blacklisted members anymore!')
            }
            else message.channel.send('Purge has been canceled.')
        })
        .catch(() => {
            message.channel.send('No messages received. Cancelling the purge.')
        })
    })
}