const { Server } = require("socket.io");
const { setupSocketHandlers } = require("../controllers/socketController");

/**
 * Inisialisasi Socket.IO server
 * @param {Object} server - HTTP server
 * @param {Array} leaderboardHistory - Leaderboard history
 * @returns {Object} Socket.io instance
 */
function initSocketServer(server, leaderboardHistory) {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    setupSocketHandlers(io, socket, leaderboardHistory);
  });

  return io;
}

module.exports = { initSocketServer };
