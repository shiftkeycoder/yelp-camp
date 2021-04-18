const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');
const { CLD_CLOUD_NAME, CLD_API_KEY, CLD_API_SECRET, CLD_API_ENV } = process.env;
cloudinary.config({
  cloud_name: CLD_CLOUD_NAME,
  api_key: CLD_API_KEY,
  api_secret: CLD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'YelpCamp',
    allowedFormats: ['jpeg', 'png', 'jpg']
  }
});

module.exports = { cloudinary, storage };