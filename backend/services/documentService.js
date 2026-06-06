const { cloudinary, hasCloudinaryConfig } = require('../config/cloudinary')

const uploadToCloudinary = async (filePath, folder = 'interntrack/documents') => {
  if (!hasCloudinaryConfig) {
    return null
  }

  return cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: 'auto',
  })
}

module.exports = {
  uploadToCloudinary,
}
