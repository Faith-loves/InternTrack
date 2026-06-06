# InternTrack API Documentation

Base URL:

```text
http://localhost:5000/api
```

Production base URL:

```text
https://your-render-backend-url.onrender.com/api
```

## Response Format

Success responses return the requested data or:

```json
{
  "success": true,
  "message": "Action completed"
}
```

Error responses use:

```json
{
  "success": false,
  "message": "Readable error message",
  "errors": []
}
```

## Health

```text
GET /health
```

## Contact

```text
POST /contact
```

Body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "I have a question"
}
```

## Auth

```text
POST /auth/signup
POST /auth/login
POST /auth/refresh
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/verify-email
POST /auth/request-email-verification
GET  /auth/me
PUT  /auth/me
DELETE /auth/me
```

Private routes require:

```text
Authorization: Bearer <token>
```

## Applications

```text
GET    /applications
POST   /applications
GET    /applications/:id
PUT    /applications/:id
DELETE /applications/:id
```

Application fields include company, role, status, status history, deadline, source, salary, job posting archive, rejection reason, recruiter details, documents used, notes, and follow-up date.

## Companies

```text
GET    /companies
POST   /companies
GET    /companies/:id
PUT    /companies/:id
DELETE /companies/:id
```

## Interviews

```text
GET    /interviews
POST   /interviews
GET    /interviews/:id
PUT    /interviews/:id
DELETE /interviews/:id
```

Interview fields include preparation checklist, notes, feedback, outcome, date, time, type, link/location, and application reference.

## Documents

```text
GET    /documents
POST   /documents/upload
DELETE /documents/:id
```

Documents support CVs, cover letters, portfolios, certificates, application linking, local Multer storage, and Cloudinary storage when configured.

## Analytics

```text
GET /analytics
```

Returns totals, response rate, offer rate, interview conversion, monthly application trends, best-performing CVs, and company response rankings.

## Notifications

```text
GET /notifications
```

Returns smart reminders for follow-ups, interviews, deadlines, and overdue applications.
