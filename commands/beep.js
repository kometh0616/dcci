exports.run = async (client, message, args) => {
  const serverID = '396799859900022784'
  const channelID = '482479119292956672'
  await DCCISatellite.update({
    portalChannel: channelID
  },
  {
    where: {
      guildID: serverID
    }  
  })
  await message.reply('Done!')
}