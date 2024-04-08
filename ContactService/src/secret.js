require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3002;
const mongoDBUrl = process.env.MONGODB_ATLAS_URL;


module.exports = { serverPort, mongoDBUrl };