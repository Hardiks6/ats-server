/**
 * Summary: This file is used to managed function that are managing AWS S3 bucket and file functionality
 */
import moment from "moment";
import random from "./random";

const AWS = require("aws-sdk");
const fs = require("fs");
const { isValidString, isValidInteger } = require("./validation");

const sizeOf = require("image-size");

// Initialize s3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.REGION
});

/**
 * Summary: This function is used to read file from AWS S3 bucket
 * @param {*} input
 */
exports.getFileFromS3Bucket = function (input) {
  try {
    // Validate input data
    if (!input || !isValidString(input.key)) return false;

    // Get file from AWS S3
    var params = {
      Bucket:
        input.Bucket && isValidString(input.Bucket)
          ? params.Bucket
          : process.env.BUCKET_NAME,
      Key: input.key
    };
    s3.getObject(params, function (err, data) {
      if (err) return "";
    });
  } catch (e) {
    return false;
  }
};



/**
 * Summary: This function is used to upload specific file to s3 bucket and returns uploaded file information to retrive from s3 bucket.
 * @param {*} input
 */
exports.uploadFile = async function (input) {
  try {
    // Validate input data
    if (
      input == null ||
      input.length < 1 ||
      (input && !isValidString(input.file.name))
    )
      return false;
    // Configure the file stream and obtain the upload parameters
    var fileStream = fs.createReadStream(input.file.path);
    fileStream.on("error", function (err) {
      return false;
    });

    // Set parameter to upload file to s3 bucket
    let randomName = random(5, "alphanumeric");
    var fileName =
      randomName +
      moment().format("YYYYMMDDhhmmss") +
      input.file.name.substring(input.file.name.lastIndexOf("."));
    const uploadParams = {
      Bucket:
        input.Bucket && isValidString(input.Bucket)
          ? params.Bucket
          : process.env.BUCKET_NAME,
      Body: fileStream,
      Key: input.filePath ? input.filePath + fileName : fileName

    };
    // Upload file to s3 bucket
    // const fileResponse = await this.uploadFileToS3Bucket(uploadParams);

    // Upload file to s3 bucket
    return new Promise(function (resolve, reject) {
      s3.upload(uploadParams, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  } catch (e) {
    return false;
  }
};

/**
 * Summary: This function is used to upload specific file to s3 bucket
 * @param {*} uploadParams
 */
exports.uploadFileToS3Bucket = async function (uploadParams) {
  try {
    // Upload file to s3 bucket
    s3.upload(uploadParams, function (err, data) {
      // Return on error
      if (err) return false;

      // Return actual file path from s3 bucket
      if (data) return data;
    });
  } catch (e) {
    return false;
  }
};

/**
 * Summary: This function is used to upload specific file to s3 bucket and returns uploaded file information to retrive from s3 bucket.
 * @param {*} input
 */
exports.uploadFileFromPath = async function (input, fileName) {
  try {
    // Validate input data
    if (input == null) return false;

    // Set parameter to upload file to s3 bucket
    let randomName = random(5, "alphanumeric");
    var fileName =
      randomName +
      moment().format("YYYYMMDDhhmmss") +
      fileName.substring(fileName.lastIndexOf("."));
    const uploadParams = {
      Bucket:
        input.Bucket && isValidString(input.Bucket)
          ? params.Bucket
          : process.env.BUCKET_NAME,
      Body: input.file,
      Key: input.filePath ? input.filePath + fileName : fileName
    };

    // Upload file to s3 bucket
    return new Promise(function (resolve, reject) {
      s3.upload(uploadParams, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  } catch (e) {
    return false;
  }
};


// const isValidString = (str) => typeof str === 'string' && str.trim() !== '';

// Function to extract bucket and key from S3 URL
const extractBucketAndKeyFromUrl = (url) => {
  const urlPattern = /^https:\/\/([^\/]+)\/(.+)$/;
  const match = url.match(urlPattern);
  if (match) {
    const key = match[2];
    return { key };
  }
  throw new Error('Invalid S3 URL');
};



/**
 * Summary: This function is used to delete specific file from AWS S3 bucket
 * @param {*} input
 */
exports.deleteFileFromS3 = async function (input) {
  try {
    // Validate input data
    if (!input || input.length < 1 || !isValidString(input.Key)) return false;

    let key;

    if (input.Key.startsWith('http')) {
      // If input.Key is a full URL, extract the bucket and key
      const extracted = extractBucketAndKeyFromUrl(input.Key);
      key = extracted.key;
    } else {
      // Otherwise, use the provided bucket and key
      key = input.Key;
    }

    // Set parameter to delete specific file
    var deleteParams = {
      Bucket:
        input.Bucket && isValidString(input.Bucket)
          ? input.Bucket
          : process.env.BUCKET_NAME,
      Key: key
    };

    // Delete file from S3
    const data = await s3.deleteObject(deleteParams).promise();
    return true; // deleted

  } catch (e) {
    return false;
  }
};

/**
 * Summary: This method validates image height/width and return response based on it.
 * @param {*} height
 * @param {*} width
 */
exports.validateImageSize = async function (imagePath, height, width) {
  // Validate input
  if (!isValidInteger(height) || !isValidInteger(width)) return false;

  // Check for image size
  var dimensions = await sizeOf(imagePath);
  if (dimensions.width > width || dimensions.height > height) return false;

  return true;
};
