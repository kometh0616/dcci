exports.run = async (client, message, args, Discord, thisServerID, fetchBList, blacklisted, reasonForBList, checkBList, blacklister) => {
    if (!client.guilds.get("320659280686743602").members.get(message.author.id).hasPermission('ADMINISTRATOR')) return
    if (!args[1]) return message.reply('no ID defined!')
    if (!client.fetchUser(blacklisted)) return message.reply('invalid ID!')
    if (checkBList){
        return message.reply(`that ID is already blacklisted!`)
    }
    client.fetchUser(blacklisted).then(async user => {
        await Blacklist.create({
            userID: blacklisted,
            tag: user.tag,
            reason: reasonForBList,
            author: blacklister,
        })
     client.channels.get(client.config.logChannelID).send({embed: {
          color: client.channels.get(client.config.logChannelID).guild.members.get(client.user.id).displayColor,
          author: {
              name: message.author.username,
              icon_url: message.author.avatarURL
          },
          title: "New user added to blacklist!",
          fields: [{
              name: "Action performed by:",
              value: blacklister
          },
        {
            name: "Blacklisted user:",
            value: `<@${blacklisted}>\n${user.tag}`
        },
          {
              name: "Blacklisted ID:",
              value: blacklisted
          },
          {
              name: "Reason for adding to blacklist:",
              value: reasonForBList
          }],
          timestamp: new Date(),
          footer: {
              icon_url: client.user.avatarURL,
              text: client.config.copymark
          }
      }}).catch(err => {
        console.log('Error in add subcommand!')
        console.error(err)
    })
      return message.reply('ID added to blacklist succesfully!')
    }).catch(err => {
        console.error(err)
        if (err.code === 10013){
            return message.reply('no user found with this ID!')
        }
    })
}