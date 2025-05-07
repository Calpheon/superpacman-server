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
