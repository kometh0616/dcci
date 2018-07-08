exports.run = async (client, message, args) => {
  let logChannel = client.channels.get(client.config.logChannelID)
  let serverID = args[0]
  if (!serverID){
    return message.reply("you need to define server ID by which I can find a server in a database!")
  }
  let foundServer = await DCCIServers.findOne({
    where: {
      guildID: serverID,
    }
  })
  if (!foundServer){
    return message.reply("this server ID is not in a DCCI database!")
  }
  else if (foundServer){
    logChannel.send({embed: {
      color: message.guild.members.get(message.author.id).displayColor,
      author: {
        name: message.author.username,
        icon_url: message.author.avatarURL
      },
      title: "Server removed from database!",
      fields: [{
        name: "Action performed by:",
        value: `${message.author.tag}`
      },
      {
        name: "Server ID:",
        value: `${foundServer.get('guildID')}`
      },
      {
        name: "Server name:",
        value: `${foundServer.get('name')}`
      }],
      timestamp: new Date(),
      footer: {
        icon_url: client.user.avatarURL,
        text: "©️ DCCI Bot"
      },
    }}).then(() => {
      message.reply("server removed succesfully!")
    }).catch(error => {
      console.error(error)
    })
    let removeServer = await DCCIServers.destroy({
      where: {
        guildID: serverID,
      }
    })
  }
}

exports.help = {
  name: 'removeserver',
  description: 'Removes a server from a database. Can only be ran by DCCI admins.',
  subcommands: 'none',
  usage: './removeserver <serverID>'
}