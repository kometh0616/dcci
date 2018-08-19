exports.run = async (client, message, args, Discord, thisServerID, fetchBList, blacklisted, reasonForBList, checkBList, blacklister) => {
    if (!message.member.hasPermission('ADMINISTRATOR', false, true, true)) return
    const { RichEmbed } = require('discord.js')
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
        message.reply('DCCI blacklist has been enabled for this server!').then(async () => {
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
          .setTitle('Automatic banning of blacklisted users was enabled for this server!')
          .addField('Action performed by:', message.author.tag)
          .setFooter(client.config.copymark, client.user.avatarURL)
          .setTimestamp()
          logChannel.send({embed})
        })
    }
}
