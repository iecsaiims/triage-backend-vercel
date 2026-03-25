const fs = require("fs");
const path = require("path");
const multer = require("multer");
const {
  storageMode,
  LOCAL_STORAGE,
} = require("../services/storageService");

const localUploadPath = path.resolve(
  process.cwd(),
  process.env.UPLOAD_DIR || "uploads"
);

if (storageMode === LOCAL_STORAGE && !fs.existsSync(localUploadPath)) {
  fs.mkdirSync(localUploadPath, { recursive: true });
}

const storage =
  storageMode === LOCAL_STORAGE
    ? multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, localUploadPath);
        },
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      })
    : multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only jpeg, jpg, png, and pdf files are allowed.")
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_UPLOAD_SIZE_BYTES || 4194304),
  },
});

module.exports = upload;
