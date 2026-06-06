# InternTrack

InternTrack is a full-stack internship and job application tracker. It helps students and early-career candidates keep their job search organized by tracking applications, companies, interviews, documents, reminders, analytics, and profile details from one dashboard.

Instead of spreading application notes across spreadsheets, inboxes, and reminders, InternTrack gives users one place to save every opportunity, monitor follow-ups, prepare for interviews, and understand their progress.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router DOM, Axios
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose
- Authentication: JWT access tokens with refresh-token sessions
- File upload: Multer local uploads for now
- Deployment target: Vercel frontend, Render backend

## Screenshots

Live demo: not deployed yet. After deployment, add the Vercel frontend URL here.

Landing page:

![Landing page](docs/screenshots/landing.svg)

Dashboard:

![Dashboard](docs/screenshots/dashboard.svg)

Mobile view:

![Mobile view](docs/screenshots/mobile.svg)

## Project Structure

```text
InternTrack/
  frontend/
    src/
      components/
      layouts/
      pages/
      services/
      utils/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    uploads/
    server.js
```

## Features

Authentication:

- User signup
- User login
- Form validation for bad or incomplete inputs
- JWT token storage
- Protected frontend routes
- Protected backend routes
- Backend ownership checks so users only see their own data
- Login and signup rate limiting
- Refresh-token session handling
- Get current user
- Update profile
- Logout with confirmation

Applications:

- Create application
- View all applications from MongoDB
- Search applications by company or role
- Filter applications by status
- Sort applications by newest, oldest, status, or company
- Paginate application records
- Application timeline: Applied, Assessment, Interview, Offer
- Status history tracking
- Application deadline tracking
- Job posting archive
- Rejection reason tracking
- Salary tracking
- Application source tracking, including LinkedIn, Indeed, Company Website, and Referral
- View one application by ID
- Edit application
- Delete application with confirmation
- Role-based status colors
- Track company name, job title, job type, location, links, recruiter details, CV used, cover letter used, notes, and follow-up date

Companies:

- Create company
- View all companies
- Store industry, website, location, email, phone, LinkedIn, and notes

Interviews:

- Create interview
- View upcoming interviews
- Link interviews to applications
- Store date, time, type, link/location, and preparation notes
- Generate interview thank-you email

Documents:

- Upload documents with Multer
- Cloudinary upload support when Cloudinary environment variables are configured
- CV, cover letter, portfolio, certificate, and other document categories
- Link a CV or document to the application where it was used
- Document version history metadata
- Reject unsupported file types
- Enforce upload size limits
- View uploaded documents
- Delete documents
- Track file name, file URL, CV type, upload date, and usage count

Dashboard and Analytics:

- Total applications
- Pending applications
- Interviews
- Offers
- Rejections
- Ghosted applications
- Response rate
- Follow-ups due
- Follow-up reminders for today or overdue dates
- Reminder when an application is still `Applied` after 7 days
- Interview warning for interviews happening today or this week
- Follow-up email generator using company name, job title, and recruiter name
- Response rate, offer rate, and interview conversion rate
- Monthly application trend charts
- Best-performing CV analysis
- Company response rankings

Interviews:

- Interview preparation checklist
- Interview notes
- Interview feedback
- Interview outcome tracking
- Google Calendar event links

Notifications and reminders:

- Smart follow-up reminders
- Interview reminders
- Overdue application and deadline reminders
- Notification center

UI and UX:

- Responsive layout for mobile and desktop
- Mobile-stacked dashboard cards
- Mobile-friendly forms
- Tables become card-style rows on small screens
- Frontend 404 page
- Loading states
- Skeleton loaders
- Toast notifications
- Success page for completed workflows
- First-time user onboarding
- Profile completion progress
- Dashboard section customization
- Professional public landing page
- Contact form
- Privacy policy and terms of service pages
- Custom favicon
- SEO and Open Graph metadata
- Error messages
- Success messages
- Empty states

Backend reliability:

- Central error handling middleware
- Backend 404 route
- Protected CRUD routes
- Request validation for important forms
- Consistent error response format: `{ success, message, errors }`
- User ownership checks for private records
- Helmet security headers
- Morgan request logging
- Express Rate Limit protection on login and signup
- MongoDB indexes for application filtering and user-owned data
- Backend service layer for Cloudinary document upload handling
- Health route for production monitoring: `GET /api/health`
- Render logs can be used for backend debugging

## Setup Instructions

### 1. Clone or open the project

Open the project folder:

```powershell
cd C:\Users\HP\Desktop\InternTrack
```

### 2. Backend Setup

```powershell
cd C:\Users\HP\Desktop\InternTrack\backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=15m
```

You can copy from `backend/.env.example` and replace the placeholder values.

For separated environments, use:

```text
backend/.env.development.example
backend/.env.production.example
frontend/.env.development.example
frontend/.env.production.example
```

Start the backend:

```powershell
npm run dev
```

The API test route is:

```text
GET http://localhost:5000/api
```

### 3. Frontend Setup

```powershell
cd C:\Users\HP\Desktop\InternTrack\frontend
npm install
npm run dev
```

By default, the frontend API service uses:

```text
http://localhost:5000/api
```

To override it, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

You can copy from `frontend/.env.example` if you want a clean starting point.

### 4. MongoDB Atlas Checklist

In MongoDB Atlas:

- Create a database user.
- Add your IP address in **Network Access**.
- For development, `0.0.0.0/0` can be used temporarily.
- Copy the MongoDB connection string into `backend/.env`.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/interntrack?retryWrites=true&w=majority
```

### 5. Test the app

Backend:

```text
http://localhost:5000/api
```

Frontend:

```text
http://localhost:5173
```

### 6. Demo Account and Sample Data

The project includes a seed script that creates a recruiter-friendly demo account and sample records:

```text
Email: demo@interntrack.com
Password: DemoPassword123
```

Run the seed from the backend folder:

```powershell
cd C:\Users\HP\Desktop\InternTrack\backend
npm run seed
```

If MongoDB Atlas rejects the seed command, open **Network Access** in Atlas and add your current IP address. The seed script needs the same Atlas access as the backend server.

## API Routes

Full API documentation is available in [docs/API.md](docs/API.md).

Auth:

```text
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
PUT  /api/auth/me
```

Applications:

```text
GET    /api/applications
POST   /api/applications
GET    /api/applications/:id
PUT    /api/applications/:id
DELETE /api/applications/:id
```

Companies:

```text
GET    /api/companies
POST   /api/companies
GET    /api/companies/:id
PUT    /api/companies/:id
DELETE /api/companies/:id
```

Interviews:

```text
GET    /api/interviews
POST   /api/interviews
GET    /api/interviews/:id
PUT    /api/interviews/:id
DELETE /api/interviews/:id
```

Documents:

```text
GET    /api/documents
POST   /api/documents/upload
DELETE /api/documents/:id
```

Analytics:

```text
GET /api/analytics
```

## Notes

- Private routes require a JWT token in the `Authorization` header.
- Access tokens are short-lived. Refresh tokens keep users signed in across page refreshes until logout or expiry.
- Uploaded files are stored in `backend/uploads` for now.
- Cloudinary can be added later when the upload flow is ready for production storage.
- Cloudinary is already wired behind environment variables. Without Cloudinary keys, uploads continue using local Multer storage.
- SMTP and OpenAI environment placeholders are included for production email verification/reset emails and AI features.
- Password change can be added later as an extra polish feature.
- Forgot password can be added later as an advanced authentication feature.
- Replace the live demo placeholder with the deployed Vercel URL after launch.

## Quality Checks

Frontend:

```powershell
cd frontend
npm run lint
npm run build
npm run test
```

The frontend build output is written to `frontend/dist-check`.

Backend:

```powershell
cd backend
node --check server.js
npm run test
```

## Production Monitoring

- Use `GET /api/health` to confirm the Render backend is alive.
- Use Render logs for backend errors, request logs, and MongoDB connection issues.
- Use Vercel deployment logs for frontend build problems.
- Use Vercel Analytics only if it is available on the free plan in your account.

## Final Testing Checklist Before Deployment

- Create a fresh user account.
- Log in with the fresh account.
- Log in with the demo recruiter account after running `npm run seed`.
- Refresh the browser on a protected page and confirm the user stays logged in.
- Confirm logout asks for confirmation and clears the saved token and user data.
- Test invalid signup, login, application, company, interview, document, and settings inputs.
- Confirm invalid or expired tokens return a `401` response.
- Confirm one user cannot open another user's application, company, interview, or document.
- Create, edit, and delete an application.
- Create a company and interview.
- Upload an allowed document under 5MB.
- Confirm unsupported uploads and uploads over 5MB are rejected.
- Check dashboard reminders and analytics after adding sample data.
- Test the app on desktop Chrome and a mobile viewport.
- Confirm all frontend routes, including the frontend 404 page, load correctly.
- Confirm all backend routes, including unknown API routes, return the expected JSON response.
