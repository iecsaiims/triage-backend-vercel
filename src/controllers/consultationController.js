const EdConsultation = require('../models/edConsultation');
const fileService = require('../services/fileService');
exports.createEdConsultation = async (req, res) => {
  try {
    // if (!req.file) {
    //   return res.status(400).json({ error: 'Consultation image is required.' });
    // }
    Object.keys(req.body).forEach(key => {
      if (req.body[key] === '') {
        req.body[key] = null;
      }
    });
    const consultation = await EdConsultation.create({
      ...req.body,
      consultationImage: req.file ? req.file.filename : null,
      submittedBy: req.user.user,
      designation:req.user.designation
    });
    const response = fileService.attachFileUrl(consultation, req, 'consultationImage');
    return res.status(201).json({
      message: 'Consultation record created successfully',
      data: response
    });
  } catch (error) {
    console.error('Error creating Consultation record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getEdConsultationRecords = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) {
      return res.status(400).json({ message: 'Patient ID is required' });
    }
    const records = await EdConsultation.findAll({
      where: { patient_id: patientId }
    });
    if (!records.length) {
      return res.status(404).json({ message: 'No Consultation records found for this patient' });
    }
    const response = records.map(record =>
      fileService.attachFileUrl(record, req, 'consultationImage')
    );
    return res.status(200).json({ data: response });
  } catch (err) {
    console.error('Error fetching Consultation records:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getAllEdConsultationRecords = async (req, res) => {
  try {
    const records = await EdConsultation.findAll();

    if (!records || records.length === 0) {
      return res.status(404).json({
        message: "No consultation records found for this patient"
      });
    }

    return res.status(200).json({ data: records });

  } catch (err) {
    console.error("Error fetching consultation records:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
