// src/services/api.js

// simple local in-memory "database"
let sessions = [];

// fake delay helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const api = {
  async createSession(session) {
    console.log("📡 Saving session:", session);
    await sleep(500); // simulate network delay
    sessions.unshift(session); // add to "database"
    return { success: true, session };
  },

  async getSessions() {
    console.log("📡 Fetching sessions...");
    await sleep(500); // simulate network delay
    return sessions;
  },

  async removeSession(id) {
    console.log("📡 Removing session:", id);
    await sleep(300);
    sessions = sessions.filter(s => s.id !== id);
    return { success: true };
  }
};
