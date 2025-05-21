const { createInvoiceFile } = require("../controller/health.js");

function getRoutes() {
  app.get("/api/createInvoice", createInvoiceFile);
}

module.exports = {
  getRoutes,
};