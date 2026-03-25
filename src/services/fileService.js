// For single field (most use cases)
exports.attachFileUrl = (record, req, field) => {
  if (!record || !record[field]) return record;

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return {
    ...record.toJSON(),
    [`${field}_url`]: `${baseUrl}/api/files/${encodeURIComponent(record[field])}`
  };
};
