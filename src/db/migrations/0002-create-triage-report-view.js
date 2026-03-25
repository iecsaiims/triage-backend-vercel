const VIEW_NAME = "v_patient_triage_basic";

const createViewSql = `
  CREATE OR REPLACE VIEW ${VIEW_NAME} AS
  WITH latest_triage AS (
    SELECT
      p.name AS patient_name,
      p.cr_number,
      p.age AS age_years,
      p.gender,
      timezone('Asia/Kolkata', pt.triage_time_stamp)::date AS triage_date,
      timezone('Asia/Kolkata', pt.triage_time_stamp)::time without time zone AS triage_time,
      pt.triage AS triage_category,
      pt.emergency_type,
      pt.arrival_mode,
      pt.referral_status,
      pt.spo2,
      pt.pulse,
      pt.sbp,
      pt.dbp,
      pt.rr,
      pt.temp,
      pt.complaints,
      pt.triage_notes,
      ROW_NUMBER() OVER (
        PARTITION BY pt.patient_id
        ORDER BY pt.triage_time_stamp DESC, pt.created_at DESC
      ) AS rn
    FROM patient_triages pt
    INNER JOIN patients p ON p.id = pt.patient_id
  )
  SELECT
    patient_name,
    cr_number,
    age_years,
    gender,
    triage_date,
    triage_time,
    triage_category,
    emergency_type,
    arrival_mode,
    referral_status,
    spo2,
    pulse,
    sbp,
    dbp,
    rr,
    temp,
    complaints,
    triage_notes
  FROM latest_triage
  WHERE rn = 1;
`;

module.exports = {
  async up({ queryInterface }) {
    await queryInterface.sequelize.query(createViewSql);
  },

  async down({ queryInterface }) {
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS ${VIEW_NAME};`);
  },
};
