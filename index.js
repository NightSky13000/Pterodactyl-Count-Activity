const Discord = require('discord.js');
const mysql = require('mysql');

const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
// Database Panel
const dbConnection = mysql.createConnection({
  host: '192.168.0.1',
    user: 'ns',
    password: '123',
    database: 'panel'
});

dbConnection.connect((err) => {
  if (err) {
    console.error('Error database:', err);
    return;
  }
  console.log('Connect to databases.');
});

client.on('ready', () => {
  console.log(`${client.user.tag}! Bot Online `);
  
  dbConnection.query('SELECT COUNT(*) AS serverCount FROM servers', (err, results) => {
    if (err) {
      console.error('error database:', err);
      return;
    }
    
     // Activity
    const serverCount = results[0].serverCount;
    client.user.setActivity(`${serverCount} Active Server`, { type: 'WATCHING' });
    client.user.setStatus('dnd');
  });
});

// Bot Token
client.login('token'); 
