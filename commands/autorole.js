const fs = require("fs");
const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {

	if (args.includes("@everyone"))
		return message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + ' **Error**');

	if (args.includes("@here"))
		return message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + ' **Error** ');

	if (!message.member.hasPermission("MANAGE_ROLES"))
		return message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + "You do not have sufficient permissions to add an autorole.");

	if (!message.guild.me.hasPermission("MANAGE_ROLES"))
		return message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + " I do not have sufficient permissions to manage roles.");

	let autorole = JSON.parse(fs.readFileSync("./autorole.json", "utf8"));

	if (!args[0]) {
		autorole[message.guild.id] = {
			role: 0
		};
		fs.writeFile("./autorole.json", JSON.stringify(autorole), (err) => {
			if (err) console.log(err);
		});
		message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + "The server autorole has been turned off.");
	}

	if (args[0]) {
		let roles = args.join(" ");
		let role = message.guild.roles.find("name", roles);
		autorole[message.guild.id] = {
			role: role.id
		};
		fs.writeFile("./autorole.json", JSON.stringify(autorole), (err) => {
			if (err) console.log(err)
		});
		message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + `The server autorole has been set to **${role.name}**`);
		let logs = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
		if (!logs[message.guild.id]) {
			logs[message.guild.id] = {
				toggle: 0
			};
		}
		if (logs[message.guild.id].toggle === 1) {
			const logchannel = message.guild.channels.find(channel => channel.name === "terminal-logs");
			let eventembed = new Discord.RichEmbed()
				.setColor(0x00ff00)
				.setTitle("Role Event:")
				.addField("Auto Role:", role)
				.addField("Admin:", message.author)
				.setTimestamp()
			logchannel.send(eventembed);
		}
	}
}
module.exports.help = {
	name: "autorole"
}
