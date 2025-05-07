// File ini berisi semua fungsi untuk mengelola leaderboard

const fs = require('fs');
const path = require('path');

const leaderboardHistoryPath = path.join(__dirname, '../data/leaderboard-history.json');

/**
 * Muat leaderboard history dari file
 */
function loadLeaderboard() {
  try {
    if (fs.existsSync(leaderboardHistoryPath)) {
      const data = fs.readFileSync(leaderboardHistoryPath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading leaderboard history:', error);
    return [];
  }
}

/**
 * Update leaderboard dengan data pemain baru
 */
function updateLeaderboard(player) {
  let leaderboard = loadLeaderboard();

  const existingPlayerIndex = leaderboard.findIndex(p => p.name === player.name);
  
  const newEntry = {
    name: player.name,
    score: player.score,
    date: new Date().toISOString()
  };

  if (existingPlayerIndex !== -1) {
    // Update jika skor lebih tinggi
    if (player.score > leaderboard[existingPlayerIndex].score) {
      leaderboard[existingPlayerIndex] = newEntry;
    }
  } else {
    leaderboard.push(newEntry);
  }
  
  // Urutkan berdasarkan skor tertinggi
  leaderboard.sort((a, b) => b.score - a.score);
  
  // Simpan hanya 10 skor teratas
  if (leaderboard.length > 10) {
    leaderboard = leaderboard.slice(0, 10);
  }
  
  // Pastikan folder data ada
  const dir = path.dirname(leaderboardHistoryPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Simpan leaderboard yang diperbarui
  fs.writeFileSync(leaderboardHistoryPath, JSON.stringify(leaderboard, null, 2));
  
  return leaderboard;
}

module.exports = {
  loadLeaderboard,
  updateLeaderboard
};