const fs = require('fs')
const path = require('path')
const Document = require('../models/Document')
const { sendError } = require('../utils/errorResponse')
const { uploadToCloudinary } = require('../services/documentService')

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'Please upload a file')
    }

    const localUrl = `/uploads/${req.file.filename}`
    const cloudinaryResult = await uploadToCloudinary(req.file.path)
    const fileUrl = cloudinaryResult?.secure_url || localUrl

    const document = await Document.create({
      userId: req.user._id,
      fileName: req.body.fileName || req.file.originalname,
      fileUrl,
      cloudinaryPublicId: cloudinaryResult?.public_id || '',
      cvType: req.body.cvType || req.body.documentType || '',
      documentType: req.body.documentType || req.body.cvType || 'CV',
      linkedApplicationId: req.body.linkedApplicationId || undefined,
      uploadedAt: new Date(),
      versionHistory: [
        {
          fileName: req.body.fileName || req.file.originalname,
          fileUrl,
          cloudinaryPublicId: cloudinaryResult?.public_id || '',
          uploadedAt: new Date(),
        },
      ],
    })

    return res.status(201).json(document)
  } catch (error) {
    return sendError(res, 500, 'Failed to upload document', [{ message: error.message }])
  }
}

const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id })
      .populate('linkedApplicationId', 'companyName jobTitle')
      .sort({ uploadedAt: -1 })
    return res.status(200).json(documents)
  } catch (error) {
    return sendError(res, 500, 'Failed to get documents', [{ message: error.message }])
  }
}

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({ _id: req.params.id, userId: req.user._id })

    if (!document) {
      return sendError(res, 404, 'Document not found')
    }

    if (document.fileUrl) {
      const filePath = path.join(__dirname, '..', document.fileUrl)

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    return res.status(200).json({ success: true, message: 'Document deleted' })
  } catch (error) {
    return sendError(res, 500, 'Failed to delete document', [{ message: error.message }])
  }
}

module.exports = {
  deleteDocument,
  getDocuments,
  uploadDocument,
}
