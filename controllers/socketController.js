const {
  gameState,
  addPlayer,
  removePlayer,
  movePlayer,
  eatPoint,
  resetGameState,
} = require("../gameLogic/gameState");
const { toggleGhostMovement } = require("../gameLogic/ghostMovement");
const { updateLeaderboard } = require("../gameLogic/leaderboard");

/**
 * Setup event handler untuk socket
 * @param {Object} io - Socket.io instance
 * @param {Object} socket - Socket client
 * @param {Array} leaderboardHistory - History leaderboard
 */
function setupSocketHandlers(io, socket, leaderboardHistory) {
  console.log("A user connected:", socket.id);

  socket.emit("leaderboardHistory", leaderboardHistory);

  socket.on("joinGame", (playerData) => {
    addPlayer(socket.id, playerData);
    console.log(`${playerData.name} joined the game`);
    io.emit("updateGameState", gameState);
  });

  socket.on("playerReady", () => {
    if (gameState.players[socket.id]) {
      gameState.players[socket.id].ready = true;
      socket.emit("playerReady", true);
      console.log(`Player ${gameState.players[socket.id].name} is ready!`);

      // Aktifkan pergerakan hantu ketika pemain siap
      toggleGhostMovement(true, gameState, io);

      // Update semua client
      io.emit("updateGameState", gameState);
    }
  });

  socket.on("restartGame", () => {
    if (resetGameState()) {
      io.emit("updateGameState", gameState);
      console.log("Game restarted");
    }
  });

  socket.on("move", (moveData) => {
    try {
      console.log(`Player ${socket.id} moving to:`, moveData.position);
      movePlayer(socket.id, moveData);
      eatPoint(socket.id, gameState);
      io.emit("updateGameState", gameState);
    } catch (error) {
      console.error("Error processing move:", error);
    }
  });

  socket.on("disconnect", () => {
    const playerName = gameState.players[socket.id]?.name || "Unknown";
    if (gameState.players[socket.id]) {
      updateLeaderboard({
        name: gameState.players[socket.id].name,
        score: gameState.players[socket.id].score,
      });
    }
    removePlayer(socket.id);
    console.log(`${playerName} disconnected`);
    io.emit("updateGameState", gameState);

    // Periksa apakah masih ada pemain yang aktif
    let anyPlayerReady = false;
    for (const id in gameState.players) {
      if (gameState.players[id].ready) {
        anyPlayerReady = true;
        break;
      }
    }

    // Hentikan pergerakan hantu jika tidak ada pemain yang siap
    if (!anyPlayerReady) {
      toggleGhostMovement(false, gameState, io);
    }
  });
}

module.exports = { setupSocketHandlers };
