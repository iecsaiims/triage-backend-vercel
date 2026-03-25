require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
const { sequelize } = require("../src/models");

const MIGRATIONS_DIR = path.resolve(__dirname, "../src/db/migrations");
const META_TABLE_NAME = "SequelizeMeta";

const getMigrationFiles = () =>
  fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".js"))
    .sort();

const normalizeTableName = (table) => {
  if (typeof table === "string") {
    return table;
  }

  return table?.tableName || table?.table_name || null;
};

const ensureMetaTable = async (queryInterface) => {
  const existingTables = await queryInterface.showAllTables();
  const metaTableExists = existingTables
    .map(normalizeTableName)
    .includes(META_TABLE_NAME);

  if (!metaTableExists) {
    await queryInterface.createTable(META_TABLE_NAME, {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
    });
  }
};

const getAppliedMigrations = async () => {
  const queryInterface = sequelize.getQueryInterface();
  await ensureMetaTable(queryInterface);

  const [rows] = await sequelize.query(
    `SELECT name FROM "${META_TABLE_NAME}" ORDER BY name ASC;`
  );

  return rows.map((row) => row.name);
};

const recordMigration = async (fileName) => {
  await sequelize.query(
    `INSERT INTO "${META_TABLE_NAME}" (name) VALUES (:name);`,
    { replacements: { name: fileName } }
  );
};

const removeMigrationRecord = async (fileName) => {
  await sequelize.query(
    `DELETE FROM "${META_TABLE_NAME}" WHERE name = :name;`,
    { replacements: { name: fileName } }
  );
};

const loadMigration = (fileName) =>
  require(path.join(MIGRATIONS_DIR, fileName));

const runUp = async () => {
  const applied = new Set(await getAppliedMigrations());
  const pending = getMigrationFiles().filter((fileName) => !applied.has(fileName));
  const queryInterface = sequelize.getQueryInterface();

  for (const fileName of pending) {
    const migration = loadMigration(fileName);
    console.log(`Applying ${fileName}`);
    await migration.up({ queryInterface, sequelize, Sequelize });
    await recordMigration(fileName);
  }

  if (!pending.length) {
    console.log("No pending migrations.");
  }
};

const runDown = async () => {
  const applied = await getAppliedMigrations();
  const lastApplied = applied[applied.length - 1];

  if (!lastApplied) {
    console.log("No applied migrations to rollback.");
    return;
  }

  const migration = loadMigration(lastApplied);
  const queryInterface = sequelize.getQueryInterface();

  console.log(`Rolling back ${lastApplied}`);
  await migration.down({ queryInterface, sequelize, Sequelize });
  await removeMigrationRecord(lastApplied);
};

const direction = process.argv[2] || "up";

async function main() {
  try {
    await sequelize.authenticate();

    if (direction === "down") {
      await runDown();
    } else {
      await runUp();
    }

    await sequelize.close();
  } catch (error) {
    console.error("Migration command failed:", error);
    await sequelize.close().catch(() => {});
    process.exit(1);
  }
}

main();
