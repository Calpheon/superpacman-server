const { initPoints } = require("./gameState");
const { updateGhostsWithGeminiAI } = require("./ghostAI");

// Simpan referensi timer untuk ghost movement
let ghostUpdateInterval;

/**
 * Mengontrol pergerakan hantu
 * @param {boolean} shouldMove - Apakah hantu harus bergerak
 * @param {Object} gameState - State game saat ini
 * @param {Object} io - Socket.io instance untuk broadcast
 */
function toggleGhostMovement(shouldMove, gameState, io) {
  if (ghostUpdateInterval) {
    clearInterval(ghostUpdateInterval);
    ghostUpdateInterval = null;
  }
  
  if (shouldMove) {
    console.log("Starting ghost movement with speed:", gameState.ghostSpeed || 300);
    ghostUpdateInterval = setInterval(() => {
      try {
        // Periksa jika semua titik telah dikumpulkan
        if (gameState.points.length === 0) {
          console.log("All points collected! Adding new ghost and points");
          // Tambah hantu baru
          const newGhost = {
            id: `ghost${gameState.ghosts.length + 1}`,
            position: { x: 10, y: 10 },
            personality: ["chaser", "ambusher", "patroller"][Math.floor(Math.random() * 3)]
          };
          gameState.ghosts.push(newGhost);
          
          // Jika kecepatan hantu > 100, tambah kecepatan
          if (gameState.ghostSpeed > 100) {
            gameState.ghostSpeed -= 20; // Hantu bergerak lebih cepat
          }
          
          // Reset titik
          gameState.points = initPoints(gameState);
          
          // Buat semua pemain aktif invulnerable sementara
          for (const id in gameState.players) {
            if (gameState.players[id].alive) {
              gameState.players[id].invulnerable = true;
              gameState.players[id].invulnerableTimer = 3; // 3 detik
            }
          }
          
          io.emit("updateGameState", gameState);
          return;
        }

        const interval = gameState.ghostSpeed || 300;
        const decreaseAmount = interval / 1000;
        
        // Update timer invulnerability pemain
        for (const id in gameState.players) {
          const player = gameState.players[id];
          if (player?.invulnerable) {
            player.invulnerableTimer -= decreaseAmount;
            
            if (player.invulnerableTimer <= 0) {
              player.invulnerable = false;
              player.invulnerableTimer = 0;
            }
          }
        }

        updateGhostsWithGeminiAI(gameState);
        io.emit("updateGameState", gameState);
      } catch (error) {
        console.error("Error in ghost movement:", error);
      }
    }, gameState.ghostSpeed || 300);
  } else {
    console.log("Ghost movement stopped");
  }
}

module.exports = { toggleGhostMovement };