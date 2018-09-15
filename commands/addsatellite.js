exports.run = async (client, message, args) => {
  if (!client.guilds.get("320659280686743602").members.get(message.author.id).hasPermission('ADMINISTRATOR')) return
  let serverID
  let serverName
  let serverDesc
  let serverLink
  const authorFilter = m => m.author.id === message.author.id
  var logChannel = client.channels.get(client.config.logChannelID)
  message.reply(`go to private messages, where you'll receive a prompt in which you'll be able to set a new satellite server up!`)
  message.author.createDM().then(() => {
    message.author.dmChannel.send("Welcome to the DCCI server adding prompt! Here, servers can be added to DCCI database! Note that before you want to add a server, their staff must invite me to their server in order for this procedure to go succesfully! You'll have 30 seconds to answer each question. So, let's begin!\n\n**(IMPORTANT!!!)** What is the ID of a server you want to add?")
    .then(() => {
      message.author.dmChannel.awaitMessages(authorFilter, {
        max: 1,
        time: 30000,
        errors: ['time']
      })
      .then(async (collected) => {
        serverID = collected.first().content;
        let peepIDs = await DCCIServers.findOne({
          where: {
            guildID: serverID,
          }
        })
        let peepSat = await DCCISatellite.findOne({
          where: {
            guildID: serverID,
          }
        })
        if (peepIDs || peepSat) {
          return message.author.dmChannel.send("This ID already exists in a database! Exiting the prompt.")
        }
        if (!client.guilds.get(serverID)){
          return message.author.dmChannel.send("I couldn't find that server. Exiting the prompt.")
        }
        serverName = client.guilds.get(serverID).name
        message.author.dmChannel.send(`The ID of this server is: \`${serverID}\`.\nOk, got this one.\nWhat is the description of the server you want to add?`)
        .then(() => {
          message.author.dmChannel.awaitMessages(authorFilter, {
            max: 1,
            time: 30000,
            errors: ['time']
          })
          .then((collected) => {
            serverDesc = collected.first().content;
            message.author.dmChannel.send("What is the pernament invite link to a server you want to add?")
            .then(() => {
              message.author.dmChannel.awaitMessages(authorFilter, {
                max: 1,
                time: 30000,
                errors: ['time']
              })
              .then((collected) => {
                serverLink = collected.first().content
                message.author.dmChannel.send({embed: {
                  color: 38000,
                  author: {
                    text: client.user.username,
                    icon_url: client.user.avatarURL
                  },
                  title: "Is this information correct? (yes/no)",
                  fields: [{
                    name: "Server ID:",
                    value: `${serverID}`
                  },
                  {
                    name: "Server name:",
                    value: `${serverName}`
                  },
                  {
                    name: "Server description:",
                    value: `${serverDesc}`
                  },
                  {
                    name: "Server link:",
                    value: `${serverLink}`
                  },
                  {
                    name: "Server type:",
                    value: "Satellite"
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: client.config.copymark
                }
                }})
              })
              .then(() => {
                message.author.dmChannel.awaitMessages(authorFilter, {
                  max: 1,
                  time: 30000,
                  errors: ['time']
                })
                .then(async (collected) => {
                  if (collected.first().content === "yes"){
                    logChannel.send({embed: {
                      color: message.guild.members.get(message.author.id).displayColor,
                      author: {
                        name: message.author.username,
                        icon_url: message.author.avatarURL
                      },
                      title: "New server added to database!",
                      fields:
                      [
                        {
                          name: "Action performed by:",
                          value: message.author.tag
                        },
                        {
                          name: "Server ID:",
                          value: serverID
                        },
                        {
                          name: "Server name:",
                          value: serverName
                        },
                        {
                          name: "Server link:",
                          value: serverLink
                        },
                        {
                          name: "Server type:",
                          value: "Satellite"
                        }
                      ],
                      timestamp: new Date(),
                      footer: {
                        icon_url: client.user.avatarURL,
                        text: client.config.copymark
                      }
                    }})
                    let botAutoRole = client.guilds.get(serverID).me.roles.find('name', 'DCCI')
                    client.guilds.get(serverID).createChannel('satellite-portal', 'text', [
                      {
                        id: botAutoRole.id,
                        allow: ['SEND_MESSAGES']
                      },
                      {
                        id: client.guilds.get(serverID).id,
                        deny: ['SEND_MESSAGES']
                      }
                    ])
                    .then(async (createdChannel) => {
                      DCCISatellite.create(
                        {
                          guildID: serverID,
                          name: serverName,
                          description: serverDesc,
                          portalChannel: createdChannel.id,
                          link: serverLink,
                      })
                      .then(() => {
                        client.guilds.get(serverID).createChannel('dcci-news', 'text', [
                          {
                            id: botAutoRole.id,
                            allow: ['SEND_MESSAGES', 'MANAGE_WEBHOOKS', 'EMBED_LINKS']
                          },
                          {
                            id: client.guilds.get(serverID).id,
                            deny: ['SEND_MESSAGES']
                          }
                        ]).then(async (createdChannel) => {
                          await Newschannels.create({
                            serverID: serverID,
                            channelID: createdChannel.id
                          })
                        })
                      })
                    })
                    return message.author.dmChannel.send("Server succesfully added! You can leave this DM now!")
                  }
                })
                  if (collected.first().content === "no"){
                    return message.author.dmChannel.send("Exiting the prompt. Try again by triggering `>addsatellite` command in a guild I am in.\nIf issues with data perception persist, contact the developer of this bot.")
                  }
                })
               .catch((error) => {
                console.error(error)
                 return message.author.dmChannel.send("Exited the prompt due to no message received by an elapsed time.")
               })
             })
             .catch((error) => {
               console.error(error)
               return message.author.dmChannel.send("Exited the prompt due to no message received by an elapsed time.")
             })
            .catch((error) => {
               console.error(error)
               return message.author.dmChannel.send("Exited the prompt due to no message received by an elapsed time.")
              })
            })
           .catch(error => {
             console.error(error)
             return message.author.dmChannel.send("Exited the prompt due to no message received by an elapsed time.")
           })
         })
         .catch((error) => {
           console.error(error)
           return message.author.dmChannel.send("Exited the prompt due to no message received by an elapsed time.")
          })
        })
       .catch(error => {
         console.error(error)
         return message.author.dmChannel.send("Exited the prompt due to no message received by an elapsed time.")
       })
     })
     .catch((error) => {
       console.error(error)
       return message.author.dmChannel.send("Exited the prompt due to no message received by an elapsed time.")
      })
    })
   .catch(error => {
     console.error(error)
     return message.author.dmChannel.send("Exited the prompt due to no message received by an elapsed time.")
   })
  }

exports.help = {
  name: 'addsatellite',
  description: 'Adds a satellite server to the database. Only for DCCI Admins.',
  subcommands: 'none',
  usage: '>addsatellite'
}
