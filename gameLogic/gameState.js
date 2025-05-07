// File ini berisi semua fungsi dan data untuk mengelola state game

// Konstanta untuk game
const BOARD_SIZE = 20;
const INITIAL_POINTS = 20;

// Game state utama
const gameState = {
  players: {},
  ghosts: [],
  points: [],
  ghostSpeed: 300,
};

/**
 * Menghasilkan posisi random di dalam board
 */
function randomPosition() {
  try {
    const x = Math.floor(Math.random() * BOARD_SIZE);
    const y = Math.floor(Math.random() * BOARD_SIZE);
    return { x, y };
  } catch (error) {
    console.error("Error in randomPosition:", error);
    return { x: 5, y: 5 }; // Posisi default sebagai fallback
  }
}

/**
 * Menambahkan player baru ke game state
 */
function addPlayer(id, playerData) {
  gameState.players[id] = {
    ...playerData,
    position: randomPosition(),
    score: 0,
    alive: true,
    lives: 3,
    invulnerable: false,
    invulnerableTimer: 0,
    ready: false,
    movementHistory: [],
  };
}

/**
 * Menghapus player dari game state
 */
function removePlayer(id) {
  delete gameState.players[id];
}

/**
 * Memindahkan player ke posisi baru
 */
function movePlayer(id, moveData) {
  if (!gameState.players[id] || !gameState.players[id].alive) {
    console.warn(`Can't move player ${id}: not found or not alive`);
    return;
  }

  // Validasi posisi
  if (
    !moveData.position ||
    typeof moveData.position.x !== "number" ||
    typeof moveData.position.y !== "number"
  ) {
    console.error("Invalid position data:", moveData);
    return;
  }

  const { x, y } = moveData.position;

  // Pastikan posisi dalam batas board
  if (x < 0 || x >= BOARD_SIZE || y < 0 || y >= BOARD_SIZE) {
    console.warn(`Position out of bounds: (${x}, ${y})`);
    return;
  }

  // Simpan posisi sebelumnya
  gameState.players[id].previousPosition = {
    ...gameState.players[id].position,
  };

  // Update posisi
  gameState.players[id].position = { x, y };
}

/**
 * Memeriksa apakah pemain bisa mengambil poin di posisinya saat ini
 */
function eatPoint(playerId, gameState) {
  if (!gameState?.players?.[playerId]) {
    console.warn(`Player ${playerId} not found in gameState`);
    return;
  }

  const player = gameState.players[playerId];
  if (!gameState.points) {
    gameState.points = initPoints(gameState);
  }

  const pointIndex = gameState.points.findIndex(
    (point) => point.x === player.position.x && point.y === player.position.y
  );

  if (pointIndex !== -1) {
    player.score = (player.score || 0) + 1;
    gameState.points.splice(pointIndex, 1);
  }
}

/**
 * Inisialisasi poin-poin di board
 */
function initPoints(gameState) {
  const NUM_POINTS = INITIAL_POINTS;
  const points = [];
  const occupiedPositions = new Set();

  // Track posisi yang sudah ditempati
  if (gameState && gameState.players) {
    for (const id in gameState.players) {
      const player = gameState.players[id];
      occupiedPositions.add(`${player.position.x},${player.position.y}`);
    }
  }

  if (gameState && gameState.ghosts) {
    gameState.ghosts.forEach((ghost) => {
      occupiedPositions.add(`${ghost.position.x},${ghost.position.y}`);
    });
  }

  // Generate poin random di posisi yang kosong
  for (let i = 0; i < NUM_POINTS; i++) {
    let x, y;
    let attempts = 0;
    const maxAttempts = 50;

    // Cari posisi yang belum ditempati
    do {
      x = Math.floor(Math.random() * BOARD_SIZE);
      y = Math.floor(Math.random() * BOARD_SIZE);
      attempts++;
    } while (occupiedPositions.has(`${x},${y}`) && attempts < maxAttempts);

    // Jika ditemukan spot kosong atau sudah terlalu banyak percobaan
    if (attempts < maxAttempts) {
      points.push({ x, y });
      occupiedPositions.add(`${x},${y}`);
    }
  }

  return points;
}

/**
 * Reset seluruh game state
 */
function resetGameState() {
  console.log("Resetting game state");

  try {
    // Set nilai default
    gameState.ghostSpeed = 300;
    gameState.points = initPoints(gameState);
    gameState.ghosts = [
      {
        id: "ghost1",
        position: { x: 10, y: 10 },
        personality: "chaser",
      },
    ];

    // Reset posisi player
    for (const id in gameState.players) {
      if (gameState.players[id]) {
        gameState.players[id].position = {
          x: 1 + Math.floor(Math.random() * 5),
          y: 1 + Math.floor(Math.random() * 5),
        };
        gameState.players[id].ready = false;
        gameState.players[id].alive = true;
        gameState.players[id].invulnerable = false;
        gameState.players[id].invulnerableTimer = 0;
        gameState.players[id].score = 0; // Reset skor ketika game dimulai ulang
      }
    }

    return true;
  } catch (error) {
    console.error("Error resetting game state:", error);
    return false;
  }
}

module.exports = {
  gameState,
  addPlayer,
  removePlayer,
  movePlayer,
  eatPoint,
  initPoints,
  randomPosition,
  resetGameState,
  BOARD_SIZE,
};
