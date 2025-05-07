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

/**
 * Temukan pemain terdekat
 */
function findNearestPlayer(ghost, gameState) {
  let nearestPlayer = null;
  let minDist = Infinity;

  for (const id in gameState.players) {
    const player = gameState.players[id];
    if (!player.alive) continue;

    const dist =
      Math.abs(player.position.x - ghost.position.x) +
      Math.abs(player.position.y - ghost.position.y);

    if (dist < minDist) {
      minDist = dist;
      nearestPlayer = player;
    }
  }

  return { player: nearestPlayer, distance: minDist };
}

/**
 * Bergerak menuju target
 */
function moveTowards(current, target) {
  const dx = target.x > current.x ? 1 : target.x < current.x ? -1 : 0;
  const dy = target.y > current.y ? 1 : target.y < current.y ? -1 : 0;

  // Bergantian antara gerakan horizontal dan vertikal
  if (Math.random() > 0.5 || dx === 0) {
    return { x: current.x, y: current.y + dy };
  } else {
    return { x: current.x + dx, y: current.y };
  }
}
