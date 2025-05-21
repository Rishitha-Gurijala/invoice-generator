console.log("Server is healthy");

function getHealth(req, response) {
  return response.status(200).send("Server is healthy!!!!!!!!");
}

module.exports = { getHealth };
