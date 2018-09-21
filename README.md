**Hello!**

This is a DCCI bot. It is responsible for managing DCCI portal, broadcasting DCCI news, managing DCCI banlist, and much more!
Currently, bot is operated by:

● Kometh#8342

● Superninjaboss#1191

DCCI Satellite server can be found [here.](https://discord.gg/bYy6qW5)
Issues can be reported either via GitHub, or in our DM's.

config.json structure:
```
{
	"prefix": "",          // bot's prefix goes here
	"botOwnerID": "",      // ID of a person who maintains the bot. Needed for powerful commands.
	"logChannelID": "",    // channel, where main, cross-server actions are logged.
  "apiToken": "",        // DBANS API token.
	"copymark": "",        // Used in some embeds.
	"streamChannelID": ""  // A channel from which messages will be broadcasted to other channels.
}
```
If you are not hosting a bot in Glitch, you might need to add this line to config.json:
```
  "token": "",           // Discord login token. Make sure it's secure!
```
Then you'll need to remove this line in index.js:
```
config.apiToken = process.env.APITOKEN
```
And replace these lines in index.js:
```
- client.login(process.env.TOKEN)
+ client.login(config.token)
```