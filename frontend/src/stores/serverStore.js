import { defineStore } from 'pinia'

export const useServerStore = defineStore('serverStore', {
  state: () => ({
    servers: [], // Array to hold server information
    loading: false, // For handling loading states
    error: null, // For error messages
  }),
  actions: {
    async startServer(serverId) {
      // Logic to start a server
      console.log(`Start server with ID: ${serverId}`)
    },
    async stopServer(serverId) {
      // Logic to stop a server
      console.log(`Stop server with ID: ${serverId}`)
    },
    async restartServer(serverId) {
      // Logic to restart a server
      console.log(`Restart server with ID: ${serverId}`)
    },
    async createServer(serverData) {
      // Logic to create a new server
      console.log('Create server with data:', serverData)
    },
    async deleteServer(serverId) {
      // Logic to delete a server
      console.log(`Delete server with ID: ${serverId}`)
    },
    async backupServer(serverId) {
      // Logic to create a backup for a server
      console.log(`Backup server with ID: ${serverId}`)
    },
  },
})
