const Discord = require('discord.js');
const axios = require('axios');
const config = require('./config.json');

const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

const URL_PANEL = config.panel_url;
const API_KEY = config.apikey;

let ActivityIndex = 0;

async function UpdateActivity() {
  try {
    const [ServersResponse, NodesResponse, UsersResponse] = await Promise.all([
      axios.get(`${URL_PANEL}/api/application/servers`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }),
      axios.get(`${URL_PANEL}/api/application/nodes`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }),
      axios.get(`${URL_PANEL}/api/application/users`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }),
    ]);

    const ServerCount = ServersResponse.data.meta.pagination.total;
    const NodeCount = NodesResponse.data.meta.pagination.total;
    const UserCount = UsersResponse.data.meta.pagination.total;

    // Activity List
    const activities = [
      { type: 'WATCHING', text: `${ServerCount} Servers` },
      { type: 'WATCHING', text: `${NodeCount} Nodes` },
      { type: 'WATCHING', text: `${UserCount} Users` },
    ];

    client.user.setActivity(activities[ActivityIndex].text, { type: activities[ActivityIndex].type });
    client.user.setStatus('dnd');

    ActivityIndex = (ActivityIndex + 1) % activities.length;
  } catch (error) {
    console.error('Error fetching data from Pterodactyl API:', error.message);
  }
}

client.on('ready', () => {
  console.log(`${client.user.tag}! Bot Online `);
  UpdateActivity();
  setInterval(UpdateActivity, 30 * 1000);
});

client.login(config.token);
