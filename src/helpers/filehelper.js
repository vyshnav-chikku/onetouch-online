const multer = require("multer");
const path = require("path");

const cookieParser = require("cookie-parser"); //this is used for getting req.cookies in middleware otherwise we dont get cookies in req in middleware

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); //file upload to uploads folder
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
    console.log("storage");
  },
});
const fileFilter = (req, file, cb, next) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "text/css" ||
    file.mimetype === "text/csv" ||
    file.mimetype === "text/html" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "text/javascript" ||
    file.mimetype === "application/json" ||
    file.mimetype === "	text/javascript" ||
    file.mimetype === "application/vnd.oasis.opendocument.spreadsheet" ||
    file.mimetype === "application/vnd.oasis.opendocument.text" ||
    file.mimetype === "font/otf" ||
    file.mimetype === "application/x-httpd-php" ||
    file.mimetype === "application/vnd.ms-powerpoint" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    file.mimetype === "text/plain" ||
    file.mimetype === "application/xhtml+xml" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype === "application/zip" ||
    file.mimetype === "" ||
    file.mimetype === "application/x-7z-compressed" ||
    file.mimetype === "application/vnd.ms-excel"
  ) {
    cb(null, true);
    console.log("cb true");
  } else {
    cb(null, false);
    console.log("cb false");
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = { upload };
