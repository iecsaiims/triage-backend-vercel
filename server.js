require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./src/models");

const PORT = Number(process.env.PORT) || 3003;

async function start() {
  try {
    await sequelize.authenticate();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
