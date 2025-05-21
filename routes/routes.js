const { getHealth } = require("../controller/health.js");

function getRoutes() {
  app.get("/api/health", getHealth);
}

module.exports = {
  getRoutes,
};