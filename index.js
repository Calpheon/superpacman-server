const express = require("express");
const http = require("http");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Import konfigurasi dan rute
const { initSocketServer } = require("./config/socketConfig");
const { setupApiRoutes } = require("./routes/apiRoutes");

// Import game logic
const { gameState, initPoints } = require("./gameLogic/gameState");
const { initGhosts } = require("./gameLogic/ghostAI");
const { loadLeaderboard } = require("./gameLogic/leaderboard");

// Setup Express
const app = express();
app.use(cors());
const server = http.createServer(app);

// Pastikan folder data ada
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Inisialisasi game state
gameState.ghosts = initGhosts();
gameState.points = initPoints(gameState);

// Muat leaderboard history
const leaderboardHistory = loadLeaderboard();

// Setup API routes
app.use("/api", setupApiRoutes(leaderboardHistory));

// Inisialisasi Socket.IO
initSocketServer(server, leaderboardHistory);

// Jalankan server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
