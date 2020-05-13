const botconfig = require("./botconfig.json");

const Discord = require("discord.js");
const axios = require("axios");
//const si = require("systeminformation");

//si.wifiNetworks()
//	.then(data => console.log(data))

require("dotenv").config();

const bot = new Discord.Client({
  disableEveryone: true
});

const prefix = botconfig.prefix;

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  var a = true;
  aa();

  function aa() {
    if (a) bot.user.setActivity("ASMR HENTAI", {
      type: "LISTENING"
    });
    else bot.user.setActivity("HENTAI", {
      type: "WATCHING"
    });
    a = !a;
    setTimeout(() => aa(), 3600000);
  }
});

bot.on("voiceStateUpdate", data => {
  let guild = data.guild;
  let ch = guild.channels.cache.find(ch => (ch.parent == "689768487014760472" && !ch.members.find(mm => true)));
  if (ch != undefined)
    ch.delete();
})

bot.on("message", message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (!message.content.startsWith(prefix)) return;

  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let argsArray = messageArray.slice(1);
  let args = argsArray.join(" ");

  if (cmd.startsWith(prefix)) {
    cmd = cmd.substring(prefix.length, cmd.length).toLowerCase();

    // HELLO
    if (cmd == "hello") {
      message.channel.send("Ciao " + message.author + " \ud83d\udc4b"); //👋
    }
    // RIPETERE
    else if (cmd == "ripeti" || cmd == "say") {
      message.channel.send(args);
    }
    // CALCOLATORE MULTIFUNZIONE ULTRASVILUPPATO
    else if (cmd == "calc") {
      message.channel.send(calcola(argsArray));
    }
    // NICKSAY
    else if (cmd == "nicksay") {
      message.channel.send(argsArray[0] != undefined ? nicksay(argsArray[0]) : "Prova `//nicksay list`");
    } else if (cmd == "deletemsg") {
      console.log(message.channel.messages);
    }
    //UPTIME
    else if (cmd == "uptime") {
      message.channel.send(uptime());
    }
    // HELP
    else if (cmd == "help") {
      message.channel.send(help());
    }
    // DELETE
    else if (cmd == "delete") {
      console.log("non funziono");
      return;
      if (1) {
        message.delete();

        if (isNaN(args[0])) {
          message.channel.send("num!?");
          return;
        }

        console.log(args[0] + " message are deleting");
        console.log(message.channel.bulkDelete(args[0])
          .catch(errore => console.log("wtf")));
      }
    }
    // QUARANTENA
    else if (cmd == "quarantena") {
      if (message.member.voice.channelID == null) return message.channel.send("Devi essere in un canale vocale :)");;
      let nick = message.author.username;
      let guild = message.guild;
      let nomestanza = "Casa di " + nick;
      guild.channels.create(nomestanza, { type: 'voice', parent: '689768487014760472', userLimit: 1 }).then(() => {
        let ch = guild.channels.cache.find(ch => ch.name == nomestanza);
        message.member.voice.setChannel(ch);
      });
    }
    //NUM CHAMP
    else if (cmd == "numchamp") {
      message.channel.send("Numero totale di campioni su league of legends : " + champsList.length);
    }
    // RANDOM CHAMP
    else if (cmd == "randomchamp") {
      let random = Math.round(Math.random() * champsList.length);
      message.channel.send(champsList[random][1]);
    }
    // RANDOM PIC
    else if (cmd == "randompic") {
      axios
        .get(
          `https://wall.alphacoders.com/api2.0/get.php?auth=${process.env.WALLPAPER_API}&method=random&count=1&info_level=2`
        )
        .then(res => {
          let immagine = Object.values(res.data.wallpapers)[0];
          let img = immagine.url_image;
          let page = immagine.url_page;
          let category = immagine.category;
          let sub_category = immagine.sub_category;
          let thumb = immagine.url_thumb;
          message.channel
            .send(`***${category}*** - _${sub_category}_\n` + `<${page}>`, {
              files: [img]
            })
            .catch(() =>
              message.channel.send(
                `***${category}*** - _${sub_category}_` +
                `<${page}>` +
                `**L'immagine pesa più di 8MB, perciò non posso inviarla su discord :/**` +
                `_Ecco la thumbnail_`, {
                files: [thumb]
              }
              )
            );
        });
    }
    // SEARCH PIC
    else if (cmd == "searchpic") {
      let ricerca = args;
      let n, pag;
      if (ricerca.includes("-")) {
        n = ricerca.split("-")[1];
        ricerca = ricerca.substring(0, ricerca.length - n.length - 2);
      }
      n = +n || 1;
      pag = ((n / 30) % 1 == 0 ? ~~(n / 30 - 1) : ~~(n / 30)) + 1;
      n = (n % 30) - (n % 30 == 0 ? -29 : 1);
      for (; ricerca.includes(" "); ricerca = ricerca.replace(" ", "+"));
      let link = `https://wall.alphacoders.com/api2.0/get.php?auth=${process.env.WALLPAPER_API}&method=search&term=${ricerca}&info_level=2&page=${pag}`;
      axios
        .get(link)
        .then(res => {
          let immagine = Object.values(res.data.wallpapers)[n];
          let img = immagine.url_image;
          let page = immagine.url_page;
          let category = immagine.category;
          let sub_category = immagine.sub_category;
          let thumb = immagine.url_thumb;
          message.channel
            .send(`***${category}*** - _${sub_category}_\n` + `<${page}>`, {
              files: [img]
            })
            .catch(() =>
              message.channel.send(
                `***${category}*** - _${sub_category}_\n` +
                `<${page}>\n` +
                `**L'immagine pesa più di 8MB, perciò non posso inviarla su discord :/**\n` +
                `_Ecco la thumbnail_`, {
                files: [thumb]
              }
              )
            );
        })
        .catch(() => {
          message.channel.send("Immagine non trovata");
        });
    }
    // STATISTICHE LOL
    else if (cmd == "lolstats") {
      let apikey = "?api_key=" + process.env.LOL_API;

      let user = argsArray[0].replace("-", " ");
      user = encodeURI(user);

      let server =
        argsArray[1] && argsArray[2] ?
          botconfig.server.indexOf(
            argsArray[1].replace("-", "").toUpperCase()
          ) != -1 ?
            argsArray[1] :
            botconfig.server.indexOf(
              argsArray[2].replace("-", "").toUpperCase()
            ) != -1 ?
              argsArray[2] :
              "euw1" :
          argsArray[1] ?
            botconfig.server.indexOf(
              argsArray[1].replace("-", "").toUpperCase()
            ) != -1 ?
              argsArray[1] :
              "euw1" :
            "euw1";
      let linksummoner = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${user}${apikey}`,
        linkmastery,
        linklega,
        linkgames;

      let summoner,
        allcp,
        id,
        nome,
        lvl,
        pic,
        cpid,
        cpm,
        cppt,
        accid,
        puuid,
        solo = "",
        flex = "",
        tft = "",
        vinteF = 0,
        vinteS = 0,
        giocate = 0,
        wsf = true,
        wss = true;

      axios
        .get(linksummoner)
        .then(res => {
          summoner = res.data;

          nome = summoner.name;
          lvl = summoner.summonerLevel;
          id = summoner.id;
          accid = summoner.accountId;
          pic = summoner.profileIconId;
          puuid = summoner.puuid;
          if (argsArray.indexOf("-id") != -1) {
            if (
              message.author.id == "305052011664244736" ||
              message.author.id == "265921646903296000"
            )
              message.channel.send(
                "AccountID : " +
                accid +
                "\nSummonerID : " +
                id +
                "\nPUUID : " +
                puuid
              );
            else message.channel.send("YU CAN'T BR0");
          }

          linkmastery = `https://${server}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${id}${apikey}`;
          linklega = `https://${server}.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}${apikey}`;
          linkgames = `https://${server}.api.riotgames.com/lol/match/v4/matchlists/by-account/${accid}${apikey}`;
          linktft = `https://${server}.api.riotgames.com/tft/league/v1/entries/by-summoner/${id}${apikey}`;

          return axios.get(linkmastery);
        })
        .catch(erro => {
          message.channel.send(user + " 404!");
        })
        .then(res => {
          //maestrie
          allcp = res.data;

          cpid = allcp[0].championId;
          cpm = allcp[0].championLevel;
          cppt = allcp[0].championPoints;
          return axios.get(linklega);
        })
        .catch(() => {
          return axios.get(linklega);
        })
        .then(res => {
          //ranks
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].queueType == "RANKED_SOLO_5x5") solo = res.data[i];
            else if (res.data[i].queueType == "RANKED_FLEX_SR")
              flex = res.data[i];
          }
          return axios.get(linktft);
        })
        .catch(() => {
          return axios.get(linktft);
        })
        .then(res => {
          if (res.data[0].queueType == "RANKED_TFT") tft = res.data[0];

          return axios.get(linkgames);
        })
        .catch(() => {
          return axios.get(linkgames);
        })
        .then(res => {
          let partite = res.data.matches;
          return getGame(partite);
        });

      function getGame(games) {
        if (giocate < games.length) {
          let link = `https://${server}.api.riotgames.com/lol/match/v4/matches/${games[giocate].gameId}${apikey}`;

          var queue = games[giocate].queue;

          if ((wsf && queue == 440) || (wss && queue == 420)) {
            axios.get(link).then(res => {
              var game = res.data;
              var teamWin,
                team = "",
                pid;
              if (game.teams[0].win == "Win") teamWin = game.teams[0].teamId;
              else teamWin = game.teams[1].teamId;

              for (let i = 0; i < 10; i++) {
                if (nome == game.participantIdentities[i].player.summonerName) {
                  pid = game.participantIdentities[i].participantId;

                  for (let j = 0; j < 10 && team == ""; j++) {
                    if (game.participants[j].participantId == pid)
                      team = game.participants[j].teamId;
                  }
                }
              }
              giocate++;

              if (team == teamWin) {
                if (queue == 440) vinteF++;
                else if (queue == 420) vinteS++;

                getGame(games);
              } else {
                if (queue == 440) wsf = false;
                else wss = false;

                return getGame(games);
              }
            });
          } else {
            giocate++;
            return getGame(games);
          }
        } else {
          giocate++;
          if (giocate < 100) getGame(games);
          else return rispondi();
        }
      }

      function rispondi() {
        let campione;
        for (let i in champsList) {
          if (champsList[i][0] == cpid) {
            campione = champsList[i][1];
            i = champsList.length;
          }
        }
        let risposta = new Discord.MessageEmbed()
          .setTitle(nome)
          .setThumbnail(
            `http://ddragon.leagueoflegends.com/cdn/${lastvs.profileicon}/img/profileicon/${pic}.png`
          )
          .setColor(getRandomColor())
          .addField("LVL", lvl)
          .addField(
            "MAIN",
            campione + "\nMastery : " + cpm + "\nPoints : " + cppt
          );

        if (solo != "")
          risposta.addField(
            "SOLO",
            `${solo.tier} ${solo.rank} ( ${solo.leaguePoints} LP ) \n${
            solo.wins
            } W | ${solo.losses} L / ${solo.wins + solo.losses} (${Math.round(
              (solo.wins / (solo.wins + solo.losses)) * 100
            )}%) ${
            solo.miniSeries
              ? "\nPROMO : " +
              solo.miniSeries.wins +
              " W | " +
              solo.miniSeries.losses +
              " L / " +
              (solo.miniSeries.target == 3 ? 5 : 3)
              : ""
            }\nWinstreak : ${vinteS}`
          );

        if (flex != "")
          risposta.addField(
            "FLEX",
            `${flex.tier} ${flex.rank} ( ${flex.leaguePoints} LP ) \n${
            flex.wins
            } W | ${flex.losses} L / ${flex.wins + flex.losses} (${Math.round(
              (flex.wins / (flex.wins + flex.losses)) * 100
            )}%) ${
            flex.miniSeries
              ? "\nPROMO : " +
              flex.miniSeries.wins +
              " W | " +
              flex.miniSeries.losses +
              " L / " +
              (flex.miniSeries.target == 3 ? 5 : 3)
              : ""
            }\nWinstreak: ${vinteF}`
          );

        if (tft != "")
          risposta.addField(
            "TFT",
            `${tft.tier} ${tft.rank} ( ${tft.leaguePoints} LP ) \n${tft.wins} W | ${tft.losses} L`
          );

        message.channel.send(risposta);
      }
    }
    // CHAMP LOL
    else if (cmd == "lolchamp") {
      let nome = argsArray[0];
      nome = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
      nome = nome.replace("'", "");
      nome = nome == "Kogmaw" ? "KogMaw" : nome;
      nome = nome == "Missfortune" ? "MissFortune" : nome;
      let opzione = argsArray[1];
      let lingua = argsArray[2];

      let lastchmp = lastvs.champion;

      let lastchmplink = `http://ddragon.leagueoflegends.com/cdn/${lastchmp}/data/it_IT/champion/${nome}.json`;

      axios.get(lastchmplink).then(res => {
        let champinfo = Object.values(res.data.data)[0];
        message.channel
          .send(
            `***${nome}*** - _${champinfo.title.charAt(0).toUpperCase() +
            champinfo.title.slice(1)}_\n${champinfo.lore}`, {
            files: [`http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${champinfo.key}/${champinfo.key}000.jpg`]
          }
          )
          .then(() => fatto());

        function fatto() {
          if (opzione == "-s") {
            let nskins = champinfo.skins.length;
            if (lingua == "en") {
              axios
                .get(
                  `http://ddragon.leagueoflegends.com/cdn/${lastchmp}/data/en_US/champion/${nome}.json`
                )
                .then(res => {
                  champinfo = Object.values(res.data.data)[0];
                  for (let i = 1; i < nskins; i++) {
                    let name = champinfo.skins[i].name;
                    let id = champinfo.skins[i].id;
                    message.channel.send(`***${name}***`, {
                      files: [`http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${champinfo.key}/${id}.jpg`]
                    });
                  }
                });
            } else {
              for (let i = 1; i < nskins; i++) {
                let id = champinfo.skins[i].id;
                let name = champinfo.skins[i].name;
                message.channel.send(`***${name}***`, {
                  files: [`http://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/${champinfo.key}/${id}.jpg`]
                });
              }
            }
          }
        }
      });
    }
    // NEW PASTE
    else if (cmd == "newpaste") {
      let key = process.env.PASTEBIN_API;

      url = message.attachments.first().url;
      axios.get(url).then(res => {
        let code = encodeURIComponent(res.data);
        let params =
          "api_option=paste" +
          "&api_dev_key=" +
          key +
          "&api_paste_code=" +
          code;
        axios({
          method: "post",
          url: "https://pastebin.com/api/api_post.php",
          data: params
        }).then(res => {
          message.channel.send(`PASTEBIN LINK = <${res.data}>`);
        });
      });
    }
    //MY PIC
    else if (cmd == "mypic") {
      let url = message.author.avatarURL({format : "png", dynamic : true, size : 1024})
      message.channel.send("La tua foto di profilo è " + url)//,{files: [url]})
    }
    else if (cmd == "kick") {
      let ruoli = message.member.roles.array();
      let t = false;
      ruoli.forEach(r => {
        if (r.name == "OWNER") t = true;
      });
      if (t) {
        if (message.mentions.members.first().kickable) {
          message.mentions.members.first().kick();
          message.channel.send(message.mentions.members.first() + " cacciato");
        } else message.channel.send("I CAN'T");
        message.channel.send(message.member.highestRole);
      } else message.channel.send("YOU CAN'T");
      console.log(ruoli.forEach(r => console.log(r.name + " - " + r.id)));
    }
  }
});

function help() {
  let lista = new Discord.MessageEmbed()
    .setDescription("Lista comandi")
    .setColor(getRandomColor())
    .setThumbnail(bot.user.displayAvatarURL)
    .addField("Saluto", "//hello")
    .addField("Ripetere", "//say OR //ripeti")
    .addField("Aiuto", "//help")
    .addField("Nicksay", "//nicksay")
    .addField("Quarantena", "//quarantena")
    .addField("Statistiche LOL", "//lolstats [username] <server>")
    .addField("Campione LOL", "//lolchamp [champ] <-s> <en>")
    .addField("Campione Random", "//randomchamp")
    .addField("Numero Campioni", "//numchamp")
    .addField("Cerca Immagine", "//searchpic [argomenti] <-num>")
    .addField("Immagine Random", "//randompic")
    .addField("Crea paste su Pastebin", "//newpaste [file txt allegato]")
    .addField("Supercalcolatore interdimensionale", "//calc [n1] [operatore] [n2]")
    .addField("Tua Pic", "//mypic");
  return lista;
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function calcola(argsArray) {
  if (argsArray[1] == "+") {
    let result = parseFloat(argsArray[0], 10) + parseFloat(argsArray[2], 10);

    return result;
  } else if (argsArray[1] == "-") {
    let result = parseFloat(argsArray[0], 10) - parseFloat(argsArray[2], 10);

    return result;
  } else if (argsArray[1] == "*" || argsArray[1] == "InGaleraChiUsaLaX") {
    let result = parseFloat(argsArray[0], 10) * parseFloat(argsArray[2], 10);

    return result;
  } else if (argsArray[1] == "/") {
    let result = parseFloat(argsArray[0], 10) / parseFloat(argsArray[2], 10);

    return result;
  } else if (argsArray[1] == "%" || argsArray[1] == "mod") {
    let result = parseFloat(argsArray[0], 10) % parseFloat(argsArray[2], 10);

    return result;
  } else if (argsArray[1] == "^" || argsArray[1] == "pow") {
    let result = Math.pow(
      parseFloat(argsArray[0], 10),
      parseFloat(argsArray[2], 10)
    );

    return result;
  }
}

function nicksay(nick) {
  nick = nick != undefined ? nick.toLowerCase() : "";

  let nicks = ["fefe", "monty", "kiro", "lory", "filipp", "vlad"];

  let says = [
    "QUA COMANDA STO FRA",
    "JS > C++",
    "ke skifo le semplifikazioni",
    "sta dormendo.. riprova più tardi",
    "baba ba ba bababa ba",
    "Spero che non m'ha visto la Mattioli"
  ];

  if (nick != "" && nicks.indexOf(nick) != -1)
    return says[nicks.indexOf(nick)];
  else if (nick == "list")
  {
    let msg = "";
    nicks.forEach(el => msg += el + " ");
    return msg;
  }
}

function uptime() {
  let uptime = Date.now() - dateOfStart.getTime();

  let secs = Math.floor((uptime / 1000) % 60);
  let mins = Math.floor((uptime / (1000 * 60)) % 60);
  let hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);

  if (mins > 0) {
    if (hours > 0)
      return `Bot online da ${hours} ore, ${mins} minuti e ${secs} secondi!`;
    else return `Bot online da ${mins} minuti e ${secs} secondi!`;
  } else return `Bot online da ${secs} secondi!`;
}

bot.login(process.env.DISCORD_TOKEN);

const dateOfStart = new Date();

const lastversLink = "https://ddragon.leagueoflegends.com/realms/na.json";

var lastvs,
  champsList = [],
  linkchamp;
axios(lastversLink)
  .then(res => {
    lastvs = res.data.n;
    linkchamp = `http://ddragon.leagueoflegends.com/cdn/${lastvs.champion}/data/it_IT/champion.json`;
    return axios(linkchamp);
  })
  .then(res => {
    for (let i in Object.values(res.data.data)) {
      champsList = [
        ...champsList,
        [
          Object.values(res.data.data)[i].key,
          Object.values(res.data.data)[i].id,
          Object.values(res.data.data)[i].tags
        ]
      ];
    }
  });
