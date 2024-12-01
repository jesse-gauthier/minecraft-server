// app.js

import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.PTERODACTYL_API_KEY;
const PANEL_URL = process.env.PTERODACTYL_PANEL_URL;
const NODE_ID = process.env.NODE_ID;

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  'Accept': 'Application/vnd.pterodactyl.v1+json'
};

const createUser = async (userData) => {
  try {
    const response = await axios.post(
      `${PANEL_URL}/api/application/users`,
      userData,
      { headers }
    );
    return response.data.attributes;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const createServer = async (serverData) => {
  try {
    const response = await axios.post(
      `${PANEL_URL}/api/application/servers`,
      serverData,
      { headers }
    );
    return response.data.attributes;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getNestAndEggIds = async () => {
  try {
    const nestsResponse = await axios.get(
      `${PANEL_URL}/api/application/nests`,
      { headers }
    );
    const minecraftNest = nestsResponse.data.data.find(
      nest => nest.attributes.name.toLowerCase() === 'minecraft'
    );
    if (!minecraftNest) throw new Error('Minecraft nest not found');
    const nestId = minecraftNest.attributes.id;

    const eggsResponse = await axios.get(
      `${PANEL_URL}/api/application/nests/${nestId}/eggs`,
      { headers }
    );
    const paperEgg = eggsResponse.data.data.find(
      egg => egg.attributes.name.toLowerCase() === 'paper'
    );
    if (!paperEgg) throw new Error('Paper egg not found');
    const eggId = paperEgg.attributes.id;

    return { nestId, eggId };
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getAvailableAllocationId = async () => {
  try {
    const allocationsResponse = await axios.get(
      `${PANEL_URL}/api/application/nodes/${NODE_ID}/allocations`,
      { headers }
    );
    const allocations = allocationsResponse.data.data;
    const availableAllocation = allocations.find(
      allocation => !allocation.attributes.assigned
    );
    if (!availableAllocation) throw new Error('No available allocations');
    return availableAllocation.attributes.id;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

app.post('/create-user', async (req, res) => {
  try {
    const { username, email, first_name, last_name, password } = req.body;
    if (!username || !email || !first_name || !last_name || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Additional input validation can be added here

    const userPayload = {
      username,
      email,
      first_name,
      last_name,
      password,
      language: 'en'
    };

    const user = await createUser(userPayload);
    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post('/create-server', async (req, res) => {
  try {
    const { user_id, server_name, memory, disk } = req.body;
    if (!user_id || !server_name || !memory || !disk) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Additional input validation can be added here

    const { nestId, eggId } = await getNestAndEggIds();
    const allocationId = await getAvailableAllocationId();

    const serverPayload = {
      name: server_name,
      user: user_id,
      nest: nestId,
      egg: eggId,
      docker_image: 'quay.io/pterodactyl/core:java-17',
      startup: 'java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar server.jar',
      environment: {
        SERVER_JARFILE: 'server.jar',
        VERSION: 'latest',
        BUILD_NUMBER: 'latest',
        SPONGE_VERSION: 'latest',
        BUNGEE_VERSION: 'latest',
        MC_VERSION: 'latest'
      },
      limits: {
        memory: parseInt(memory, 10),
        swap: 0,
        disk: parseInt(disk, 10),
        io: 500,
        cpu: 0
      },
      feature_limits: {
        databases: 0,
        allocations: 1,
        backups: 0
      },
      allocation: {
        default: allocationId
      }
    };

    const server = await createServer(serverPayload);
    res.status(201).json({ message: 'Server created', server });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
