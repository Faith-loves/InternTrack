const Company = require('../models/Company')
const { sendError } = require('../utils/errorResponse')

const createCompany = async (req, res) => {
  try {
    const company = await Company.create({
      ...req.body,
      userId: req.user._id,
    })

    return res.status(201).json(company)
  } catch (error) {
    return sendError(res, 500, 'Failed to create company', [{ message: error.message }])
  }
}

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.user._id }).sort({ createdAt: -1 })
    return res.status(200).json(companies)
  } catch (error) {
    return sendError(res, 500, 'Failed to get companies', [{ message: error.message }])
  }
}

const getCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ _id: req.params.id, userId: req.user._id })

    if (!company) {
      return sendError(res, 404, 'Company not found')
    }

    return res.status(200).json(company)
  } catch (error) {
    return sendError(res, 500, 'Failed to get company', [{ message: error.message }])
  }
}

const updateCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true },
    )

    if (!company) {
      return sendError(res, 404, 'Company not found')
    }

    return res.status(200).json(company)
  } catch (error) {
    return sendError(res, 500, 'Failed to update company', [{ message: error.message }])
  }
}

const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndDelete({ _id: req.params.id, userId: req.user._id })

    if (!company) {
      return sendError(res, 404, 'Company not found')
    }

    return res.status(200).json({ success: true, message: 'Company deleted' })
  } catch (error) {
    return sendError(res, 500, 'Failed to delete company', [{ message: error.message }])
  }
}

module.exports = {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompany,
  updateCompany,
}
