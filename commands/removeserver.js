exports.run = async (client, message, args) => {
  if (!client.guilds.get("320659280686743602").members.get(message.author.id).hasPermission('ADMINISTRATOR')
     && !client.guilds.get("452631886691434496").members.get(message.author.id).hasPermission('ADMINISTRATOR')) return
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
  let foundSatellite = await DCCISatellite.findOne({
    where: {
      guildID: serverID,
    }
  })
  if (!foundServer && !foundSatellite) {
    return message.reply("this server ID is not in a DCCI database!")
  }
	else {
		try {
			let type = foundServer ? "Mainstream" : "Satellite"
			let model = foundServer ? foundServer : foundSatellite
			await model.destroy({
				where: {
					guildID: serverID,
				}
			})
			let ids = await Embeds.findAll({ attributes: ['portalID'] })
			let portals = ids.map(x => x.portalID)
			portals.forEach(async id => {
				if (id === serverID) return
				let emb = await Embeds.findOne({
					where: {
						portalID: id,
						guildID: serverID
					}
				})
				let m = await client.channels.get(id).fetchMessage(emb.get('messageID'))
				let deleted = await m.delete()
				await Embeds.destroy({ where: { guildID: serverID, messageID: deleted.id } })
			})
			await client.channels.get(model.get('portalChannel')).delete()
			await message.reply("server removed succesfully!")
			await logChannel.send({
				embed: {
					color: client.guilds.get("320659280686743602").members.get(client.user.id).displayColor,
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
						value: `${model.get('guildID')}`
					},
					{
						name: "Server name:",
						value: `${model.get('name')}`
					},
					{
						name: "Server type:",
						value: type
					}],
					timestamp: new Date(),
					footer: {
						icon_url: client.user.avatarURL,
						text: "©️ DCCI Bot"
					},
				}
			})
		} catch (e) {
			console.error(e)
			await message.reply('there was an issue trying to remove a server. Please try again.')
		}
  }
}


exports.help = {
  name: 'removeserver',
  description: 'Removes a server from a database. Can only be ran by DCCI admins.',
  subcommands: 'none',
  usage: '?removeserver <serverID>'
}
