exports.run = (client, message, args) => {
  var workbook = client.xlsx.readFile('./test.xlsx')
  if (workbook) return message.channel.send('Read the file...')
}