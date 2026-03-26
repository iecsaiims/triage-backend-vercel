const { Sequelize } = require("sequelize");
const pg = require("pg");
require("dotenv").config();

const DEFAULT_LOCAL_PORT = 5432;

const buildDatabaseUrlFromLegacyEnv = () => {
  const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

  if (!DB_NAME || !DB_USER || !DB_HOST) {
    return null;
  }

  const username = encodeURIComponent(DB_USER);
  const password = encodeURIComponent(DB_PASSWORD || "");
  const host = DB_HOST;
  const port = DB_PORT || DEFAULT_LOCAL_PORT;

  return `postgres://${username}:${password}@${host}:${port}/${DB_NAME}`;
};

const databaseUrl = process.env.DATABASE_URL || buildDatabaseUrlFromLegacyEnv();

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not configured. Set DATABASE_URL for Neon/Vercel or DB_* variables for local development."
  );
}

const shouldUseSsl =
  process.env.DB_SSL === "true" ||
  (process.env.DB_SSL !== "false" && Boolean(process.env.DATABASE_URL));

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectModule: pg,
  logging: process.env.DB_LOGGING === "true" ? console.log : false,
  dialectOptions: shouldUseSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  pool: {
    max: Number(process.env.DB_POOL_MAX || 1),
    min: Number(process.env.DB_POOL_MIN || 0),
    idle: Number(process.env.DB_POOL_IDLE_MS || 10000),
    acquire: Number(process.env.DB_POOL_ACQUIRE_MS || 30000),
    evict: Number(process.env.DB_POOL_EVICT_MS || 1000),
  },
  retry: {
    max: Number(process.env.DB_RETRY_MAX || 2),
  },
});

module.exports = sequelize;
