exports.run = async (client, message, args, Discord, thisServerID, fetchBList, blacklisted, reasonForBList, checkBList, blacklister) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) return
    const { RichEmbed } = require('discord.js')
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
                    var isInDatab = await Blacklist.findOne({
                        where: {
                            userID: id
                        }
                    })
                    if (isInDatab && m.bannable === true) m.ban(`Banned due to ID match in a blacklist. Purge command performed by ${message.author.tag}.`).then(async mem => {
                      let browse = await Logchannels.findOne({
                        where: {
                          guildID: thisServerID
                        }
                      })
                      if (!browse) return
                      let logChannel = message.guild.channels.get(browse.get('channelID'))
                      let embed = new RichEmbed()
                      .setColor(message.guild.members.get(client.user.id).displayColor)
                      .setAuthor(message.author.tag, message.author.avatarURL)
                      .setTitle('User purge-banned from this server!')
                      .addField('Purge action performed by: ', message.author.tag)
                      .addField('Banned user:', m.user.tag)
                      .addField('Banned user\'s ID:', m.user.id)
                      .addField('Reason for user\'s blacklisting:', isInDatab.get('reason'))
                      .setThumbnail(m.user.avatarURL)
                      .setFooter(client.config.copymark, client.user.avatarURL)
                      .setTimestamp()
                      logChannel.send({embed})
                    })
                })
                return message.reply('Purge completed succesfully! You have no blacklisted members anymore!')
            }
            else message.channel.send('Purge has been canceled.')
        })
        .catch(() => {
            message.channel.send('No messages received. Cancelling the purge.')
        })
    })
}