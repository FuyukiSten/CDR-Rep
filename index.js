const Discord = require('discord.js');
const client = new Discord.Client();
const mongoose = require('mongoose');
const Rep = require('./database/models/repSchema.js');
mongoose.connect('mongodb://admin:adminpasswordowooooaxxx1@ds155714.mlab.com:55714/alfhydb', {
  useNewUrlParser: true
});

let config = {
  'prefix': 'r!',
  'token': 'NTI4OTMyMzA0ODk5NDA3ODgy.Dx44cw.KgCgnP273M05W7iBxEIeg82mwIM',
  'whitelist': ['505096421532368907']
}
function toMedal(_numbers) {
  _numbers = _numbers.toString();
  var text = ``, numbers = { 1: '🥇', 2: '🥈', 3: '🥉', 4: '<:4_:534387787030593540>', 5: '<:5_:534387786657300502>' };
  for (let i = 0; i < _numbers.length; i++) text += numbers[parseInt(_numbers[i])];
  return text;
}
client.on('ready', () => {
  console.log('ready');
});

client.on('message', async message => {
  if (message.author.bot) return;
  if (message.channel.type == 'dm') return;
  if (!message.content.startsWith(config.prefix)) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd == 'rep') {
    let member = message.mentions.members.first();
    if (!member) {
      let embed = new Discord.RichEmbed()
        .setTimestamp()
        .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL, `http://discord.com/users/${message.author.id}`)
        .addField(`Tem uma coisa faltando !`, `Por favor mencione o membro que deseja dar ou tirar reputação`, true)
        .setColor('RANDOM')
      message.channel.send(embed);
      return;
    }

    let action = args[1];
    if (!action) {
      let embed = new Discord.RichEmbed()
        .setTimestamp()
        .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL, `http://discord.com/users/${message.author.id}`)
        .addField(`Tem uma coisa faltando !`, `Por favor especifique se você deseja tirar ou adicionar reputação, para fazer isso adicione um + ou - ao seu comando.`, true)
        .setColor('RANDOM')
      message.channel.send(embed);
      return;
    }

    let reason = args.slice(2).join(' ');
    if (!reason) {
      let embed = new Discord.RichEmbed()
        .setTimestamp()
        .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL, `http://discord.com/users/${message.author.id}`)
        .addField(`Tem uma coisa faltando !`, `Por que você deseja fazer isso ?`, true)
        .setColor('RANDOM')
      message.channel.send(embed);
      return;
    }

    if (action == '+') {
      let tofind = {
        _id: message.author.id
      }
      Rep.findOne(tofind, (err, result) => {
        console.log(result)
        if (err) return console.log(err);
        if (!result) {
          const NewRep = new Rep({
            _id: member.id,
            guildID: message.guild.id,
            repv: 1,
            reptomedal: 1
          });
          NewRep.save();
        } else {

          let newrepv = result.repv + 1;
          result.repv = newrepv;
          result.reptomedal = result.reptomedal + 1;
          result.save();
        }
        let embed = new Discord.RichEmbed()
          .setTimestamp()
          .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL, `http://discord.com/users/${message.author.id}`)
          .addField(`Sucesso`, `Foi adicionado um ponto de reputação ao usuário ${member} pois ${reason}`, true)
          .setColor('RANDOM')
        message.channel.send(embed);
      });
      await Rep.findOne(tofind, (err, result) => {
        if (result.repv >= 10) {
          let a = ["/"]
          let b = message.member.roles.map(r=> r.name);
          function testFunction(fruits, fruitsSpecified) {
            var newArray = [];
            for (var i = 0; i < fruits.length; i++) {
              for (var j = 0; j < fruitsSpecified.length; j++) {
                if (fruitsSpecified[j].indexOf(fruits[i]) != -1) {
                  newArray.push(fruitsSpecified[j]);
                }
              }
            }
            console.log(newArray);
            return newArray;
          }
          let af = testFunction(a, b);
          let n = parseInt(af[0]);
          let n2 = n + 1;
          if (af.length < 1) {
            let role = message.guild.roles.find(role => role.name == '1/Ative I.')
            member.addRole(role.id);
            result.reptomedal = 0;
            result.save();
          } else {
            message.guild.roles.forEach(r => {
              if (r.name.startsWith(`${n2}/`)) {
                member.addRole(r.id);
              }
            })
            message.guild.roles.forEach(r => {
              if (r.name.startsWith(`${n}/`)) {
                member.removeRole(r.id);
              }
            })
          }
        }
      })
      let embed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setDescription(`🏆 | Parabéns ${member}, por ter conseguido +10 pontos de reputação você ganhou uma medalha !`)
      message.channel.send(embed);
      return;
    }
    if (action == '-') {
      let tofind = {
        _id: message.author.id
      }
      Rep.findOne(tofind, (err, result) => {
        console.log(result)
        if (err) return console.log(err);
        console.log(result)
        if (result.length == 0) {
          const newrep = new Rep({

            _id: message.author.id,
            guildID: message.guild.id,
            repv: -1,
            reptomedal: -1
          });
          newrep.save();
        } else {
          let newrepv = result.repv - 1;
          result.repv = newrepv;
          result.reptomedal = result.reptomedal - 1;
          result.save();
        }
        let embed2 = new Discord.RichEmbed()
          .setTimestamp()
          .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL, `http://discord.com/users/${message.author.id}`)
          .addField(`Sucesso`, `Foi removido um ponto de reputação do usuário ${member} pois ${reason}`, true)
          .setColor('RANDOM')
        message.channel.send(embed2);
      });
      return;
    }
    let embed = new Discord.RichEmbed()
      .setTimestamp()
      .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL, `http://discord.com/users/${message.author.id}`)
      .addField(`Ops`, `Se você esta vendo essa mensagem é porque fez alguma coisa errada, verifique seu comando e tente novamente.`, true)
      .setColor('RANDOM')
    message.channel.send(embed);
  }
  if (cmd == 'leaderboard') {
    await message.delete();
    Rep.find({
      guildID: message.guild.id
    }).sort([
      ['repv', 'descending']
    ]).exec((err, res) => {
      if (err) console.log(err);

      let embed = new Discord.RichEmbed()
        .setTitle("Membros com mais reputação:")
      if (res.length === 0) {
        embed.setColor("RED");
        embed.addField("Nada foi encontrado", "Comecem a ganhar um pouco de reputação!")
      } else if (res.length < 5) {
        embed.setColor("RANDOM");
        for (i = 0; i < res.length; i++) {
          let member = message.guild.members.get(res[i]._id) || "Usuário saiu do servidor"
          if (member === "Usuário saiu do servidor") {
            embed.addField(`${toMedal(i + 1)}. ${member}`, `**Reputação**: ${res[i].repv}`);
          } else {
            embed.addField(`${toMedal(i + 1)}. ${member.user.username}`, `**Reputação**: ${res[i].repv}`);
          }
        }
      } else {
        embed.setColor("BLURPLE");
        for (i = 0; i < 5; i++) {
          let member = message.guild.members.get(res[i]._id) || "Usuário saiu do servidor"
          if (member === "Usuário saiu do servidor") {
            embed.addField(`${toMedal(i + 1)}. ${member}`, `**Reputação**: ${res[i].repv}`);
          } else {
            embed.addField(`${toMedal(i + 1)}. ${member.user.username}`, `**Reputação**: ${res[i].repv}`);
          }
        }
      }

      message.channel.send(embed);
    })
  }
  if (cmd == 'stats') {
    let user = message.mentions.users.first() || message.author
    let tofind = {
      _id: user.id 
    }
    Rep.findOne(tofind, (err, result) => {
      if (!result) {
        let oofed = new Discord.RichEmbed()
          .setColor(0xff6347)
          .addField('Não foi possivel executar o comando', `O usuário ${user.username} não está registrado no meu banco de dados`)
        message.channel.send(oofed);
        return;
      }
      let embed = new Discord.RichEmbed()
        .setColor(message.member.displayHexColor)
        .setTimestamp()
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Estasticas do usuário ${message.author.username}#${message.author.discriminator}:`)
        .addField('Reputação:', `${result.repv}`)
        message.channel.send(embed);
    })
  }
});
client.login(config.token);