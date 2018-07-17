const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const Sequelize = require('sequelize')
const { Blacklist } = require('discordblacklist')
const XLSX = require('xlsx')

const blacklist = new Blacklist(config.apiToken)

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    operatorsAliases: false,
    storage: 'database.sqlite',
});

const xlsx = new XLSX()

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.config = config;
client.blacklist = blacklist;

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
	files.forEach(file => {
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0]
		client.on(eventName, event.bind(null, client, xlsx))
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
