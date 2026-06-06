import test from 'node:test'
import assert from 'node:assert/strict'
import { getProfileCompletion } from './profile.js'

test('getProfileCompletion calculates completed profile percentage', () => {
  const result = getProfileCompletion({
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    preferredRole: 'Frontend Intern',
  })

  assert.equal(result.completed, 3)
  assert.equal(result.total, 7)
  assert.equal(result.percent, 43)
  assert.ok(result.missing.includes('Location'))
})
