const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const axios = require('axios');
const config = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const URL_PANEL = config.panel_url;
const API_KEY = config.apikey;

let activityIndex = 0;

async function updateActivity() {
  try {
    const { data: serversData } = await axios.get(`${URL_PANEL}/api/application/servers`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });

    const { data: nodesData } = await axios.get(`${URL_PANEL}/api/application/nodes`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });

    const { data: usersData } = await axios.get(`${URL_PANEL}/api/application/users`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });

    const activities = [
      { type: ActivityType.Watching, name: `${serversData.meta.pagination.total} Servers` },
      { type: ActivityType.Watching, name: `${nodesData.meta.pagination.total} Nodes` },
      { type: ActivityType.Watching, name: `${usersData.meta.pagination.total} Users` }
    ];

    client.user.setActivity(activities[activityIndex]);
    client.user.setStatus('dnd');

    activityIndex = (activityIndex + 1) % activities.length;
  } catch (error) {
    console.error('Error fetching data from Pterodactyl API:', error.message);
  }
}

client.once('ready', () => {
  console.log(`${client.user.tag} is online!`);
  updateActivity();
  setInterval(updateActivity, 30000);
});

client.login(config.token);
