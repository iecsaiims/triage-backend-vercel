const {
  buildStoredFilename,
  persistFile,
} = require("../services/storageService");

function renameUploadedFile(fieldName = "name") {
  return async (req, res, next) => {
    if (!req.file) return next();

    try {
      const storedFilename = buildStoredFilename(
        req.body[fieldName],
        req.file.originalname
      );
      const persistedFilename = await persistFile(req.file, storedFilename);

      req.file.filename = persistedFilename;
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = renameUploadedFile;
