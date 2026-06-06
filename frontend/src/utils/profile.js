export function getProfileCompletion(user) {
  const fields = [
    ['Name', user?.fullName],
    ['Email', user?.email],
    ['Preferred role', user?.preferredRole],
    ['Location', user?.location],
    ['Portfolio', user?.portfolioLink],
    ['LinkedIn', user?.linkedinLink],
    ['GitHub', user?.githubLink],
  ]
  const completed = fields.filter(([, value]) => Boolean(value)).length
  const percent = Math.round((completed / fields.length) * 100)
  const missing = fields.filter(([, value]) => !value).map(([label]) => label)

  return { completed, total: fields.length, percent, missing }
}
