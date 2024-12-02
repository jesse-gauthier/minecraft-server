import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // If you need to send cookies or authentication tokens
  })
);
app.use(express.json());

const API_KEY = process.env.PTERODACTYL_API_KEY;
const PANEL_URL = process.env.PTERODACTYL_PANEL_URL;
const NODE_ID = process.env.NODE_ID;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
  Accept: "Application/vnd.pterodactyl.v1+json",
};

const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8); // Generates an 8-character password
};

const createUser = async (userData) => {
  try {
    console.log("Attempting to create user with data: ", JSON.stringify(userData, null, 2));
    const response = await fetch(`${PANEL_URL}/api/application/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data) || response.statusText);
    console.log("User creation successful. Response: ", data.attributes);
    return data.attributes;
  } catch (error) {
    console.error("Error creating user: ", typeof error === 'object' ? JSON.stringify(error, null, 2) : error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    console.log("Fetching user by email: ", email);
    const response = await fetch(`${PANEL_URL}/api/application/users?filter[email]=${email}`, {
      method: 'GET',
      headers,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data || response.statusText);
    if (data.data.length > 0) {
      console.log("User found with email: ", email);
      return data.data[0].attributes;
    }
    console.log("No user found with email: ", email);
    return null;
  } catch (error) {
    console.error("Error fetching user by email: ", typeof error === 'object' ? JSON.stringify(error, null, 2) : error);
    throw error;
  }
};

const createServer = async (serverData) => {
  try {
    console.log("Attempting to create server with data: ", JSON.stringify(serverData, null, 2));
    const response = await fetch(`${PANEL_URL}/api/application/servers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(serverData),
    });
    const data = await response.json();

    if (!response.ok) {
      console.error("Error response from server: ", {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      if (data.errors) {
        console.error("Validation errors: ", data.errors.map(error => JSON.stringify(error, null, 2)).join('\n'));
      }
      throw new Error(data.errors ? JSON.stringify(data.errors) : response.statusText);
    }

    console.log("Server creation successful. Response: ", data.attributes);
    return data.attributes;
  } catch (error) {
    console.error("Error creating server: ", typeof error === 'object' ? JSON.stringify(error, null, 2) : error);
    throw error;
  }
};



const getNestAndEggIds = async () => {
  try {
    console.log("Fetching nest and egg IDs...");
    const nestsResponse = await fetch(`${PANEL_URL}/api/application/nests`, {
      method: 'GET',
      headers,
    });
    const nestsData = await nestsResponse.json();
    if (!nestsResponse.ok) throw new Error(JSON.stringify(nestsData) || nestsResponse.statusText);
    const minecraftNest = nestsData.data.find(
      (nest) => nest.attributes.name.toLowerCase() === "minecraft"
    );
    if (!minecraftNest) throw new Error("Minecraft nest not found");
    const nestId = minecraftNest.attributes.id;

    const eggsResponse = await fetch(`${PANEL_URL}/api/application/nests/${nestId}/eggs`, {
      method: 'GET',
      headers,
    });
    const eggsData = await eggsResponse.json();
    if (!eggsResponse.ok) throw new Error(JSON.stringify(eggsData) || eggsResponse.statusText);
    const paperEgg = eggsData.data.find(
      (egg) => egg.attributes.name.toLowerCase() === "paper"
    );
    if (!paperEgg) throw new Error("Paper egg not found");
    const eggId = paperEgg.attributes.id;

    console.log("Nest and egg IDs fetched successfully. Nest ID: ", nestId, ", Egg ID: ", eggId);
    return { nestId, eggId };
  } catch (error) {
    console.error("Error fetching nest and egg IDs: ", typeof error === 'object' ? JSON.stringify(error, null, 2) : error);
    throw error;
  }
};

const getAvailableAllocationId = async () => {
  try {
    console.log("Fetching available allocation ID...");
    const allocationsResponse = await fetch(`${PANEL_URL}/api/application/nodes/${NODE_ID}/allocations`, {
      method: 'GET',
      headers,
    });
    const allocationsData = await allocationsResponse.json();
    if (!allocationsResponse.ok) throw new Error(JSON.stringify(allocationsData) || allocationsResponse.statusText);
    const availableAllocation = allocationsData.data.find(
      (allocation) => !allocation.attributes.assigned
    );
    if (!availableAllocation) throw new Error("No available allocations");
    console.log("Available allocation ID fetched successfully: ", availableAllocation.attributes.id);
    return availableAllocation.attributes.id;
  } catch (error) {
    console.error("Error fetching available allocation ID: ", typeof error === 'object' ? JSON.stringify(error, null, 2) : error);
    throw error;
  }
};

app.post("/create-user", async (req, res) => {
  try {
    const { email, first_name, last_name } = req.body;
    
    const password = generateRandomPassword();
    const username = `user_${Math.floor(Math.random() * 1000000)}`;
    
    console.log("Received request to create user with email: ", email);
    if (!username || !email || !first_name || !last_name || !password) {
      console.error("Missing required fields in request body");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      console.log("User already exists with email: ", email);
      return res.status(200).json({ message: "User already exists", user_number: existingUser.id, user: existingUser });
    }

    const userPayload = {
      username,
      email,
      first_name,
      last_name,
      password,
      language: "en",
    };

    const user = await createUser(userPayload);
    console.log("User created successfully with email: ", email);
    res.status(201).json({ message: "User created", user_number: user.id, user, temp_password: password });
  } catch (error) {
    console.error("Error in /create-user endpoint: ", typeof error === 'object' ? JSON.stringify(error, null, 2) : error);
    res.status(500).json({ error });
  }
});

app.post("/create-server", async (req, res) => {
  try {
    const { user_id, server_name, memory, disk } = req.body;
    console.log("Received request to create server for user ID: ", user_id);
    if (!user_id || !server_name || !memory || !disk) {
      console.error("Missing required fields in request body");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { nestId, eggId } = await getNestAndEggIds();
    const allocationId = await getAvailableAllocationId();

    const serverPayload = {
      name: server_name,
      user: user_id,
      nest: nestId,
      egg: eggId,
      docker_image: "quay.io/pterodactyl/core:java-17",
      startup: "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar server.jar",
      environment: {
        SERVER_JARFILE: "server.jar",
        VERSION: "latest",
        BUILD_NUMBER: "latest",
        SPONGE_VERSION: "latest",
        BUNGEE_VERSION: "latest",
        MC_VERSION: "latest",
      },
      limits: {
        memory: parseInt(memory, 10),
        swap: 0,
        disk: parseInt(disk, 10),
        io: 500,
        cpu: 0,
      },
      feature_limits: {
        databases: 0,
        allocations: 1,
        backups: 0,
      },
      allocation: {
        default: allocationId,
      },
    };

    const server = await createServer(serverPayload);
    console.log("Server created successfully for user ID: ", user_id);
    res.status(201).json({ message: "Server created", server });
  } catch (error) {
    console.error("Error in /create-server endpoint: ", typeof error === 'object' ? JSON.stringify(error, null, 2) : error);
    res.status(500).json({ error });
  }
});

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
