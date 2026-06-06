const test = require('node:test')
const assert = require('node:assert/strict')
const { APPLICATION_STATUS, APPLICATION_STATUSES } = require('../utils/constants')
const { sendError } = require('../utils/errorResponse')

test('application statuses include assessment lifecycle stage', () => {
  assert.equal(APPLICATION_STATUS.ASSESSMENT, 'assessment')
  assert.ok(APPLICATION_STATUSES.includes('assessment'))
})

test('sendError returns consistent payload shape', () => {
  const response = {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.payload = payload
      return this
    },
  }

  sendError(response, 400, 'Validation failed', [{ field: 'email', message: 'Email is required' }])

  assert.equal(response.statusCode, 400)
  assert.deepEqual(response.payload, {
    success: false,
    message: 'Validation failed',
    errors: [{ field: 'email', message: 'Email is required' }],
  })
})
