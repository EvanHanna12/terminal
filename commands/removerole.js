const fs = require("fs");
const Discord = require("discord.js")
module.exports.run = async (bot, message, args) => {
  if (args.includes("@everyone")) return message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + 'Error.');
  if (!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("/" + message.guild + "/" + message.channel.name + "/" + "You do not have sufficient permissions to remove a role from someone.");
  if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + " I do not have sufficient permissions to manage roles.");
  let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!rMember) return message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + " Couldn't find that user");
  let role = args.join(" ").slice(22);
  if(!role) return message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + " Please supply a role");
  let gRole = message.guild.roles.find(`name`, role);
  if(!gRole) return message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + " That role doesn't exist, if it does exist: check your spelling");

  if(!rMember.roles.has(gRole.id)) return message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + ` That person hasn't got that role.`);
  await(rMember.removeRole(gRole.id));

  try{
    await message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + ` Removed ${rMember} from ${gRole.name}.`)
    let logs = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
    if (!logs[message.guild.id]) { 
      logs[message.guild.id] = {
        toggle: 0
      };
    } 
    if (logs[message.guild.id].toggle === 1) {
      const logchannel = message.guild.channels.find(channel => channel.name === "terminal-logs");
      let eventembed = new Discord.RichEmbed()
      .setColor(0xff0000)
      .setTitle("Remove Role Event:")
      .addField("User:", rMember)
      .addField("Admin:", message.author)
      .addField("Role:", gRole)
      .setTimestamp()
   logchannel.send(eventembed);
    }
  }catch(e){
  }
}
module.exports.help = {
    name: "removerole"
}