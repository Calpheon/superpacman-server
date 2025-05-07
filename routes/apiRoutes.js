const express = require("express");
const router = express.Router();

/**
 * API route untuk leaderboard
 * @param {Array} leaderboardHistory - Leaderboard history
 * @returns {Object} Router instance
 */
function setupApiRoutes(leaderboardHistory) {
  // API endpoint for leaderboard
  router.get("/leaderboard", (req, res) => {
    try {
      res.json(leaderboardHistory);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  return router;
}

module.exports = { setupApiRoutes };