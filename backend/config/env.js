const dotenv = require("dotenv");

dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,

  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/dogfood",

  JWT_SECRET:
    process.env.JWT_SECRET ||
    "dogfood_development_secret_change_this",

  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",

  NODE_ENV: process.env.NODE_ENV || "development",

  CLIENT_URL:
    process.env.CLIENT_URL ||
    "http://localhost:5173",
};

module.exports = env;