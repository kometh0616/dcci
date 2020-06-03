const { RichEmbed } = require('discord.js')
exports.run = async (client, message, args) => {
  if (!client.guilds.get("320659280686743602").members.get(message.author.id).hasPermission('ADMINISTRATOR')) return
  const filter = m => m.author.id === message.author.id
  let serverID
  let serverName
  let serverDesc
  let serverLink
  const logChannel = client.channels.get(client.config.logChannelID)
  const greenEmoji = client.emojis.get(client.config.greenEmojiID)
  const greyEmoji = client.emojis.get(client.config.greyEmojiID)
  try {
    const dmChannel = await message.author.createDM()
    await message.reply('go to private messages, where you\'ll receive a prompt in which you\'ll be able to set a new satellite server up!')
    await dmChannel.send('Welcome to the DCCI server adding prompt! Here, servers can be added to DCCI database! Note that before you want to add a server, their staff must invite me to their server in order for this procedure to go succesfully! You\'ll have 30 seconds to answer each question. So, let\'s begin!\n\n**(IMPORTANT!!!)** What is the ID of a server you want to add?')
    let collected = await dmChannel.awaitMessages(filter, {
      time: 30000,
      max: 1,
      errors: ['time']
    })
    serverID = collected.first().content
    const persists = await DCCIServers.findOne({where: {guildID: serverID}}) || await DCCISatellite.findOne({where: {guildID: serverID}})
    if (persists) return dmChannel.send('This server already exists in a database! Exiting the prompt.')
    serverName = client.guilds.get(serverID).name
    await dmChannel.send(`The ID of the server is: \`${serverID}\`.\nOk, got this one.\nWhat is the description of the server you want to add?`)
    collected = await dmChannel.awaitMessages(filter, {
      time: 30000,
      max: 1,
      errors: ['time']
    })
    serverDesc = collected.first().content
    await dmChannel.send('What is the pernament invite link to a server you want to add?')
    collected = await dmChannel.awaitMessages(filter, {
      time: 30000,
      max: 1,
      errors: ['time']
    })
    serverLink = collected.first().content
    let embed = new RichEmbed()
    .setTitle('Is this information correct? (yes/no)')
    .addField('Server ID:', serverID)
    .addField('Server name:', serverName)
    .addField('Server description:', serverDesc)
    .addField('Server link:', serverLink)
    .addField('Server type:', 'Mainstream')
    .setColor(38000)
    .setTimestamp()
    .setFooter(client.config.copymark, client.user.avatarURL)
    await dmChannel.send({embed})
    collected = await dmChannel.awaitMessages(filter, {
      time: 30000,
      max: 1,
      errors: ['time']
    })
    if (['y', 'Yes', 'yes', 'Y'].includes(collected.first().content)) {
      let botAutoRole = client.guilds.get(serverID).me.roles.find(h => h.name === 'DCCI')
      const createdChannel = await client.guilds.get(serverID).createChannel('dcci-portal', 'text', [{
        id: botAutoRole.id,
        allow: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS']
      },
      {
        id: serverID,
        deny: ['SEND_MESSAGES']
      }])
      await DCCIServers.create({
        guildID: serverID,
        name: serverName,
        description: serverDesc,
        portalChannel: createdChannel.id,
        link: serverLink,
      })
      const model = await DCCIServers.findAll({
        attributes: ['guildID'],
        order: client.sequelize.col('createdAt')
      })
      const allMainIDs = Array.from(model.map(h => h.guildID))
      const allManualIDs = Array.from(await ManualPortal.findAll({attributes: ['guildID']}).map(h => h.guildID))
      const invData = await client.fetchInvite(serverLink)
      try {
        allMainIDs.forEach(async guildID => {
          if (guildID === serverID) return
          let browseDatab = await DCCIServers.findOne({where: {guildID: guildID}})
          let portal = client.channels.get(browseDatab.get('portalChannel'))
          let embed = new RichEmbed()
          .addField(`Link to the server:`, `${serverLink}\n${greenEmoji} ${invData.presenceCount} online ${greyEmoji} ${invData.memberCount} members`)
          .setAuthor(serverName, client.guilds.get(serverID).iconURL)
          .setColor(portal.guild.me.displayColor)
          .setDescription(serverDesc)
          .setThumbnail(client.guilds.get(serverID).iconURL)
          let msg = await portal.send({embed})
          await Embeds.create({
            portalID: portal.id,
            guildID: serverID,
            messageID: msg.id
          })
        })
      } finally {
        try {
          allMainIDs.forEach(async guildID => {
            let browseDatab = await DCCIServers.findOne({where: {guildID: guildID}})
            let inv = await client.fetchInvite(browseDatab.get('link'))
            let embed = new RichEmbed()
            .addField(`Link to the server:`, `${browseDatab.get('link')}\n${greenEmoji} ${inv.presenceCount} online ${greyEmoji} ${inv.memberCount} members`)
            .setAuthor(browseDatab.get('name'), client.guilds.get(browseDatab.get('guildID')).iconURL)
            .setColor(createdChannel.guild.me.displayColor)
            .setDescription(browseDatab.get('description'))
            .setThumbnail(client.guilds.get(browseDatab.get('guildID')).iconURL)
            let msg = await createdChannel.send({embed})
            await Embeds.create({
              portalID: createdChannel.id,
              guildID: browseDatab.get('guildID'),
              messageID: msg.id
            })
          })
        } finally {
          try {
            allManualIDs.forEach(async guildID => {
              let browseDatab = await ManualPortal.findOne({where: {guildID: guildID}})
              let portal = client.channels.get(browseDatab.get('channelID'))
              let embed = new RichEmbed()
              .addField(`Link to the server:`, `${serverLink}\n${greenEmoji} ${invData.presenceCount} online ${greyEmoji} ${invData.memberCount} members`)
              .setAuthor(serverName, client.guilds.get(serverID).iconURL)
              .setColor(portal.guild.me.displayColor)
              .setDescription(serverDesc)
              .setThumbnail(client.guilds.get(serverID).iconURL)
              let msg = await portal.send({embed})
              await Embeds.create({
                portalID: portal.id,
                guildID: serverID,
                messageID: msg.id
              })
            })
          } finally {
            let embed = new RichEmbed()
            .setColor(logChannel.guild.me.displayColor)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle('New server added to the database!')
            .addField('Action performed by:', message.author.tag)
            .addField('Server ID:', serverID)
            .addField('Server name:', serverName)
            .addField('Server link:', serverLink)
            .addField('Server type:', 'Mainstream')
            .setTimestamp()
            .setFooter(client.config.copymark, client.user.avatarURL)
            await logChannel.send({embed})
            await dmChannel.send('Server succesfully added! You can leave this DM now!')
          }
        }
      }
    }
    else
      return dmChannel.send('Exiting the prompt. Try again by triggering `>addserver` command in a guild I am in.\nIf issues with data perception persist, contact the developer of this bot.')
  } catch (e) {
    console.error(e)
    const dmChannel = client.channels.get(message.author.dmChannel.id)
    if (dmChannel)
    if (e.toString() === '[object Map]') return dmChannel.send('Exited the prompt due to no message received by elapsed time.')
    else return dmChannel.send('There was an issue trying to add the server. Please try again.\nIf the issues persist, contact the developer.')
    else return message.channel.send('Something went wrong with initiating the command. Have you enabled DM\'s in this server?')
  }
}

exports.help = {
  name: 'addserver',
  description: 'Adds a server to the database. Can only be ran by DCCI admins.',
  subcommands: 'none',
  usage: '>addserver'
}
