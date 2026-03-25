const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const { put, get } = require("@vercel/blob");

const LOCAL_STORAGE = "local";
const BLOB_STORAGE = "blob";

const resolveStorageMode = () => {
  if (process.env.FILE_STORAGE) {
    return process.env.FILE_STORAGE.toLowerCase();
  }

  return process.env.VERCEL ? BLOB_STORAGE : LOCAL_STORAGE;
};

const storageMode = resolveStorageMode();

const getBlobAccess = () => process.env.BLOB_ACCESS || "private";

const getUploadsDirectory = () =>
  path.resolve(process.cwd(), process.env.UPLOAD_DIR || "uploads");

const ensureUploadsDirectory = async () => {
  await fs.promises.mkdir(getUploadsDirectory(), { recursive: true });
};

const sanitizeFilenamePart = (value) =>
  String(value || "unknown")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "") || "unknown";

const buildStoredFilename = (sourceName, originalName) => {
  const safeSourceName = sanitizeFilenamePart(sourceName);
  const safeOriginalName = sanitizeFilenamePart(originalName);
  return `${safeSourceName}-${Date.now()}-${safeOriginalName}`;
};

const persistFile = async (file, storedFilename) => {
  if (!file) {
    return null;
  }

  if (storageMode === BLOB_STORAGE) {
    if (!file.buffer) {
      throw new Error("Blob storage requires memory uploads.");
    }

    const blob = await put(storedFilename, file.buffer, {
      access: getBlobAccess(),
      addRandomSuffix: true,
      contentType: file.mimetype,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return blob.pathname;
  }

  await ensureUploadsDirectory();

  const targetPath = path.join(getUploadsDirectory(), storedFilename);

  if (file.buffer) {
    await fs.promises.writeFile(targetPath, file.buffer);
  } else if (file.path && file.path !== targetPath) {
    await fs.promises.rename(file.path, targetPath);
  }

  return storedFilename;
};

const getLocalFilePath = (storedFilename) =>
  path.join(getUploadsDirectory(), storedFilename);

const sendStoredFile = async (storedFilename, res) => {
  if (storageMode === BLOB_STORAGE) {
    const blob = await get(storedFilename, {
      access: getBlobAccess(),
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!blob) {
      return false;
    }

    const downloadUrl = blob.downloadUrl || blob.url;

    if (!downloadUrl) {
      throw new Error("Blob download URL is missing.");
    }

    const response = await fetch(downloadUrl);

    if (!response.ok || !response.body) {
      return false;
    }

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/octet-stream"
    );

    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${path.basename(blob.pathname || storedFilename)}"`
    );

    Readable.fromWeb(response.body).pipe(res);
    return true;
  }

  const filePath = getLocalFilePath(storedFilename);

  if (!fs.existsSync(filePath)) {
    return false;
  }

  res.sendFile(filePath);
  return true;
};

module.exports = {
  LOCAL_STORAGE,
  BLOB_STORAGE,
  storageMode,
  buildStoredFilename,
  persistFile,
  sendStoredFile,
};
