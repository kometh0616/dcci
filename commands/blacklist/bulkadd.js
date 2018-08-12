exports.run = async (client, message, args, Discord, thisServerID, fetchBList, blacklisted, reasonForBList, checkBList, blacklister) => {
    if (!args[1]) return message.reply('no ID defined!')
    if (!checkBList){
        return message.reply(`this user is not blacklisted!`)
    }
    else if (checkBList){
        let getReason = checkBList.get('reason') || "none"
        client.fetchUser(checkBList.get('userID')).then(user => {
          message.channel.send({embed:{
              color: message.member.displayColor,
              author: {
                  name: message.author.tag,
                  icon_url: message.author.avatarURL
              },
              title: "Information on blacklisted ID",
              fields:[{
                  name: "Blacklisted user:",
                  value: `<@${checkBList.get('userID')}>\n${user.tag}`
              },
              {
                  name: "ID:",
                  value: `${checkBList.get('userID')}`
              },
              {
                  name: "Blacklisted by:",
                  value: `${checkBList.get('author')}`
              },
              {
                  name: "Reason:",
                  value: `${getReason}`
              }],
              timestamp: new Date(),
              footer: {
                  icon_url: client.user.avatarURL,
                  text: "© DCCI Bot"
              }
          }})
  }).catch(err => {
    console.log(err)
    message.reply('an error has occured. Chances are the blacklisted user you\'ve declared is not in Discord anymore. If that is not the case, please contact a developer.')
  })
    }
}