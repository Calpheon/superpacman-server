// File ini berisi semua logika AI untuk hantu

const { BOARD_SIZE } = require("./gameState");

/**
 * Inisialisasi hantu awal
 */
function initGhosts() {
  return [
    {
      id: "ghost1",
      position: { x: 10, y: 10 },
      personality: "chaser",
    },
  ];
}

/**
 * Track pergerakan pemain untuk analisis AI
 */
function trackPlayerMovements(gameState) {
  for (const id in gameState.players) {
    const player = gameState.players[id];
    if (!player.movementHistory) {
      player.movementHistory = [];
    }

    // Hanya tambahkan ke history jika posisi berubah
    const lastPos =
      player.movementHistory.length > 0
        ? player.movementHistory[player.movementHistory.length - 1]
        : null;

    if (
      !lastPos ||
      lastPos.x !== player.position.x ||
      lastPos.y !== player.position.y
    ) {
      player.movementHistory.push({ ...player.position });

      // Batasi panjang history
      if (player.movementHistory.length > 10) {
        player.movementHistory.shift();
      }
    }
  }
}
