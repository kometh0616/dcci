exports.run = async (client, message, args) => {
  const param = args[0]
  if (!param) return
  const id = args[1]
  if (!id) return
  if (!client.guilds.get(id)) return message.reply('no guild found with defined ID.')
  if (message.author.id !== client.guilds.get(id).ownerID || !client.guilds.get("320659280686743602").members.get(message.author.id).hasPermission('ADMINISTRATOR')) return
  const newData = args.slice(2).join(' ')
  if (!newData) return
  const foundServer = await DCCIServers.findOne({where: {guildID: id}}) || await DCCISatellite.findOne({where: {guildID: id}})
  if (param === 'link') {
    await foundServer.update({
      link: newData
    },
    {
      where: {
        guildID: id
      }
    })
    await message.reply(`\`${client.guilds.get(id).name}\` server link succesfully updated to ${newData}!`)
  }
  else if (param === 'description') {
    await foundServer.update({
      description: newData
    },
    {
      where: {
        guildID: id
      }
    })
    await message.reply(`\`${client.guilds.get(id).name}\` description succesfully updated!`)
  }
  else if (param === 'portal') {
    await foundServer.update({
      portalChannel: newData
    },
    {
      where: {
        guildID: id
      }
    })
    await message.reply(`\`${client.guilds.get(id).name}\` portal channel sucessfully updated to <#${newData}>!`)
  }
  else if (param === 'name') {
    await foundServer.update({
      name: newData
    },
    {
      where: {
        guildID: id
      }
    })
    await message.reply(`\`${client.guilds.get(id).name}\` name succesfully updated to ${newData}!`)
  }
  else if (!['portal', 'link', 'description', 'name'].includes(param)) return message.reply(`I do not recognize parameter \`${param}\``)
}

exports.help = {
  name: 'editinfo',
  description: 'Edits information of a DCCI server. Only for server owners and DCCI admins.',
  subcommands: ['portal', 'name', 'description', 'link'].join(', '),
  usage: '>editinfo <subcommand> <server ID> <new data>'
}