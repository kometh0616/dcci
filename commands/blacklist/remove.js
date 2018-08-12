exports.run = async (client, message, args, Discord, thisServerID, fetchBList, blacklisted, reasonForBList, checkBList, blacklister) => {
    if (!client.guilds.get("320659280686743602").members.get(message.author.id).hasPermission('ADMINISTRATOR')) return
    if (!args[1]) return message.reply('no ID defined!')
    let removeFromBList = await Blacklist.destroy({
        where: {
            userID: blacklisted,
        }
    })
    if (!removeFromBList){
        return message.reply("this ID is not in a blacklist!")
    }
    message.reply("ID removed from blacklist succesfully!")
    client.channels.get(client.config.logChannelID).send({embed: {
        color: client.channels.get(client.config.logChannelID).guild.members.get(client.user.id).displayColor,
        author: {
            name: message.author.username,
            icon_url: message.author.avatarURL
        },
        title: "User ID removed from DCCI blacklist!",
        fields: [{
            name: "Action performed by:",
            value: blacklister
        },
        {
            name: "Removed ID:",
            value: blacklisted
        }],
        timestamp: new Date(),
        footer: {
            icon_url: client.user.avatarURL,
            text: client.config.copymark
        }
    }}).catch(err => {
        console.log('Error in remove subcommand!')
        console.error(err)
    })
}