const Discord = require('discord.js');
const axios = require('axios');
const config = require('./config.json');

const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

const URL_PANEL = config.panel_url;
const API_KEY = config.apikey;

async function UpdateActivity() {
  try {
    const response = await axios.get(`${URL_PANEL}/api/application/servers`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const serverCount = response.data.meta.pagination.total;

    // Activity
    client.user.setActivity(`${serverCount} Active Server`, { type: 'WATCHING' });
    client.user.setStatus('dnd');
  } catch (error) {
    console.error('Error fetching data from Pterodactyl API:', error.message);
  }
}

client.on('ready', () => {
  console.log(`${client.user.tag}! Bot Online `);
  console.log(`Created by NightSky `);
  console.log(`https://github.com/NightSky13000`);

  setInterval(UpdateActivity, 300000);
});

// Bot Token
client.login(config.token);
