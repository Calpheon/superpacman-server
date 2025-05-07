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
