const { createInvoice } = require("../orderInvoiceHelper.js");
const { inputs } = require("../inputs.js");

async function createInvoiceFile(req, response) {
  let message = await createInvoice(inputs);
  return response.status(200).send(message);
}

module.exports = { createInvoiceFile };
