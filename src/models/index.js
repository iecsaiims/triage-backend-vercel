const sequelize = require("../config/db.js");
const User = require("./userModel");
const Patient = require("./patientModel");
const PatientTriage = require("./patientTriageModel");
const PrimaryAssessment = require("./primaryAssessmetModel");
const GeneralEmergencyCare = require("./generalEmergencyCaseModel.js");
const TraumaTemplate = require("./traumaTemplateModel.js");
const ProgressNotes = require("./progressNotesModel.js");
const TransferOut = require("./transferOutModel.js");
const DischargeSummary = require("./dischargeSummayModel.js");
const LamaConsent = require("./lamaConsentModel.js");
const Admission = require("./admissionModel.js");
const Xray = require("./xrayModel.js");
const Pocus = require("./pocusModel.js");
const Ecg = require("./ecgModel.js");
const BloodGas = require("./bloodGasModel.js");
const Troponin = require("./troponinModel.js");
const OtherTest = require("./otherTestModel.js");
const CtScan = require("./ctScanModel.js");
const Cbc = require("./cbcModel.js");
const Coagulation = require("./coagulationModel.js");
const lft = require("./lftModel.js");
const Rft = require("./rftModel.js");
const Treatment = require("./treatmentModel.js");
const UrineTest = require("./urineTestModel.js");
const VitalRecording = require("./vitalsRecordingModel.js");
const InOut = require("./inOutModel.js");
const HandoverNotes = require("./handoverNotes.js");
const TreatmentNursing = require("./treatmentNursingModel.js");
const EdConsultation = require("./edConsultation.js");
const DiagnosisRecord = require("./diagnosisRecordModel.js");
const Enc = require("./encModel.js");
const Consultation = require("./encConsultationModel.js");

let associationsInitialized = false;

const initializeAssociations = () => {
  if (associationsInitialized) {
    return;
  }

  Patient.hasMany(PatientTriage, {
    foreignKey: "patient_id",
    as: "patientTriage",
    onDelete: "CASCADE",
  });
  PatientTriage.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasOne(PrimaryAssessment, {
    foreignKey: "patient_id",
    as: "primaryAssessment",
  });
  PrimaryAssessment.belongsTo(Patient, { foreignKey: "patient_id" });

  Patient.hasMany(GeneralEmergencyCare, {
    foreignKey: "patient_id",
    as: "GeneralEmergencyCare",
    onDelete: "CASCADE",
  });
  GeneralEmergencyCare.belongsTo(Patient, {
    foreignKey: "patient_id",
    as: "patient",
  });

  Patient.hasMany(TraumaTemplate, {
    foreignKey: "patient_id",
    as: "traumaTemplates",
  });
  TraumaTemplate.belongsTo(Patient, {
    foreignKey: "patient_id",
    as: "patient",
  });

  Patient.hasMany(ProgressNotes, {
    foreignKey: "patient_id",
    as: "ProgressNotes",
    onDelete: "CASCADE",
  });
  ProgressNotes.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(TransferOut, {
    foreignKey: "patient_id",
    as: "TransferOut",
    onDelete: "CASCADE",
  });
  TransferOut.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(DischargeSummary, {
    foreignKey: "patient_id",
    as: "DischargeSummary",
    onDelete: "CASCADE",
  });
  DischargeSummary.belongsTo(Patient, {
    foreignKey: "patient_id",
    as: "patient",
  });

  Patient.hasMany(LamaConsent, {
    foreignKey: "patient_id",
    as: "LamaConsent",
    onDelete: "CASCADE",
  });
  LamaConsent.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(Admission, {
    foreignKey: "patient_id",
    as: "Admission",
    onDelete: "CASCADE",
  });
  Admission.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(Xray, {
    foreignKey: "patient_id",
    as: "Xray",
    onDelete: "CASCADE",
  });
  Xray.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(Pocus, {
    foreignKey: "patient_id",
    as: "Pocus",
    onDelete: "CASCADE",
  });
  Pocus.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(Ecg, {
    foreignKey: "patient_id",
    as: "Ecg",
    onDelete: "CASCADE",
  });
  Ecg.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(BloodGas, {
    foreignKey: "patient_id",
    as: "BloodGas",
    onDelete: "CASCADE",
  });
  BloodGas.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(Troponin, {
    foreignKey: "patient_id",
    as: "Troponin",
    onDelete: "CASCADE",
  });
  Troponin.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(OtherTest, {
    foreignKey: "patient_id",
    as: "OtherTest",
    onDelete: "CASCADE",
  });
  OtherTest.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(CtScan, {
    foreignKey: "patient_id",
    as: "CtScan",
    onDelete: "CASCADE",
  });
  CtScan.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(Cbc, {
    foreignKey: "patient_id",
    as: "Cbc",
    onDelete: "CASCADE",
  });
  Cbc.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(Coagulation, {
    foreignKey: "patient_id",
    as: "Coagulation",
    onDelete: "CASCADE",
  });
  Coagulation.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(lft, {
    foreignKey: "patient_id",
    as: "lft",
    onDelete: "CASCADE",
  });
  lft.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(Rft, {
    foreignKey: "patient_id",
    as: "Rft",
    onDelete: "CASCADE",
  });
  Rft.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(Treatment, {
    foreignKey: "patient_id",
    as: "Treatment",
    onDelete: "CASCADE",
  });
  Treatment.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(UrineTest, {
    foreignKey: "patient_id",
    as: "UrineTest",
    onDelete: "CASCADE",
  });
  UrineTest.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(VitalRecording, {
    foreignKey: "patient_id",
    as: "VitalRecording",
    onDelete: "CASCADE",
  });
  VitalRecording.belongsTo(Patient, {
    foreignKey: "patient_id",
    as: "patient",
  });

  Patient.hasMany(InOut, {
    foreignKey: "patient_id",
    as: "InOut",
    onDelete: "CASCADE",
  });
  InOut.belongsTo(Patient, { foreignKey: "patient_id", as: "patient" });

  Patient.hasMany(HandoverNotes, {
    foreignKey: "patientId",
    as: "handoverNotes",
    onDelete: "CASCADE",
  });
  HandoverNotes.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

  Patient.hasMany(TreatmentNursing, {
    foreignKey: "patientId",
    as: "treatmentNursing",
    onDelete: "CASCADE",
  });
  TreatmentNursing.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
  });

  Patient.hasMany(EdConsultation, {
    foreignKey: "patientId",
    as: "edConsultations",
    onDelete: "CASCADE",
  });
  EdConsultation.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

  Patient.hasMany(DiagnosisRecord, {
    foreignKey: "patientId",
    as: "DiagnosisRecords",
    onDelete: "CASCADE",
  });
  DiagnosisRecord.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
  });

  Patient.hasMany(Enc, {
    foreignKey: "patientId",
    as: "encRecords",
    onDelete: "CASCADE",
  });
  Enc.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

  Patient.hasMany(Consultation, {
    foreignKey: "patientId",
    as: "encConsultations",
    onDelete: "CASCADE",
  });
  Consultation.belongsTo(Patient, {
    foreignKey: "patientId",
    as: "patient",
  });

  associationsInitialized = true;
};

initializeAssociations();

module.exports = {
  sequelize,
  User,
  Patient,
  PatientTriage,
  PrimaryAssessment,
  GeneralEmergencyCare,
  TraumaTemplate,
  ProgressNotes,
  TransferOut,
  DischargeSummary,
  LamaConsent,
  Admission,
  Xray,
  Pocus,
  Ecg,
  BloodGas,
  Troponin,
  OtherTest,
  CtScan,
  Cbc,
  Coagulation,
  lft,
  Rft,
  Treatment,
  UrineTest,
  VitalRecording,
  InOut,
  HandoverNotes,
  TreatmentNursing,
  EdConsultation,
  DiagnosisRecord,
  Enc,
  Consultation,
};
