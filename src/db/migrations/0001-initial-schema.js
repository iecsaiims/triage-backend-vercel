const {
  getModelsInDependencyOrder,
  getTableAttributes,
} = require("../migrationUtils");

module.exports = {
  async up({ queryInterface }) {
    const models = getModelsInDependencyOrder();

    for (const model of models) {
      await queryInterface.createTable(
        model.getTableName(),
        getTableAttributes(model)
      );
    }
  },

  async down({ queryInterface }) {
    const models = getModelsInDependencyOrder().reverse();

    for (const model of models) {
      await queryInterface.dropTable(model.getTableName());
    }
  },
};
