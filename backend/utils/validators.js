const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const isUrl = (value) => {
  if (!value) return true

  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

const requireFields = (body, fields) => {
  const missing = fields.filter((field) => !body[field])
  return missing.length ? `${missing.join(', ')} required` : ''
}

module.exports = {
  isEmail,
  isUrl,
  requireFields,
}
