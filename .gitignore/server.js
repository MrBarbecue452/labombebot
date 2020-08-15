  const {Collection, Client} = require("discord.js"),
      client = new Client(),
      {readdir} = require("fs"),
      path = require('path'),
      queue = new Map(),
      express = require("express"),
      app = express(),
      config = require("./config.json");

client.config = config;
client.commands = new Collection();

app.get("/", (request, response) => {
  console.log("Ping reçu !");
  response.sendStatus(200);
});  

// listen for requests :)
const listener = app.listen(client.config.port, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
const http = require('https');
setInterval(() => {
http.get("https://labombe.glitch.me/")
}, 55 * 1000)

readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

readdir("./commands/", (err, content) => {
  if(err) console.log(err);
  if(content.length < 1) return console.log('Veuillez créer des dossiers dans le dossier commands !');
  var groups = [];
  content.forEach(element => {
      if(!element.includes('.')) groups.push(element);
  });
  groups.forEach(folder => {
      readdir("./commands/"+folder, (e, files) => {
          let js_files = files.filter(f => f.split(".").pop() === "js");
          if(js_files.length < 1) return console.log('Veuillez créer des fichiers dans le dossier "'+folder+'" !');
          if(e) console.log(e);
          js_files.forEach(element => {
              let props = require('./commands/'+folder+'/'+element);
              client.commands.set(element.split('.')[0], props);
          });
      });
  });
});
client.on('ready', function() {
      setInterval(async () => {
    const statuslist = [
      `l.help | ${client.users.size} utilisateurs !`,
      `l.help | ${client.guilds.size} serveurs !`
];
    const random = Math.floor(Math.random() * statuslist.length);

    try {
      await client.user.setPresence({
        game: {
          name: `${statuslist[random]}`,
          type: "STREAMING",
          url:  "https://twitch.tv/lucas14700"
       }
      });
      client.user.setStatus("online")
    } catch (error) {
      console.error(error);
    }
  }, 30000);  
});

client.on("ready",()=>{
    console.log(`Connecté en tant que ${client.user.tag}!`);
});
 client.login("NjI3NDYzMjU4NzE4MzM5MDky.XvcZWw.Y1f_Z58JyiO4iTOHSioGHD79mYk")
