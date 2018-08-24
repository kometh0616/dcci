exports.run = async (client, message, args) => {
  if (!client.guilds.get("320659280686743602").members.get(message.author.id).hasPermission('ADMINISTRATOR')) return
	var allServers = await DCCIServers.findAll({
		attributes: ['guildID']
	})
  var allSatellites = await DCCISatellite.findAll({
    attributes: ['guildID']
  })
	var outerArray = Array.from(allServers.map(a => a.guildID))
	var innerArray = Array.from(allServers.map(a => a.guildID))
  var outerSat = Array.from(allSatellites.map(a => a.guildID))
  var innerSat = Array.from(allSatellites.map(a => a.guildID))
  try {
    outerArray.forEach(async serverID => {
      var browseDatab = await DCCIServers.findOne({
        where: {
          guildID: serverID,
        }
      })
      var eColor = client.guilds.get(serverID).members.get(client.user.id).displayColor
      var IDfromDatab = browseDatab.get('portalChannel')
      var portal = client.channels.get(IDfromDatab)
      portal.fetchMessages({limit: outerArray.length}).then(collection => collection.forEach(message => message.delete()))
      innerArray.forEach(async ofInfo => {
        let reBrowse = await DCCIServers.findOne({
          where: {
            guildID: ofInfo,
          }
        })
        await portal.send({embed: {
          color: eColor,
          author: {
            name: `${reBrowse.get('name')}`,
            icon_url: client.guilds.get(ofInfo).iconURL
          },
          description: `${reBrowse.get('description')}\n\nLink to the server:\n${reBrowse.get('link')}`,
        }})
      })
    })
  } catch (e) {
    console.log(e)
    return message.channel.send('Something went wrong. Incident is logged.')
  } finally {
    outerSat.forEach(async serverID => {
      var browseDatab = await DCCISatellite.findOne({
        where: {
          guildID: serverID,
        }
      })
      var eColor = client.guilds.get(serverID).members.get(client.user.id).displayColor
      var IDfromDatab = browseDatab.get('portalChannel')
      var portal = client.channels.get(IDfromDatab)
      portal.fetchMessages({limit: outerArray.length}).then(collection => collection.forEach(async message => await message.delete()))
      innerSat.forEach(async ofInfo => {
        let reBrowse = await DCCISatellite.findOne({
          where: {
            guildID: ofInfo,
          }
        })
        await portal.send({embed: {
          color: eColor,
          author: {
            name: `${reBrowse.get('name')}`,
            icon_url: client.guilds.get(ofInfo).iconURL
          },
          description: `${reBrowse.get('description')}\n\nLink to the server:\n${reBrowse.get('link')}`,
        }})
      })
    })
    return message.channel.send("Done!")
  }
}

exports.help = {
	name: 'update',
	description: 'Updates the server list in all of the DCCI servers. Usually needs to be ran after >addserver and >removeserver commands. Can only be ran by DCCI Admins.',
	subcommands: 'none',
	usage: '>update'
}