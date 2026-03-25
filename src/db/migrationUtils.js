const { DataTypes } = require("sequelize");
const models = require("../models");

const getAllModels = () =>
  Object.values(models).filter(
    (value) => value && typeof value.getTableName === "function"
  );

const getTableName = (model) => model.getTableName().toString();

const resolveReferencedTable = (referenceModel) => {
  if (!referenceModel) {
    return null;
  }

  if (typeof referenceModel === "string") {
    return referenceModel;
  }

  if (typeof referenceModel.getTableName === "function") {
    return referenceModel.getTableName().toString();
  }

  if (referenceModel.tableName) {
    return referenceModel.tableName.toString();
  }

  if (referenceModel.name) {
    return referenceModel.name.toString();
  }

  return null;
};

const getModelsInDependencyOrder = () => {
  const allModels = getAllModels();
  const tableToModel = new Map(
    allModels.map((model) => [getTableName(model), model])
  );
  const dependencies = new Map();

  for (const model of allModels) {
    const tableName = getTableName(model);
    const referencedTables = new Set();

    for (const attribute of Object.values(model.rawAttributes)) {
      const referencedTable = resolveReferencedTable(attribute.references?.model);

      if (
        referencedTable &&
        referencedTable !== tableName &&
        tableToModel.has(referencedTable)
      ) {
        referencedTables.add(referencedTable);
      }
    }

    dependencies.set(tableName, referencedTables);
  }

  const orderedModels = [];
  const visiting = new Set();
  const visited = new Set();

  const visit = (tableName) => {
    if (visited.has(tableName)) {
      return;
    }

    if (visiting.has(tableName)) {
      return;
    }

    visiting.add(tableName);

    for (const dependency of dependencies.get(tableName) || []) {
      visit(dependency);
    }

    visiting.delete(tableName);
    visited.add(tableName);
    orderedModels.push(tableToModel.get(tableName));
  };

  for (const model of allModels) {
    visit(getTableName(model));
  }

  return orderedModels;
};

const cloneAttribute = (attribute) => {
  const cloned = {
    type: attribute.type,
  };

  const supportedKeys = [
    "allowNull",
    "defaultValue",
    "primaryKey",
    "autoIncrement",
    "unique",
    "comment",
    "field",
    "values",
    "onDelete",
    "onUpdate",
  ];

  for (const key of supportedKeys) {
    if (attribute[key] !== undefined) {
      cloned[key] = attribute[key];
    }
  }

  if (attribute.references) {
    cloned.references = {
      ...attribute.references,
      model: resolveReferencedTable(attribute.references.model),
    };
  }

  return cloned;
};

const getTableAttributes = (model) => {
  const attributes = {};

  for (const [attributeName, attribute] of Object.entries(model.rawAttributes)) {
    if (attribute.type instanceof DataTypes.VIRTUAL) {
      continue;
    }

    attributes[attributeName] = cloneAttribute(attribute);
  }

  return attributes;
};

module.exports = {
  getModelsInDependencyOrder,
  getTableAttributes,
};
