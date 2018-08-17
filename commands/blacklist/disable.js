exports.run = async (client, message, args, Discord, thisServerID, fetchBList, blacklisted, reasonForBList, checkBList, blacklister) => {
    const { RichEmbed } = require('discord.js')
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
        message.reply(`DCCI blacklist has been disabled for this server!`).then(async () => {
          let browse = await Logchannels.findOne({
            where: {
              guildID: message.guild.id
            }
          })
          if (!browse) return
          let logChannel = message.guild.channels.get(browse.get('channelID'))
          let embed = new RichEmbed()
          .setColor(message.guild.members.get(client.user.id).displayColor)
          .setAuthor(message.author.tag, message.author.avatarURL)
          .setTitle('Automatic banning of blacklisted users was disabled for this server!')
          .addField('Action performed by:', message.author.tag)
          .setFooter(client.config.copymark, client.user.avatarURL)
          .setTimestamp()
          logChannel.send({embed})
        })
    }
}
