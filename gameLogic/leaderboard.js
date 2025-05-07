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



module.exports = {
  loadLeaderboard,
  updateLeaderboard
};