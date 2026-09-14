import multer from "multer";
import path from "path";
import fs from "fs";

// Create upload folders if they don't exist
const examUploadPath = "uploads/exams";
const submissionUploadPath = "uploads/submissions";

fs.mkdirSync(examUploadPath, { recursive: true });
fs.mkdirSync(submissionUploadPath, { recursive: true });


// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    // If uploading a question paper
    if (file.fieldname === "questionPaper") {
      cb(null, examUploadPath);
    }

    // If uploading a student answer
    else if (file.fieldname === "answerFile") {
      cb(null, submissionUploadPath);
    }

    else {
      cb(new Error("Invalid file field"));
    }
  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1E9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  }
});


// File type validation
const fileFilter = (req, file, cb) => {

  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx"
  ];

  const extension =
    path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOC, and DOCX files are allowed"
      ),
      false
    );
  }
};


// Multer configuration
const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

export default upload;