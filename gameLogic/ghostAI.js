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

/**
 * Cari posisi aman jauh dari hantu
 */
function findSafePosition(gameState) {
  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    const pos = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };

    // Periksa jarak dari semua hantu
    let isSafe = true;
    for (const ghost of gameState.ghosts) {
      const distance =
        Math.abs(ghost.position.x - pos.x) + Math.abs(ghost.position.y - pos.y);
      if (distance < 5) {
        // Minimal 5 langkah dari hantu terdekat
        isSafe = false;
        break;
      }
    }

    if (isSafe) return pos;
    attempts++;
  }

  // Fallback jika tidak ada posisi aman
  return {
    x: Math.floor(Math.random() * BOARD_SIZE),
    y: Math.floor(Math.random() * BOARD_SIZE),
  };
}

/**
 * Update posisi hantu dengan AI
 */
function updateGhostsWithGeminiAI(gameState) {
  // Track pergerakan pemain untuk history
  trackPlayerMovements(gameState);

  // Update setiap hantu
  gameState.ghosts.forEach((ghost) => {
    // Temukan pemain terdekat
    const { player: nearestPlayer } = findNearestPlayer(ghost, gameState);

    // Jika tidak ada pemain, lakukan pergerakan acak
    if (!nearestPlayer) {
      ghost.position.x = Math.max(
        0,
        Math.min(
          BOARD_SIZE - 1,
          ghost.position.x + Math.floor(Math.random() * 3) - 1
        )
      );
      ghost.position.y = Math.max(
        0,
        Math.min(
          BOARD_SIZE - 1,
          ghost.position.y + Math.floor(Math.random() * 3) - 1
        )
      );
      return;
    }

    // Pilih strategi berdasarkan personality hantu
    let nextMove;

    switch (ghost.personality) {
      case "ambusher":
        // Hantu ambusher akan mencoba memprediksi gerakan pemain
        if (nearestPlayer.previousPosition) {
          const dx =
            nearestPlayer.position.x - nearestPlayer.previousPosition.x;
          const dy =
            nearestPlayer.position.y - nearestPlayer.previousPosition.y;

          const predictedPosition = {
            x: nearestPlayer.position.x + dx,
            y: nearestPlayer.position.y + dy,
          };

          nextMove = moveTowards(ghost.position, predictedPosition);
        } else {
          nextMove = moveTowards(ghost.position, nearestPlayer.position);
        }
        break;

      case "patroller":
        // Hantu patroller akan berpatroli di sekitar area tetapi akan mengejar jika pemain dekat
        const patrolPoints = [
          { x: 2, y: 2 },
          { x: 2, y: BOARD_SIZE - 3 },
          { x: BOARD_SIZE - 3, y: BOARD_SIZE - 3 },
          { x: BOARD_SIZE - 3, y: 2 },
        ];

        // Inisialisasi currentPatrolPoint jika belum ada
        if (ghost.currentPatrolPoint === undefined) {
          ghost.currentPatrolPoint = 0;
        }

        const nearbyResult = findNearestPlayer(ghost, gameState);
        if (nearbyResult.distance < 5) {
          // Jika pemain dekat, kejar
          nextMove = moveTowards(ghost.position, nearbyResult.player.position);
        } else {
          const target = patrolPoints[ghost.currentPatrolPoint];
          // Jika sudah sampai patrol point, pindah ke point berikutnya
          if (ghost.position.x === target.x && ghost.position.y === target.y) {
            ghost.currentPatrolPoint =
              (ghost.currentPatrolPoint + 1) % patrolPoints.length;
          }
          nextMove = moveTowards(
            ghost.position,
            patrolPoints[ghost.currentPatrolPoint]
          );
        }
        break;

      case "chaser":
      default:
        // Hantu chaser langsung mengejar pemain terdekat
        nextMove = moveTowards(ghost.position, nearestPlayer.position);
        break;
    }

    if (nextMove) {
      // Pastikan tetap dalam batas
      ghost.position.x = Math.max(0, Math.min(BOARD_SIZE - 1, nextMove.x));
      ghost.position.y = Math.max(0, Math.min(BOARD_SIZE - 1, nextMove.y));
    }

    // Periksa tabrakan dengan pemain
    for (const id in gameState.players) {
      const player = gameState.players[id];

      // Periksa tabrakan hanya jika pemain siap dan hidup
      if (!player || !player.ready || !player.alive) continue;

      // Periksa apakah pemain tidak invulnerable dan berada di posisi yang sama dengan hantu
      if (
        !player.invulnerable &&
        player.position.x === ghost.position.x &&
        player.position.y === ghost.position.y
      ) {
        console.log(`Collision detected for player ${player.name}!`);

        // Inisialisasi nyawa jika belum diatur
        if (player.lives === undefined) {
          player.lives = 3;
        }

        // Kurangi nyawa
        player.lives--;
        console.log(
          `Player ${player.name} lost a life. Remaining: ${player.lives}`
        );

        if (player.lives <= 0) {
          console.log(`Player ${player.name} has no more lives. Game over.`);
          player.alive = false;
        } else {
          // Buat pemain sementara invulnerable
          player.invulnerable = true;
          player.invulnerableTimer = 3; // 3 detik invulnerable

          // Pindahkan pemain ke posisi aman
          player.position = findSafePosition(gameState);
          console.log(
            `Player ${player.name} is now invulnerable at position (${player.position.x}, ${player.position.y})`
          );
        }
      }
    }
  });
}

module.exports = {
  initGhosts,
  updateGhostsWithGeminiAI,
};
