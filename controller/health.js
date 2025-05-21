const { createInvoice } = require("../orderInvoiceHelper.js");
const { inputs } = require("../inputs.js");

async function createInvoiceFile(req, response) {
  let publicUrl = await createInvoice(inputs);
  return response.status(200).send("Server is healthy!!!!!!!!");
}

module.exports = { createInvoiceFile };
