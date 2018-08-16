const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const Discord = require('discord.js');
const config = require('./config.json');
config.apiToken = process.env.APITOKEN
const fs = require('fs');
const Sequelize = require('sequelize')

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    operatorsAliases: false,
    storage: 'database.sqlite',
});

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.blacklistSubcommands = new Discord.Collection()
client.config = config;


fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
	files.forEach(file => {
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0]
		client.on(eventName, event.bind(null, client))
	})
})

fs.readdir("./commands/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith(".js")) return;
		let props = require(`./commands/${file}`)
		let commandName = file.split(".")[0]
		console.log(`Attempting to load command ${commandName}`)
		client.commands.set(commandName, props)
	})
})

fs.readdir('./commands/blacklist/', (err, files) => {
	if (err) return console.error(err)
	files.forEach(file => {
		let props = require(`./commands/blacklist/${file}`)
		let subName = file.split('.')[0]
		console.log(`Attempting to load subcommand ${subName} for command blacklist`)
		client.blacklistSubcommands.set(subName, props)
	})
})

fs.readdir("./models/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith(".js")) return;
		let modelName = file.split('.')[0]
		let model = sequelize.import(`./models/${modelName}`)
		console.log(`Attempting to sync model ${modelName}`)
		model.sync()
	})
})


client.login(process.env.TOKEN)
