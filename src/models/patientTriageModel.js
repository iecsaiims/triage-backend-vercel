const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const Patient = require('./patientModel');
const istTimestamps = require('./baseModel.js');

const PatientTriage = sequelize.define(
  'PatientTriage',
  istTimestamps({
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spo2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pulse: {                     
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dbp: {                      
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sbp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rr: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    temp: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    emergencyType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    triage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     traumaType: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
    triageNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    arrivalMode: {              
      type: DataTypes.STRING,
      allowNull: false,
    },
    referralStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complaints: {              
      type: DataTypes.JSON,
      allowNull: true,
    },
    decisionPayload: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    protocolVersion: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    autoTriageCategory: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    autoTriageReasons: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    triageTimeStamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.INTEGER,
      references: {
        model: Patient,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    submittedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }),
  {
    tableName: 'patient_triages',
    underscored: true,
  }
);

module.exports = PatientTriage;
