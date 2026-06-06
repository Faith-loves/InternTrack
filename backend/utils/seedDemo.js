const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const connectDB = require('../config/db')
const Application = require('../models/Application')
const Company = require('../models/Company')
const Document = require('../models/Document')
const Interview = require('../models/Interview')
const User = require('../models/User')

dotenv.config()

const seedDemo = async () => {
  await connectDB()

  const email = 'demo@interntrack.com'
  const password = 'DemoPassword123'
  let user = await User.findOne({ email })

  if (!user) {
    user = await User.create({
      fullName: 'Demo Recruiter',
      email,
      password: await bcrypt.hash(password, 10),
      preferredRole: 'Frontend Intern',
      location: 'Remote',
      portfolioLink: 'https://demo.interntrack.dev',
      linkedinLink: 'https://linkedin.com/in/interntrack-demo',
      githubLink: 'https://github.com/interntrack-demo',
    })
  }

  await Promise.all([
    Application.deleteMany({ userId: user._id }),
    Company.deleteMany({ userId: user._id }),
    Interview.deleteMany({ userId: user._id }),
    Document.deleteMany({ userId: user._id }),
  ])

  const applications = await Application.insertMany([
    {
      userId: user._id,
      companyName: 'BrightStack',
      jobTitle: 'Frontend Intern',
      jobType: 'internship',
      location: 'Remote',
      applicationLink: 'https://brightstack.example/jobs/frontend-intern',
      dateApplied: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      status: 'applied',
      applicationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      applicationSource: 'LinkedIn',
      salaryMin: 30000,
      salaryMax: 42000,
      salaryCurrency: 'USD',
      jobPostingArchive: 'Frontend internship focused on React, accessibility, and dashboard UI work.',
      recruiterName: 'Maya Chen',
      recruiterEmail: 'maya.chen@brightstack.example',
      cvUsed: 'Frontend Resume v2.pdf',
      coverLetterUsed: 'BrightStack Cover Letter.pdf',
      notes: 'Follow up because this has been applied for more than 7 days.',
      followUpDate: new Date(),
      statusHistory: [{ status: 'applied', changedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) }],
    },
    {
      userId: user._id,
      companyName: 'Nova Labs',
      jobTitle: 'Product Design Intern',
      jobType: 'internship',
      location: 'Lagos, Nigeria',
      applicationLink: 'https://novalabs.example/careers/product-design-intern',
      dateApplied: new Date(),
      status: 'assessment',
      applicationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      applicationSource: 'Company Website',
      salaryMin: 25000,
      salaryMax: 35000,
      salaryCurrency: 'USD',
      jobPostingArchive: 'Design internship with portfolio assessment followed by a panel interview.',
      recruiterName: 'Daniel Okoro',
      recruiterEmail: 'daniel.okoro@novalabs.example',
      cvUsed: 'Design Resume.pdf',
      coverLetterUsed: 'Nova Labs Letter.pdf',
      notes: 'Prepare portfolio review notes.',
      followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      statusHistory: [
        { status: 'applied', changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { status: 'assessment', changedAt: new Date() },
      ],
    },
    {
      userId: user._id,
      companyName: 'GreenByte',
      jobTitle: 'Software Engineering Intern',
      jobType: 'internship',
      location: 'Remote',
      applicationLink: 'https://greenbyte.example/jobs/software-engineering-intern',
      dateApplied: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      status: 'offer',
      applicationDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      applicationSource: 'Referral',
      salaryMin: 45000,
      salaryMax: 55000,
      salaryCurrency: 'USD',
      jobPostingArchive: 'Software engineering internship with backend APIs, testing, and mentorship.',
      recruiterName: 'Leo Martins',
      recruiterEmail: 'leo.martins@greenbyte.example',
      cvUsed: 'Software Resume.pdf',
      coverLetterUsed: 'GreenByte Letter.pdf',
      notes: 'Offer received. Compare stipend and mentorship.',
      statusHistory: [
        { status: 'applied', changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        { status: 'assessment', changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { status: 'interview', changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { status: 'offer', changedAt: new Date() },
      ],
    },
  ])

  await Company.insertMany([
    {
      userId: user._id,
      companyName: 'BrightStack',
      industry: 'Software',
      website: 'https://brightstack.example',
      location: 'Remote',
      email: 'careers@brightstack.example',
      phone: '+234 800 000 0101',
      linkedin: 'https://linkedin.com/company/brightstack',
      notes: 'Frontend-heavy product team.',
    },
    {
      userId: user._id,
      companyName: 'Nova Labs',
      industry: 'Design Technology',
      website: 'https://novalabs.example',
      location: 'Lagos, Nigeria',
      email: 'talent@novalabs.example',
      phone: '+234 800 000 0202',
      linkedin: 'https://linkedin.com/company/novalabs',
      notes: 'Strong product design internship fit.',
    },
  ])

  await Interview.create({
    userId: user._id,
    applicationId: applications[1]._id,
    companyName: 'Nova Labs',
    jobTitle: 'Product Design Intern',
    date: new Date(),
    time: '10:00',
    interviewType: 'Portfolio review',
    interviewLink: 'https://meet.example.com/demo',
    location: 'Remote',
    preparationNotes: 'Prepare two case studies and questions about the design process.',
  })

  await Document.create({
    userId: user._id,
    fileName: 'Demo Frontend Resume.pdf',
    fileUrl: '/uploads/demo-resume.pdf',
    cvType: 'CV',
    usedCount: 2,
  })

  console.log(`Demo account ready: ${email} / ${password}`)
  process.exit(0)
}

seedDemo().catch((error) => {
  console.error(error)
  process.exit(1)
})
