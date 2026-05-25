import cloudinary from "../config/cloudinary.js";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

/**
 * Upload a multer file (memory or disk) to Cloudinary as a raw asset (PDF/DOC).
 */
export function uploadResumeFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided"));
    }

    const options = {
      resource_type: "raw",
      folder: "job-portal/applications",
      use_filename: true,
      unique_filename: true,
    };

    const onComplete = (error, result) => {
      if (error) return reject(error);
      resolve(result);
    };

    if (file.buffer) {
      const stream = cloudinary.uploader.upload_stream(options, onComplete);
      stream.end(file.buffer);
      return;
    }

    if (file.path) {
      cloudinary.uploader.upload(file.path, options, onComplete);
      return;
    }

    reject(new Error("Unsupported file upload"));
  });
}
