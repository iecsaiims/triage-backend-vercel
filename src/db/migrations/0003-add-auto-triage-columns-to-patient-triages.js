module.exports = {
  async up({ queryInterface, Sequelize }) {
    await queryInterface.addColumn("patient_triages", "decision_payload", {
      type: Sequelize.JSONB,
      allowNull: true,
    });

    await queryInterface.addColumn("patient_triages", "protocol_version", {
      type: Sequelize.STRING(64),
      allowNull: true,
    });

    await queryInterface.addColumn("patient_triages", "auto_triage_category", {
      type: Sequelize.STRING(16),
      allowNull: true,
    });

    await queryInterface.addColumn("patient_triages", "auto_triage_reasons", {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },

  async down({ queryInterface }) {
    await queryInterface.removeColumn("patient_triages", "auto_triage_reasons");
    await queryInterface.removeColumn("patient_triages", "auto_triage_category");
    await queryInterface.removeColumn("patient_triages", "protocol_version");
    await queryInterface.removeColumn("patient_triages", "decision_payload");
  },
};
