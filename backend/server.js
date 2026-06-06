const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')
const connectDB = require('./config/db')
const analyticsRoutes = require('./routes/analyticsRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const authRoutes = require('./routes/authRoutes')
const companyRoutes = require('./routes/companyRoutes')
const contactRoutes = require('./routes/contactRoutes')
const documentRoutes = require('./routes/documentRoutes')
const interviewRoutes = require('./routes/interviewRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/api', (req, res) => {
  res.json({ message: 'API is running' })
})

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/contact', contactRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/companies', companyRoutes)
app.use('/api/interviews', interviewRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/notifications', notificationRoutes)
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
