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
